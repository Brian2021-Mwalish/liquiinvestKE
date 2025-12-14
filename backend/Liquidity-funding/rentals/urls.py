

from django.urls import path
from .views import (
    PendingReturnsView, 
    UserRentalsView, 
    CreateRentalView, 
    RentalStatusView,
    AdminActiveRentalsView
)

app_name = "rentals"

urlpatterns = [
    # Create new rental
    path("create/", CreateRentalView.as_view(), name="create-rental"),
    
    # Get user's rentals
    path("user-rentals/", UserRentalsView.as_view(), name="user-rentals"),
    
    # Get specific rental status
    path("status/<int:rental_id>/", RentalStatusView.as_view(), name="rental-status"),
    
    # Admin: Get all active rentals for monitoring
    path("admin/active/", AdminActiveRentalsView.as_view(), name="admin-active-rentals"),
    
    # Legacy endpoint (keep for compatibility)
    path("pending-returns/", PendingReturnsView.as_view(), name="pending-returns"),
]
