# payments/models.py
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import timedelta
from Users.models import CustomUser



# -----------------------
# Wallet Model
# -----------------------
class Wallet(models.Model):
    """
    Each user has one wallet that tracks their KES balance.
    Updated automatically whenever balance changes or user is created.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Available for withdrawal
    rental_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Money locked in active rentals
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} — Balance: {self.balance:.2f} KES"

    class Meta:
        ordering = ["-last_updated"]
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"

    # -----------------------
    # Balance Calculation Methods
    # -----------------------
    @property
    def available_balance(self):
        """Money available for withdrawal (balance only)"""
        return self.balance

    @property
    def locked_rental_balance(self):
        """Money locked in active rentals"""
        return self.rental_balance

    @property
    def total_balance(self):
        """Total money across all accounts"""
        return self.balance + self.rental_balance

    def can_withdraw(self, amount):
        """Check if user can withdraw the specified amount"""
        return amount <= self.balance

    def add_referral_reward(self, amount):
        """Add referral reward to wallet balance"""
        self.balance += amount
        self.save()

    def add_admin_award(self, amount):
        """Add admin award to wallet balance"""
        self.balance += amount
        self.save()

    def create_rental_payment(self, amount):
        """Process rental payment by moving money from wallet to rental balance"""
        if self.balance >= amount:
            self.balance -= amount
            self.rental_balance += amount
            self.save()
            return True
        return False

    def complete_rental(self, rental_amount, return_amount):
        """Complete a rental by moving money from rental_balance to balance"""
        if self.rental_balance >= rental_amount:
            self.rental_balance -= rental_amount
            self.balance += return_amount
            self.save()
            return True
        return False


# -----------------------
# Payment Model
# -----------------------
class Payment(models.Model):
    """
    Represents a single payment (e.g., M-PESA top-up or currency rental).
    All transactions are stored in KES, even if user selected another currency.
    """
    CURRENCY_CHOICES = [
        ("KES", "Kenyan Shilling"),
        ("CAD", "Canadian Dollar"),
        ("AUD", "Australian Dollar"),
        ("GBP", "British Pound Sterling"),
        ("JPY", "Japanese Yen"),
        ("EUR", "Euro"),
        ("USD", "US Dollar"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="payments")
    currency = models.CharField(max_length=3, default="KES")
    amount_deducted = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="completed")
    checkout_request_id = models.CharField(max_length=50, blank=True, null=True, help_text="M-PESA CheckoutRequestID for STK Push tracking")

    def __str__(self):
        return f"{self.user.email} — {self.amount_deducted:.2f} {self.currency} ({self.status})"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment"
        verbose_name_plural = "Payments"


# -----------------------
# M-PESA Transaction Mapping Model
# -----------------------
class MpesaTransactionMapping(models.Model):
    """
    Maps M-PESA CheckoutRequestIDs to users for reliable callback processing
    """
    checkout_request_id = models.CharField(max_length=50, unique=True, db_index=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def __str__(self):
        return f"{self.checkout_request_id} -> {self.user.email}"
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "M-PESA Transaction Mapping"
        verbose_name_plural = "M-PESA Transaction Mappings"
        indexes = [
            models.Index(fields=['checkout_request_id']),
            models.Index(fields=['expires_at']),
        ]


# -----------------------
# Signals → Auto-create Wallet when a user is created
# -----------------------
@receiver(post_save, sender=CustomUser)
def create_user_wallet(sender, instance, created, **kwargs):
    """Automatically create a wallet when a new user is registered."""
    if created:
        Wallet.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_user_wallet(sender, instance, **kwargs):
    """Ensure wallet is saved whenever the user is updated."""
    if hasattr(instance, "wallet"):
        instance.wallet.save()


@receiver(post_save, sender=Payment)
def create_mpesa_mapping(sender, instance, created, **kwargs):
    """Create M-PESA mapping when a pending payment is created."""
    if created and instance.status == "pending" and instance.checkout_request_id:
        MpesaTransactionMapping.objects.update_or_create(
            checkout_request_id=instance.checkout_request_id,
            defaults={
                'user': instance.user,
                'phone_number': instance.user.phone_number or '',
                'amount': instance.amount_deducted,
                'currency': instance.currency,
                'expires_at': timezone.now() + timedelta(hours=24)
            }
        )
