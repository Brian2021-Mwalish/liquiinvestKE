

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, serializers
from django.db.models import Sum, Q
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .models import Rental
from payment.models import Wallet
from Users.models import CustomUser


class CreateRentalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Create a new rental by moving money from wallet to rental_balance
        """
        # Validate input data
        currency = request.data.get('currency', 'KES')
        amount = request.data.get('amount')
        duration_days = request.data.get('duration_days', 20)

        if not amount:
            return Response(
                {"error": "Amount is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = float(amount)
            duration_days = int(duration_days)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid amount or duration format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if amount <= 0:
            return Response(
                {"error": "Amount must be positive"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                # Get user's wallet
                wallet = request.user.wallet
                
                # Check if user has sufficient available balance
                if not wallet.can_withdraw(amount):
                    return Response(
                        {
                            "error": f"Insufficient available balance. Available: {wallet.available_balance}, Locked in Rentals: {wallet.locked_rental_balance}"
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Move money from wallet_balance to rental_balance
                success = wallet.create_rental_payment(amount)
                if not success:
                    return Response(
                        {"error": "Failed to process rental payment"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Create rental record
                expected_return = amount * 2  # Doubled amount
                end_date = timezone.now() + timedelta(days=duration_days)
                
                # Check if user was referred and set referrer
                referrer = None
                if request.user.referred_by:
                    referrer = request.user.referred_by

                rental = Rental.objects.create(
                    user=request.user,
                    currency=currency,
                    amount=amount,
                    expected_return=expected_return,
                    duration_days=duration_days,
                    end_date=end_date,
                    referrer=referrer
                )

                return Response({
                    "message": "Rental created successfully",
                    "rental": {
                        "id": rental.id,
                        "unique_id": str(rental.unique_id),
                        "currency": rental.currency,
                        "amount": float(rental.amount),
                        "expected_return": float(rental.expected_return),
                        "status": rental.status,
                        "duration_days": rental.duration_days,
                        "created_at": rental.created_at.isoformat(),
                        "end_date": rental.end_date.isoformat(),
                        "referrer": rental.referrer.email if rental.referrer else None
                    },
                    "wallet_balances": {
                        "available_balance": float(wallet.available_balance),
                        "locked_rental_balance": float(wallet.locked_rental_balance),
                        "total_balance": float(wallet.total_balance)
                    }
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"Failed to create rental: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PendingReturnsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns the sum of expected_return for all active rentals of the authenticated user.
        """
        total_pending_returns = Rental.objects.filter(
            user=request.user,
            status="active"
        ).aggregate(total=Sum("expected_return"))["total"] or 0

        return Response({"pending_returns": float(total_pending_returns)}, status=status.HTTP_200_OK)


class UserRentalsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns all rentals for the authenticated user with full details.
        """
        rentals = Rental.objects.filter(user=request.user).order_by("-created_at")
        rental_data = []
        for rental in rentals:
            # Check if rental is mature and ready for completion
            is_mature = rental.end_date <= timezone.now() if rental.end_date else False
            
            rental_data.append({
                "id": rental.id,
                "unique_id": str(rental.unique_id),
                "currency": rental.currency,
                "amount": float(rental.amount),
                "expected_return": float(rental.expected_return),
                "status": rental.status,
                "duration_days": rental.duration_days,
                "created_at": rental.created_at.isoformat(),
                "end_date": rental.end_date.isoformat() if rental.end_date else None,
                "is_completed": rental.is_completed,
                "completion_date": rental.completion_date.isoformat() if rental.completion_date else None,
                "is_claimed": rental.is_claimed,
                "referrer": rental.referrer.email if rental.referrer else None,
                "referral_reward_given": rental.referral_reward_given,
                "is_mature": is_mature and not rental.is_completed,
                "days_remaining": max(0, (rental.end_date - timezone.now()).days) if rental.end_date else None
            })

        return Response({"rentals": rental_data}, status=status.HTTP_200_OK)


class RentalStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, rental_id):
        """
        Get detailed status of a specific rental
        """
        try:
            rental = Rental.objects.get(id=rental_id, user=request.user)
        except Rental.DoesNotExist:
            return Response(
                {"error": "Rental not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if rental is mature and ready for completion
        is_mature = rental.end_date <= timezone.now() if rental.end_date else False
        

        return Response({
            "rental": {
                "id": rental.id,
                "unique_id": str(rental.unique_id),
                "currency": rental.currency,
                "amount": float(rental.amount),
                "expected_return": float(rental.expected_return),
                "status": rental.status,
                "duration_days": rental.duration_days,
                "created_at": rental.created_at.isoformat(),
                "end_date": rental.end_date.isoformat() if rental.end_date else None,
                "is_completed": rental.is_completed,
                "completion_date": rental.completion_date.isoformat() if rental.completion_date else None,
                "is_claimed": rental.is_claimed,
                "referrer": rental.referrer.email if rental.referrer else None,
                "referral_reward_given": rental.referral_reward_given,
                "is_mature": is_mature and not rental.is_completed,
                "days_remaining": max(0, (rental.end_date - timezone.now()).days) if rental.end_date else None
            }
        }, status=status.HTTP_200_OK)


class AdminActiveRentalsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns all active rentals for admin monitoring with user details
        """
        # Check if user is admin/superuser
        if not request.user.is_staff and not request.user.is_superuser:
            return Response(
                {"error": "Access denied. Admin privileges required."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all active rentals
        active_rentals = Rental.objects.filter(
            status="active",
            is_completed=False
        ).select_related('user').order_by('-created_at')

        rental_data = []
        total_locked_amount = 0
        total_expected_returns = 0

        for rental in active_rentals:
            # Calculate time remaining
            time_remaining = None
            is_mature = False
            
            if rental.end_date:
                time_remaining = rental.end_date - timezone.now()
                is_mature = time_remaining <= timedelta(0) and not rental.is_completed
                
                # Format time remaining
                if time_remaining.total_seconds() > 0:
                    days = time_remaining.days
                    hours = time_remaining.seconds // 3600
                    time_remaining_str = f"{days}d {hours}h"
                else:
                    time_remaining_str = "Mature"
            
            rental_data.append({
                "id": rental.id,
                "unique_id": str(rental.unique_id),
                "user_email": rental.user.email,
                "user_full_name": f"{rental.user.first_name} {rental.user.last_name}".strip() or rental.user.username,
                "currency": rental.currency,
                "amount": float(rental.amount),
                "expected_return": float(rental.expected_return),
                "status": rental.status,
                "duration_days": rental.duration_days,
                "created_at": rental.created_at.isoformat(),
                "end_date": rental.end_date.isoformat() if rental.end_date else None,
                "time_remaining": time_remaining_str if time_remaining_str else None,
                "is_mature": is_mature,
                "days_remaining": max(0, time_remaining.days) if time_remaining and time_remaining.days > 0 else 0,
                "hours_remaining": max(0, time_remaining.seconds // 3600) if time_remaining and time_remaining.total_seconds() > 0 else 0,
                "referrer": rental.referrer.email if rental.referrer else None,
                "referral_reward_given": rental.referral_reward_given
            })
            
            # Add to totals
            total_locked_amount += float(rental.amount)
            total_expected_returns += float(rental.expected_return)

        return Response({
            "active_rentals": rental_data,
            "summary": {
                "total_active_rentals": len(rental_data),
                "total_locked_amount": total_locked_amount,
                "total_expected_returns": total_expected_returns,
                "total_mature_rentals": len([r for r in rental_data if r["is_mature"]])
            }
        }, status=status.HTTP_200_OK)
