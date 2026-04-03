import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import get_settings

settings = get_settings()


class EmailService:
    async def send_license_key(self, to_email: str, license_key: str, tier: str) -> bool:
        """Send license key email to user."""
        if not settings.smtp_host:
            return False

        subject = "Your Stake Advisor License Key"
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Welcome to Stake Advisor!</h1>
            <p>Thank you for your purchase. Here is your license key:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px;">
                {license_key}
            </div>
            <p><strong>Plan:</strong> {tier.replace('_', ' ').title()}</p>
            <h3>How to activate:</h3>
            <ol>
                <li>Open Stake Advisor on your computer</li>
                <li>Go to Settings → License</li>
                <li>Enter your license key above</li>
                <li>Click Activate</li>
            </ol>
            <p>You can activate this license on up to 2 devices.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                If you have any questions, please contact support@stakeadvisor.app
            </p>
        </body>
        </html>
        """

        return await self._send_email(to_email, subject, html_body)

    async def send_subscription_canceled(self, to_email: str, expires_at: str) -> bool:
        """Send subscription cancellation notice."""
        if not settings.smtp_host:
            return False

        subject = "Your Stake Advisor Subscription Has Been Canceled"
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Subscription Canceled</h1>
            <p>Your Stake Advisor subscription has been canceled.</p>
            <p>Your license will remain active until: <strong>{expires_at}</strong></p>
            <p>You can resubscribe at any time to continue using all features.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                If you have any questions, please contact support@stakeadvisor.app
            </p>
        </body>
        </html>
        """

        return await self._send_email(to_email, subject, html_body)

    async def _send_email(self, to_email: str, subject: str, html_body: str) -> bool:
        """Send an email."""
        try:
            message = MIMEMultipart("alternative")
            message["From"] = settings.smtp_from
            message["To"] = to_email
            message["Subject"] = subject

            html_part = MIMEText(html_body, "html")
            message.attach(html_part)

            await aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_user,
                password=settings.smtp_password,
                start_tls=True,
            )
            return True
        except Exception:
            return False
