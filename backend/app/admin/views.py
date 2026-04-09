from datetime import datetime, timedelta

from sqladmin import Admin, ModelView

from app.models import (
    User,
    License,
    Subscription,
    DeviceActivation,
    PaddleWebhook,
    AdminUser,
    AuditLog,
    AdminSession,
    RevenueTransaction,
    Referral,
    Commission,
    AffiliatePayout,
    UserNote,
    UserTag,
    UserTagAssignment,
    UserActivityLog,
    SystemSetting,
)
from app.admin.auth import AdminAuth


class UserAdmin(ModelView, model=User):
    column_list = ["id", "email", "name", "is_active", "created_at"]
    column_searchable_list = ["email", "name", "paddle_customer_id"]
    column_sortable_list = ["email", "created_at", "is_active"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    form_excluded_columns = [
        "licenses",
        "subscriptions",
        "referred_by",
        "referred_users",
        "referrals",
        "referral_record",
        "commissions",
        "payouts",
        "notes",
        "tag_assignments",
        "activity_logs",
        "revenue_transactions",
    ]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"

    async def on_model_delete(self, model, request):
        # Keep nullable history rows while removing the user graph.
        for referred_user in list(model.referred_users):
            referred_user.referred_by = None

        for transaction in list(model.revenue_transactions):
            transaction.user = None

        for subscription in list(model.subscriptions):
            for transaction in list(subscription.revenue_transactions):
                transaction.subscription = None


class LicenseAdmin(ModelView, model=License):
    column_list = [
        "id",
        "license_key",
        "user",
        "tier",
        "status",
        "activated_devices",
        "max_devices",
        "expires_at",
    ]
    column_searchable_list = ["license_key"]
    column_sortable_list = ["created_at", "expires_at", "status"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    form_excluded_columns = ["device_activations", "subscription"]
    name = "License"
    name_plural = "Licenses"
    icon = "fa-solid fa-key"

    async def on_model_change(self, data, model, is_created, request):
        """Auto-calculate expiration date based on tier if not set."""
        if is_created and not data.get("expires_at"):
            tier = data.get("tier")
            if tier:
                tier_days = {
                    "day": 1,
                    "week": 7,
                    "month": 30,
                    "6month": 180,
                    "year": 365,
                }
                tier_value = tier.value if hasattr(tier, 'value') else str(tier)
                days = tier_days.get(tier_value, 30)
                model.expires_at = datetime.utcnow() + timedelta(days=days)


class SubscriptionAdmin(ModelView, model=Subscription):
    column_list = [
        "id",
        "paddle_subscription_id",
        "user",
        "status",
        "current_period_end",
    ]
    column_searchable_list = ["paddle_subscription_id"]
    column_sortable_list = ["created_at", "status"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Subscription"
    name_plural = "Subscriptions"
    icon = "fa-solid fa-credit-card"


class DeviceActivationAdmin(ModelView, model=DeviceActivation):
    column_list = [
        "id",
        "license",
        "device_fingerprint",
        "is_active",
        "activated_at",
        "last_validated_at",
    ]
    column_searchable_list = ["device_fingerprint"]
    column_sortable_list = ["activated_at", "is_active"]
    column_default_sort = [("activated_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Device"
    name_plural = "Devices"
    icon = "fa-solid fa-laptop"


class PaddleWebhookAdmin(ModelView, model=PaddleWebhook):
    column_list = [
        "id",
        "event_type",
        "paddle_event_id",
        "processed",
        "created_at",
    ]
    column_searchable_list = ["paddle_event_id", "event_type"]
    column_sortable_list = ["created_at", "processed"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Webhook"
    name_plural = "Webhooks"
    icon = "fa-solid fa-globe"


class AdminUserAdmin(ModelView, model=AdminUser):
    column_list = ["id", "email", "role", "created_at"]
    column_searchable_list = ["email"]
    column_default_sort = [("created_at", True)]
    form_excluded_columns = ["password_hash"]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Admin User"
    name_plural = "Admin Users"
    icon = "fa-solid fa-user-shield"


class AuditLogAdmin(ModelView, model=AuditLog):
    column_list = [
        "id",
        "entity_type",
        "entity_id",
        "action",
        "actor_type",
        "actor_email",
        "created_at",
    ]
    column_searchable_list = ["entity_type", "action", "actor_email"]
    column_sortable_list = ["created_at"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Audit Log"
    name_plural = "Audit Logs"
    icon = "fa-solid fa-clipboard-list"


class AdminSessionAdmin(ModelView, model=AdminSession):
    column_list = ["id", "admin_user", "ip_address", "expires_at", "created_at"]
    column_sortable_list = ["created_at", "expires_at"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Admin Session"
    name_plural = "Admin Sessions"
    icon = "fa-solid fa-clock"


class RevenueTransactionAdmin(ModelView, model=RevenueTransaction):
    column_list = [
        "id",
        "user",
        "transaction_type",
        "status",
        "amount",
        "currency",
        "plan_tier",
        "transaction_date",
    ]
    column_searchable_list = ["paddle_transaction_id"]
    column_sortable_list = ["transaction_date", "amount"]
    column_default_sort = [("transaction_date", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Transaction"
    name_plural = "Transactions"
    icon = "fa-solid fa-dollar-sign"


class ReferralAdmin(ModelView, model=Referral):
    column_list = [
        "id",
        "affiliate",
        "referred_user",
        "referral_code_used",
        "converted",
        "converted_at",
        "ip_address",
        "admin_notes",
        "created_at",
    ]
    column_searchable_list = ["referral_code_used", "ip_address", "admin_notes"]
    column_sortable_list = ["created_at", "converted", "converted_at"]
    column_default_sort = [("created_at", True)]
    column_filters = ["converted", "referral_code_used", "created_at"]
    column_labels = {
        "affiliate": "Affiliate (Referrer)",
        "referred_user": "Referred User",
        "referral_code_used": "Code Used",
        "converted": "Paid?",
        "converted_at": "Converted At",
    }
    column_formatters = {
        "converted": lambda m, a: "Yes" if m.converted else "No",
    }
    form_columns = ["affiliate", "referred_user", "referral_code_used", "converted", "converted_at", "ip_address", "admin_notes"]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Referral"
    name_plural = "Referrals"
    icon = "fa-solid fa-users"


class CommissionAdmin(ModelView, model=Commission):
    column_list = [
        "id",
        "affiliate",
        "referral",
        "amount",
        "base_amount",
        "commission_rate",
        "currency",
        "status",
        "reviewed_by",
        "reviewed_at",
        "rejection_reason",
        "created_at",
    ]
    column_searchable_list = ["reviewed_by", "rejection_reason"]
    column_sortable_list = ["created_at", "amount", "status", "commission_rate"]
    column_default_sort = [("created_at", True)]
    column_filters = ["status", "commission_rate", "created_at"]
    column_labels = {
        "amount": "Commission ($)",
        "base_amount": "Sale Amount ($)",
        "commission_rate": "Rate (%)",
        "reviewed_by": "Reviewed By",
        "reviewed_at": "Reviewed At",
    }
    column_formatters = {
        "amount": lambda m, a: f"${m.amount / 100:.2f}" if m.amount else "$0.00",
        "base_amount": lambda m, a: f"${m.base_amount / 100:.2f}" if m.base_amount else "$0.00",
        "commission_rate": lambda m, a: f"{m.commission_rate}%",
    }
    form_columns = ["affiliate", "referral", "amount", "base_amount", "commission_rate", "currency", "status", "reviewed_by", "rejection_reason"]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Commission"
    name_plural = "Commissions"
    icon = "fa-solid fa-coins"


class AffiliatePayoutAdmin(ModelView, model=AffiliatePayout):
    column_list = [
        "id",
        "affiliate",
        "amount",
        "currency",
        "status",
        "payment_method",
        "payment_reference",
        "processed_by",
        "requested_at",
        "processed_at",
        "notes",
    ]
    column_searchable_list = ["payment_reference", "processed_by", "notes"]
    column_sortable_list = ["created_at", "amount", "status", "requested_at", "processed_at"]
    column_default_sort = [("created_at", True)]
    column_filters = ["status", "payment_method", "created_at"]
    column_labels = {
        "amount": "Payout Amount ($)",
        "payment_method": "Method",
        "payment_reference": "Reference #",
        "processed_by": "Processed By",
    }
    column_formatters = {
        "amount": lambda m, a: f"${m.amount / 100:.2f}" if m.amount else "$0.00",
    }
    form_columns = ["affiliate", "amount", "currency", "status", "payment_method", "payment_reference", "processed_by", "notes"]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Payout"
    name_plural = "Payouts"
    icon = "fa-solid fa-money-bill-transfer"


class UserNoteAdmin(ModelView, model=UserNote):
    column_list = ["id", "user", "admin", "content", "created_at"]
    column_sortable_list = ["created_at"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "User Note"
    name_plural = "User Notes"
    icon = "fa-solid fa-sticky-note"


class UserTagAdmin(ModelView, model=UserTag):
    column_list = ["id", "name", "color", "description", "created_at"]
    column_searchable_list = ["name"]
    column_sortable_list = ["name", "created_at"]
    column_default_sort = [("name", False)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "User Tag"
    name_plural = "User Tags"
    icon = "fa-solid fa-tag"


class UserActivityLogAdmin(ModelView, model=UserActivityLog):
    column_list = ["id", "user", "activity_type", "ip_address", "created_at"]
    column_searchable_list = ["activity_type"]
    column_sortable_list = ["created_at"]
    column_default_sort = [("created_at", True)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "User Activity"
    name_plural = "User Activities"
    icon = "fa-solid fa-chart-line"


class SystemSettingAdmin(ModelView, model=SystemSetting):
    column_list = ["id", "key", "description", "updated_at", "updated_by"]
    column_searchable_list = ["key"]
    column_sortable_list = ["key", "updated_at"]
    column_default_sort = [("key", False)]
    can_create = True
    can_edit = True
    can_delete = True
    name = "Setting"
    name_plural = "Settings"
    icon = "fa-solid fa-cog"


def setup_admin(app, engine):
    """Setup SQLAdmin with all model views."""
    from app.config import get_settings

    settings = get_settings()

    admin = Admin(
        app,
        engine,
        authentication_backend=AdminAuth(settings.secret_key),
        title="Stake Advisor Admin",
    )

    # Core models
    admin.add_view(UserAdmin)
    admin.add_view(LicenseAdmin)
    admin.add_view(SubscriptionAdmin)
    admin.add_view(DeviceActivationAdmin)

    # Revenue & Payments
    admin.add_view(RevenueTransactionAdmin)
    admin.add_view(PaddleWebhookAdmin)

    # Affiliates
    admin.add_view(ReferralAdmin)
    admin.add_view(CommissionAdmin)
    admin.add_view(AffiliatePayoutAdmin)

    # User Management
    admin.add_view(UserNoteAdmin)
    admin.add_view(UserTagAdmin)
    admin.add_view(UserActivityLogAdmin)

    # Admin
    admin.add_view(AdminUserAdmin)
    admin.add_view(AdminSessionAdmin)
    admin.add_view(AuditLogAdmin)

    # Settings
    admin.add_view(SystemSettingAdmin)

    return admin
