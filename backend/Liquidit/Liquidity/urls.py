# project_root/urls.py
from django.contrib import admin
from django.urls import path, include
from Liquidity import frontend_views
from Liquidity import root_view
from Users.views import (
    ProfileView,
    ReferralCodeView,
    ReferralHistoryView,
    KYCProfileDetailView,
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Auth & User routes
    path("api/auth/", include(("Users.urls", "users"), namespace="users")),

    # Payments routes
    path("api/payments/", include(("payment.urls", "payment"), namespace="payments")),

    # Rentals routes
    path("api/rentals/", include(("rentals.urls", "rentals"), namespace="rentals")),

    # Withdrawals routes
    path("api/withdraw/", include(("withdrawal.urls", "withdrawal"), namespace="withdrawal")),

    # Support routes
    path("api/support/", include(("support.urls", "support"), namespace="support")),

    # Direct profile shortcut
    path("api/profile/", ProfileView.as_view(), name="profile-direct"),

    # Direct KYC shortcut
    path("api/kyc/", KYCProfileDetailView.as_view(), name="kyc-direct"),

    # Referrals shortcuts
    path("api/referrals/code/", ReferralCodeView.as_view(), name="referral-code-direct"),
    path("api/referrals/history/", ReferralHistoryView.as_view(), name="referral-history-direct"),

    # Add other project-specific routes here if needed
]

# Fallback frontend routes (serve React build)
urlpatterns += [
    path('', frontend_views.index),
    path('assets/<path:path>', frontend_views.assets, name='frontend-assets'),
]
