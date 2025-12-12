# payments/admin.py
from django.contrib import admin
from .models import Wallet, Payment, MpesaTransactionMapping


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Wallet model.
    Displays user, balance, and last update info.
    """
    list_display = ("user", "balance", "last_updated")
    list_filter = ("last_updated",)
    search_fields = ("user__email", "user__username")
    readonly_fields = ("last_updated",)
    ordering = ("-last_updated",)
    list_per_page = 25  # ✅ Pagination for performance


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin configuration for Payment model.
    Allows quick view and filtering of all transactions.
    """
    list_display = ("user", "amount_deducted", "currency", "status", "created_at")
    list_filter = ("status", "currency", "created_at")
    search_fields = ("user__email", "user__username")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    list_per_page = 25  # ✅ Prevents admin slowdown on large datasets


@admin.register(MpesaTransactionMapping)
class MpesaTransactionMappingAdmin(admin.ModelAdmin):
    """
    Admin configuration for M-PESA Transaction Mapping model.
    Manages M-PESA CheckoutRequestID to user mappings.
    """
    list_display = ("checkout_request_id", "user", "phone_number", "amount", "currency", "created_at", "expires_at")
    list_filter = ("currency", "created_at", "expires_at")
    search_fields = ("checkout_request_id", "user__email", "user__username", "phone_number")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    list_per_page = 50
    
    # Add custom actions
    actions = ["mark_expired", "delete_expired"]
    
    def mark_expired(self, request, queryset):
        """Mark selected mappings as expired"""
        from django.utils import timezone
        updated = queryset.update(expires_at=timezone.now())
        self.message_user(request, f"{updated} mappings marked as expired.")
    mark_expired.short_description = "Mark selected as expired"
    
    def delete_expired(self, request, queryset):
        """Delete expired mappings"""
        from django.utils import timezone
        deleted_count, _ = queryset.filter(expires_at__lt=timezone.now()).delete()
        self.message_user(request, f"{deleted_count} expired mappings deleted.")
    delete_expired.short_description = "Delete expired mappings"
