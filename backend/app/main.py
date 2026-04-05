from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings
from app.database import engine, init_db
from app.api.v1 import router as v1_router
from app.api.webhooks import router as webhooks_router
from app.api.admin import router as admin_api_router
from app.api.user import router as user_router
from app.admin import setup_admin
from app.admin.auth import create_admin_user

settings = get_settings()

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()

    # Create default admin user
    print(f"Creating admin user with email: {settings.admin_email}")
    admin = await create_admin_user(
        email=settings.admin_email,
        password=settings.admin_password,
        role="super_admin"
    )
    print(f"Admin user created/updated: {admin.email}, id: {admin.id}")

    yield

    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="Stake Advisor API",
    description="Subscription management backend for Stake Advisor",
    version="1.0.0",
    lifespan=lifespan,
)

# Add middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://license-keys-frontend.onrender.com",
        "https://sharkscopepro.onrender.com",
        "https://pokersharkscope.onrender.com",
        "https://www.sharkpokerclub.com",
        "https://sharkpokerclub.com",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SessionMiddleware, secret_key=settings.secret_key)

# Include routers
app.include_router(v1_router, prefix="/api")  # /api/v1/... for software license validation
app.include_router(webhooks_router)
app.include_router(admin_api_router)
app.include_router(user_router)

# Setup admin
setup_admin(app, engine)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Stake Advisor API",
        "version": "1.0.0",
        "docs": "/docs",
        "admin": "/admin",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler."""
    if settings.debug:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
