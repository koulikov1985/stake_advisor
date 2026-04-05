"""User authentication endpoints."""

import logging
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt, JWTError
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import User
from app.config import get_settings
from app.services.email_service import get_email_service

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(tags=["User Auth"])

SECRET_KEY = settings.secret_key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30
PASSWORD_RESET_EXPIRE_HOURS = 1
EMAIL_VERIFICATION_EXPIRE_HOURS = 24


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class TokenResponse(BaseModel):
    token: str
    user: dict


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class MessageResponse(BaseModel):
    message: str


def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token."""
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_password_reset_token(email: str) -> str:
    """Create JWT token for password reset."""
    expire = datetime.utcnow() + timedelta(hours=PASSWORD_RESET_EXPIRE_HOURS)
    payload = {
        "sub": email,
        "type": "password_reset",
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_email_verification_token(email: str) -> str:
    """Create JWT token for email verification."""
    expire = datetime.utcnow() + timedelta(hours=EMAIL_VERIFICATION_EXPIRE_HOURS)
    payload = {
        "sub": email,
        "type": "email_verification",
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_email_verification_token(token: str) -> Optional[str]:
    """Verify email verification token and return email."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "email_verification":
            return None
        return payload.get("sub")
    except JWTError:
        return None


def verify_token(token: str) -> Optional[dict]:
    """Verify JWT token and return payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        return payload.get("sub")
    except JWTError:
        return None


@router.post("/login", response_model=TokenResponse)
async def login(
    data: UserLogin,
    session: AsyncSession = Depends(get_session),
):
    """Login user and return JWT token."""
    email = data.email.lower()
    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # For now, simple password check (in production use proper hashing)
    if not user.verify_password(data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(str(user.id), user.email)

    return TokenResponse(
        token=token,
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    )


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    data: UserSignup,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    """Register a new user."""
    # Normalize email to lowercase
    email = data.email.lower()

    # Check if email exists
    result = await session.execute(
        select(User).where(User.email == email)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = User(
        email=email,
        name=data.name,
    )
    user.set_password(data.password)

    session.add(user)
    await session.commit()
    await session.refresh(user)

    token = create_access_token(str(user.id), user.email)

    # Send verification email in background
    email_service = get_email_service()
    verification_token = create_email_verification_token(user.email)
    background_tasks.add_task(
        email_service.send_verification_email,
        user.email,
        verification_token,
        user.name
    )

    return TokenResponse(
        token=token,
        user={
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    )


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(
    data: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    """Request password reset email."""
    email = data.email.lower()
    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    # Always return success to prevent email enumeration
    if not user:
        logger.info(f"Password reset requested for non-existent email: {data.email}")
        return MessageResponse(message="If the email exists, a reset link will be sent")

    # Generate reset token
    reset_token = create_password_reset_token(user.email)

    # Send reset email in background
    email_service = get_email_service()
    background_tasks.add_task(
        email_service.send_password_reset_email,
        user.email,
        reset_token
    )

    logger.info(f"Password reset email sent to: {user.email}")
    return MessageResponse(message="If the email exists, a reset link will be sent")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(
    data: ResetPasswordRequest,
    session: AsyncSession = Depends(get_session),
):
    """Reset password using token from email."""
    email = verify_password_reset_token(data.token)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Validate new password
    if len(data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )

    # Update password
    user.set_password(data.new_password)
    await session.commit()

    logger.info(f"Password reset successful for: {email}")
    return MessageResponse(message="Password has been reset successfully")


class VerifyEmailRequest(BaseModel):
    token: str


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(
    data: VerifyEmailRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    """Verify user email address."""
    email = verify_email_verification_token(data.token)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    result = await session.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

    if user.email_verified:
        return MessageResponse(message="Email already verified")

    # Mark email as verified
    user.email_verified = True
    await session.commit()

    # Send welcome email now that they're verified
    email_service = get_email_service()
    background_tasks.add_task(
        email_service.send_welcome_email,
        user.email,
        user.name
    )

    logger.info(f"Email verified for: {email}")
    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    data: ForgotPasswordRequest,  # Reuse - just needs email
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    """Resend email verification link."""
    result = await session.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()

    # Always return success to prevent email enumeration
    if not user:
        return MessageResponse(message="If the email exists, a verification link will be sent")

    if user.email_verified:
        return MessageResponse(message="Email is already verified")

    # Generate new verification token
    verification_token = create_email_verification_token(user.email)

    # Send verification email in background
    email_service = get_email_service()
    background_tasks.add_task(
        email_service.send_verification_email,
        user.email,
        verification_token,
        user.name
    )

    logger.info(f"Verification email resent to: {user.email}")
    return MessageResponse(message="If the email exists, a verification link will be sent")
