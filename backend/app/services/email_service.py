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
            <style>
                body {{ font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 40px; }}
                h1 {{ color: #d4af37; margin-bottom: 20px; }}
                .btn {{ display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to PokerSharkScope!</h1>
                <p>Hey {display_name},</p>
                <p>Thanks for signing up! You're now ready to start crushing the tables with real-time GTO advice.</p>
                <p>Here's what to do next:</p>
                <ol>
                    <li>Choose a subscription plan</li>
                    <li>Download the app for your platform</li>
                    <li>Enter your license key and start playing</li>
                </ol>
                <a href="{self.frontend_url}/dashboard" class="btn">Go to Dashboard</a>
                <div class="footer">
                    <p>Questions? Join our <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37;">Discord</a></p>
                    <p>PokerSharkScope - Play Smarter, Win More</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_verification_email(self, to_email: str, verification_token: str, name: Optional[str] = None) -> bool:
        """Send email verification link."""
        display_name = name or "there"
        verify_link = f"{self.frontend_url}/verify-email?token={verification_token}"
        subject = "Verify Your PokerSharkScope Email"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 40px; }}
                h1 {{ color: #d4af37; margin-bottom: 20px; }}
                .btn {{ display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verify Your Email</h1>
                <p>Hey {display_name},</p>
                <p>Thanks for signing up for PokerSharkScope! Please verify your email address by clicking the button below:</p>
                <a href="{verify_link}" class="btn">Verify Email Address</a>
                <p style="margin-top: 20px; color: #888;">This link expires in 24 hours.</p>
                <p style="color: #888;">If you didn't create an account, you can safely ignore this email.</p>
                <div class="footer">
                    <p>PokerSharkScope - Play Smarter, Win More</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_password_reset_email(self, to_email: str, reset_token: str) -> bool:
        """Send password reset email."""
        reset_link = f"{self.frontend_url}/reset-password?token={reset_token}"
        subject = "Reset Your PokerSharkScope Password"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 40px; }}
                h1 {{ color: #d4af37; margin-bottom: 20px; }}
                .btn {{ display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .warning {{ background: #3a3a2a; padding: 15px; border-radius: 8px; margin-top: 20px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Reset Your Password</h1>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <a href="{reset_link}" class="btn">Reset Password</a>
                <div class="warning">
                    <p><strong>This link expires in 1 hour.</strong></p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>PokerSharkScope - Play Smarter, Win More</p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_license_key_email(self, to_email: str, license_key: str, tier: str) -> bool:
        """Send license key email after purchase."""
        tier_display = tier.replace("_", " ").title()
        subject = f"Your PokerSharkScope License Key - {tier_display}"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 40px; }}
                h1 {{ color: #d4af37; margin-bottom: 20px; }}
                .license-box {{ background: #1a1a1a; border: 2px solid #d4af37; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
                .license-key {{ font-family: monospace; font-size: 24px; color: #d4af37; letter-spacing: 2px; }}
                .btn {{ display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .steps {{ background: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your License Key</h1>
                <p>Thank you for your purchase! Here's your license key:</p>
                <div class="license-box">
                    <div class="license-key">{license_key}</div>
                </div>
                <p><strong>Plan:</strong> {tier_display}</p>
                <div class="steps">
                    <h3 style="color: #d4af37; margin-top: 0;">How to activate:</h3>
                    <ol>
                        <li>Download the app from your dashboard</li>
                        <li>Open PokerSharkScope</li>
                        <li>Enter your license key when prompted</li>
                        <li>Click Activate and start playing!</li>
                    </ol>
                </div>
                <a href="{self.frontend_url}/dashboard" class="btn">Go to Dashboard</a>
                <div class="footer">
                    <p>You can activate this license on up to 2 devices.</p>
                    <p>Questions? Join our <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37;">Discord</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        return await self.send_email(to_email, subject, html_body)

    async def send_subscription_canceled_email(self, to_email: str, expires_at: str) -> bool:
        """Send subscription cancellation notice."""
        subject = "Your PokerSharkScope Subscription Has Been Canceled"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; }}
                .container {{ max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 12px; padding: 40px; }}
                h1 {{ color: #d4af37; margin-bottom: 20px; }}
                .info-box {{ background: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; }}
                .btn {{ display: inline-block; background: #d4af37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; color: #888; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Subscription Canceled</h1>
                <p>Your PokerSharkScope subscription has been canceled.</p>
                <div class="info-box">
                    <p><strong>Your license remains active until:</strong></p>
                    <p style="font-size: 20px; color: #d4af37;">{expires_at}</p>
                </div>
                <p>You can continue using all features until this date. After that, you can resubscribe at any time.</p>
                <a href="{self.frontend_url}/pricing" class="btn">View Plans</a>
                <div class="footer">
                    <p>We'd love to have you back! If you have any feedback, join our <a href="https://discord.gg/NHUjvZXzrR" style="color: #d4af37;">Discord</a></p>
                </div>
            </div>
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
