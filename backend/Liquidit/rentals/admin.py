# rentals/admin.py
from django.contrib import admin
from .models import Rental


@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    """
    Admin configuration for Rental model.
    Displays rental details, status, and user information.
    """
    list_display = ("user", "currency", "amount", "expected_return", "status", "created_at", "end_date", "duration_days")
    list_filter = ("status", "currency", "created_at")
    search_fields = ("user__email", "user__username", "unique_id")
    readonly_fields = ("created_at", "end_date", "unique_id")
    ordering = ("-created_at",)
    list_per_page = 50
    
    # Organize fields in the detail view
    fieldsets = (
        ("User Information", {
            "fields": ("user",)
        }),
        ("Rental Details", {
            "fields": ("currency", "amount", "expected_return", "status")
        }),
        ("Duration & Dates", {
            "fields": ("duration_days", "created_at", "end_date")
        }),
        ("Unique Identifier", {
            "fields": ("unique_id",),
            "classes": ("collapse",)
        }),
    )
    
    # Custom actions
    actions = ["mark_completed", "mark_failed"]
    
    def mark_completed(self, request, queryset):
        """Mark selected rentals as completed"""
        updated = queryset.update(status="completed")
        self.message_user(request, f"{updated} rentals marked as completed.")
    mark_completed.short_description = "Mark selected as completed"
    
    def mark_failed(self, request, queryset):
        """Mark selected rentals as failed"""
        updated = queryset.update(status="failed")
        self.message_user(request, f"{updated} rentals marked as failed.")
    mark_failed.short_description = "Mark selected as failed"
