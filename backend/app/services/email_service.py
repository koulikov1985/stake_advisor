"""Email service using Resend."""

import logging
from typing import Optional

import resend

from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

# Initialize Resend
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key


class EmailService:
    """Email service using Resend API."""

    def __init__(self):
        self.from_email = settings.email_from
        self.frontend_url = settings.frontend_url

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
    ) -> bool:
        """Send an email using Resend."""
        if not settings.resend_api_key:
            logger.warning("Resend API key not configured, skipping email")
            return False

        try:
            resend.Emails.send({
                "from": self.from_email,
                "to": [to_email],
                "subject": subject,
                "html": html_body,
            })
            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False

    async def send_welcome_email(self, to_email: str, name: Optional[str] = None) -> bool:
        """Send welcome email after signup."""
        display_name = name or "there"
        subject = "Welcome to PokerSharkScope!"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <span style="font-size: 32px; color: #d4af37;">&#9824;</span>
                                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 8px;">Poker</span><span style="font-size: 24px; font-weight: 700; color: #d4af37;">SharkScope</span>
                                </td>
                            </tr>
                            <!-- Main Card -->
                            <tr>
                                <td style="background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                                    <!-- Icon -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 24px;">
                                                <div style="width: 72px; height: 72px; background: linear-gradient(135deg, rgba(0,217,126,0.2) 0%, rgba(0,217,126,0.05) 100%); border: 1px solid rgba(0,217,126,0.3); border-radius: 50%; line-height: 72px; text-align: center;">
                                                    <span style="font-size: 32px;">&#127881;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Heading -->
                                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                        Welcome to PokerSharkScope!
                                    </h1>
                                    <!-- Subtext -->
                                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                                        Hey {display_name}, your email is verified and you're ready to crush the tables with real-time GTO advice!
                                    </p>
                                    <!-- Steps -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                        <tr>
                                            <td style="background: rgba(255,255,255,0.03); border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px;">
                                                <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
                                                    Get Started in 3 Steps
                                                </p>
                                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">1</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Choose a subscription plan</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">2</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Download the app for your platform</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">3</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Enter your license key and start winning</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Button -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <a href="{self.frontend_url}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                                    Go to Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding-top: 32px; text-align: center;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        Questions? <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37; text-decoration: none;">Join our Discord community</a>
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #444444;">
                                        PokerSharkScope - Play Smarter, Win More
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_verification_email(self, to_email: str, verification_token: str, name: Optional[str] = None) -> bool:
        """Send email verification link."""
        display_name = name or "there"
        verify_link = f"{self.frontend_url}/verify-email?token={verification_token}"
        subject = "Verify Your Email - PokerSharkScope"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <span style="font-size: 32px; color: #d4af37;">&#9824;</span>
                                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 8px;">Poker</span><span style="font-size: 24px; font-weight: 700; color: #d4af37;">SharkScope</span>
                                </td>
                            </tr>
                            <!-- Main Card -->
                            <tr>
                                <td style="background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                                    <!-- Icon -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 24px;">
                                                <div style="width: 72px; height: 72px; background: linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%); border: 1px solid rgba(212,175,55,0.3); border-radius: 50%; line-height: 72px; text-align: center;">
                                                    <span style="font-size: 32px;">&#9993;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Heading -->
                                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                        Verify Your Email
                                    </h1>
                                    <!-- Subtext -->
                                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                                        Hey {display_name}, thanks for joining PokerSharkScope!<br>
                                        Click the button below to verify your email and get started.
                                    </p>
                                    <!-- Button -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 32px;">
                                                <a href="{verify_link}" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                                    Verify Email Address
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Expiry Notice -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.15); border-radius: 8px;">
                                        <tr>
                                            <td style="padding: 16px; text-align: center;">
                                                <p style="margin: 0; font-size: 14px; color: #d4af37;">
                                                    &#9202; This link expires in 24 hours
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding-top: 32px; text-align: center;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        Didn't create an account? You can safely ignore this email.
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #666666;">
                                        Questions? <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37; text-decoration: none;">Join our Discord</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email."""
        reset_link = f"{self.frontend_url}/reset-password?token={reset_token}"
        subject = "Reset Your Password - PokerSharkScope"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <span style="font-size: 32px; color: #d4af37;">&#9824;</span>
                                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 8px;">Poker</span><span style="font-size: 24px; font-weight: 700; color: #d4af37;">SharkScope</span>
                                </td>
                            </tr>
                            <!-- Main Card -->
                            <tr>
                                <td style="background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                                    <!-- Icon -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 24px;">
                                                <div style="width: 72px; height: 72px; background: linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%); border: 1px solid rgba(239,68,68,0.3); border-radius: 50%; line-height: 72px; text-align: center;">
                                                    <span style="font-size: 32px;">&#128274;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Heading -->
                                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                        Reset Your Password
                                    </h1>
                                    <!-- Subtext -->
                                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                                        We received a request to reset your password.<br>
                                        Click the button below to create a new one.
                                    </p>
                                    <!-- Button -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 32px;">
                                                <a href="{reset_link}" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                                    Reset Password
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Warning Notice -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: 8px;">
                                        <tr>
                                            <td style="padding: 16px; text-align: center;">
                                                <p style="margin: 0 0 4px; font-size: 14px; color: #ef4444; font-weight: 600;">
                                                    &#9202; This link expires in 1 hour
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: #888888;">
                                                    If you didn't request this, you can safely ignore this email.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding-top: 32px; text-align: center;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        Need help? <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37; text-decoration: none;">Contact us on Discord</a>
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #444444;">
                                        PokerSharkScope - Play Smarter, Win More
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_license_key_email(self, to_email: str, license_key: str, tier: str) -> bool:
        """Send license key email after purchase."""
        tier_display = tier.replace("_", " ").title()
        subject = f"Your License Key - {tier_display} Plan"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <span style="font-size: 32px; color: #d4af37;">&#9824;</span>
                                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 8px;">Poker</span><span style="font-size: 24px; font-weight: 700; color: #d4af37;">SharkScope</span>
                                </td>
                            </tr>
                            <!-- Main Card -->
                            <tr>
                                <td style="background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                                    <!-- Icon -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 24px;">
                                                <div style="width: 72px; height: 72px; background: linear-gradient(135deg, rgba(0,217,126,0.2) 0%, rgba(0,217,126,0.05) 100%); border: 1px solid rgba(0,217,126,0.3); border-radius: 50%; line-height: 72px; text-align: center;">
                                                    <span style="font-size: 32px;">&#128273;</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Heading -->
                                    <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                        Thank You for Your Purchase!
                                    </h1>
                                    <p style="margin: 0 0 24px; font-size: 14px; color: #888888; text-align: center;">
                                        {tier_display} Plan
                                    </p>
                                    <!-- License Key Box -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%); border: 2px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 24px; text-align: center;">
                                                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 1px;">
                                                    Your License Key
                                                </p>
                                                <p style="margin: 0; font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 20px; font-weight: 700; color: #d4af37; letter-spacing: 2px;">
                                                    {license_key}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Steps -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                        <tr>
                                            <td style="background: rgba(255,255,255,0.03); border: 1px solid #2a2a2a; border-radius: 12px; padding: 24px;">
                                                <p style="margin: 0 0 16px; font-size: 14px; font-weight: 600; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">
                                                    How to Activate
                                                </p>
                                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">1</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Download the app from your dashboard</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">2</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Open PokerSharkScope</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(212,175,55,0.2); color: #d4af37; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">3</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Enter your license key when prompted</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 8px 0;">
                                                            <span style="display: inline-block; width: 24px; height: 24px; background: rgba(0,217,126,0.2); color: #00d97e; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; font-weight: 700; margin-right: 12px;">&#10003;</span>
                                                            <span style="color: #e0e0e0; font-size: 15px;">Start crushing the tables!</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Button -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <a href="{self.frontend_url}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                                    Go to Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding-top: 32px; text-align: center;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        You can activate this license on up to 2 devices
                                    </p>
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        Questions? <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37; text-decoration: none;">Join our Discord</a>
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #444444;">
                                        PokerSharkScope - Play Smarter, Win More
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_subscription_canceled_email(self, to_email: str, expires_at: str) -> bool:
        """Send subscription cancellation notice."""
        subject = "Subscription Canceled - PokerSharkScope"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px;">
                            <!-- Logo -->
                            <tr>
                                <td align="center" style="padding-bottom: 32px;">
                                    <span style="font-size: 32px; color: #d4af37;">&#9824;</span>
                                    <span style="font-size: 24px; font-weight: 700; color: #ffffff; margin-left: 8px;">Poker</span><span style="font-size: 24px; font-weight: 700; color: #d4af37;">SharkScope</span>
                                </td>
                            </tr>
                            <!-- Main Card -->
                            <tr>
                                <td style="background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%); border: 1px solid #2a2a2a; border-radius: 16px; padding: 48px 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                                    <!-- Heading -->
                                    <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 700; color: #ffffff; text-align: center; letter-spacing: -0.5px;">
                                        Subscription Canceled
                                    </h1>
                                    <!-- Subtext -->
                                    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                                        We're sorry to see you go. Your subscription has been canceled.
                                    </p>
                                    <!-- Expiry Box -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                        <tr>
                                            <td style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.2); border-radius: 12px; padding: 24px; text-align: center;">
                                                <p style="margin: 0 0 8px; font-size: 14px; color: #888888;">
                                                    Your license remains active until
                                                </p>
                                                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d4af37;">
                                                    {expires_at}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- Info Text -->
                                    <p style="margin: 0 0 32px; font-size: 15px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                                        You can continue using all features until this date.<br>
                                        After that, you can resubscribe at any time.
                                    </p>
                                    <!-- Button -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <a href="{self.frontend_url}/pricing" style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%); color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 8px; box-shadow: 0 4px 16px rgba(212,175,55,0.3);">
                                                    View Plans
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                                <td style="padding-top: 32px; text-align: center;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        We'd love to have you back! Questions or feedback?
                                    </p>
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37; text-decoration: none;">Join our Discord community</a>
                                    </p>
                                    <p style="margin: 0; font-size: 13px; color: #444444;">
                                        PokerSharkScope - Play Smarter, Win More
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)


# Global instance
_email_service: Optional[EmailService] = None


def get_email_service() -> EmailService:
    """Get the global email service instance."""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
