# payments/views.py
import requests
import json
import logging
import base64
from decimal import Decimal
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.utils import timezone

from .models import Payment, Wallet
from .serializers import PaymentSerializer
from Users.models import Referral
from rentals.models import Rental

logger = logging.getLogger(__name__)

def process_referral_reward(user, amount):
    """
    Process referral reward when a user rents a coin.
    Gives 50% of rental amount to the referrer.
    """
    logger.info(f"Processing referral reward for user {user.email}, amount {amount}")
    
    if getattr(user, "referred_by", None):
        reward = Decimal(str(amount)) / Decimal('2')  # 50% of rental amount
        ref_wallet, _ = Wallet.objects.get_or_create(user=user.referred_by)
        old_ref_balance = ref_wallet.balance
        ref_wallet.balance += reward
        ref_wallet.save(update_fields=["balance"])
        
        # Also update the referrer's wallet_balance field
        old_user_ref_balance = user.referred_by.wallet_balance
        user.referred_by.wallet_balance += reward
        user.referred_by.save(update_fields=["wallet_balance"])

        Referral.objects.update_or_create(
            referrer=user.referred_by,
            referred=user,
            defaults={"reward": reward},
        )
        
        logger.info(f"Referral reward processed: {reward} awarded to {user.referred_by.email} for {user.email}'s rental")
        logger.info(f"Referrer wallet balance updated from {old_ref_balance} to {ref_wallet.balance}")
        logger.info(f"Referrer user wallet_balance updated from {old_user_ref_balance} to {user.referred_by.wallet_balance}")
        return reward
    else:
        logger.info(f"No referrer found for user {user.email}")
    return 0
User = get_user_model()

# --- Currency Deduction Rules (amounts in KES) ---
CURRENCY_COSTS = {
    "CAD": 100,
    "AUD": 250,
    "GBP": 500,
    "JPY": 750,
    "EUR": 1000,
    "USD": 1200,
}


# ---------------------------#
# Helper: Normalize phone number
# ---------------------------#
def normalize_phone(phone):
    """
    Convert Kenyan phone numbers to international format.
    - 07XXXXXXXX -> 2547XXXXXXXX
    - 7XXXXXXXX  -> 2547XXXXXXXX
    - 2547XXXXXXXX -> unchanged
    """
    phone = phone.strip()
    if phone.startswith("0"):
        return "254" + phone[1:]
    elif phone.startswith("7"):
        return "254" + phone
    elif phone.startswith("254"):
        return phone
    raise ValueError("Invalid phone number format")


# ---------------------------#
# Helper: Get M-PESA Access Token
# ---------------------------#
def get_mpesa_access_token():
    """Fetch OAuth token from M-PESA API."""
    url = f"{settings.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    headers = {"Authorization": f"Basic {settings.MPESA_BASE64_ENCODED_CREDENTIALS}"}

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        token_data = response.json()
        return token_data.get("access_token")
    except requests.RequestException as e:
        logger.error(f"M-PESA token request failed: {e}")
        return None


# ---------------------------#
# 1. Get Wallet Balance (GET)
# ---------------------------#
class GetBalanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        return Response({"balance": wallet.balance}, status=status.HTTP_200_OK)


# ---------------------------#
# 2. Initiate Mpesa STK Push
# ---------------------------#
class MpesaPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        card_currency = request.data.get("currency")
        phone = request.data.get("phone")

        if not card_currency:
            return Response({"error": "Currency required"}, status=400)

        if card_currency not in CURRENCY_COSTS:
            return Response({"error": "Unsupported currency"}, status=400)

        amount = CURRENCY_COSTS[card_currency]

        if phone:
            # M-Pesa initiation
            try:
                phone = normalize_phone(phone)
            except ValueError:
                return Response({"error": "Invalid phone number format"}, status=400)

            # Validate callback URL
            if not settings.MPESA_CALLBACK_URL:
                logger.error("MPESA_CALLBACK_URL not set")
                return Response({"error": "M-PESA callback URL not configured"}, status=500)

            # Get M-PESA access token
            access_token = get_mpesa_access_token()
            if not access_token:
                return Response({"error": "Failed to retrieve M-PESA access token"}, status=500)

            # Generate current timestamp and password
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            password = base64.b64encode(f"{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}".encode()).decode()

            # Log environment and payload
            logger.info(f"M-PESA Environment: {settings.MPESA_ENV}, Base URL: {settings.MPESA_BASE_URL}")

            # Prepare STK Push
            stk_url = f"{settings.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest"
            headers = {"Authorization": f"Bearer {access_token}"}
            payload = {
                "BusinessShortCode": settings.MPESA_SHORTCODE,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerBuyGoodsOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": settings.MPESA_TILL_NUMBER,
                "PhoneNumber": phone,
                "CallBackURL": settings.MPESA_CALLBACK_URL,
                "AccountReference": card_currency,
                "TransactionDesc": f"Wallet top-up via {card_currency}",
            }

            try:
                response = requests.post(stk_url, json=payload, headers=headers, timeout=10)
                data = response.json()
                logger.info(f"STK Push initiated for {phone}: {json.dumps(data)}")
                
                # Store the CheckoutRequestID for callback matching
                checkout_request_id = data.get('CheckoutRequestID')
                if checkout_request_id:
                    # Create a pending payment record to track this transaction
                    Payment.objects.create(
                        user=request.user,
                        currency=card_currency,
                        amount_deducted=amount,
                        status="pending",
                        checkout_request_id=checkout_request_id,
                    )
                    logger.info(f"Created pending payment with CheckoutRequestID: {checkout_request_id}")
                
                return Response(data, status=response.status_code)
            except requests.RequestException as e:
                logger.error(f"STK Push request failed: {e}")
                return Response({"error": "Failed to send STK Push request"}, status=500)
            except Exception as e:
                logger.exception("Unexpected error in STK Push")
                return Response({"error": str(e)}, status=500)
        else:
            # Deduct for currency rental
            logger.info(f"Processing card payment for user {request.user.email}, amount {amount}, currency {card_currency}")
            
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            old_balance = wallet.balance
            wallet.balance -= Decimal(str(amount))
            wallet.save(update_fields=["balance"])
            logger.info(f"Wallet balance updated from {old_balance} to {wallet.balance}")

            # Also update the user's wallet_balance field
            old_user_balance = request.user.wallet_balance
            request.user.wallet_balance -= Decimal(str(amount))
            request.user.save(update_fields=["wallet_balance"])
            logger.info(f"User wallet_balance updated from {old_user_balance} to {request.user.wallet_balance}")

            Payment.objects.create(
                user=request.user,
                currency=card_currency,
                amount_deducted=amount,
                status="completed",
            )
            logger.info(f"Payment record created for user {request.user.email}, amount {amount} {card_currency}")

            Rental.objects.create(
                user=request.user,
                currency=card_currency,
                amount=amount,
                expected_return=amount * 2,
                status="active",
                duration_days=20,
            )
            logger.info(f"Rental created for user {request.user.email}, amount {amount} {card_currency}")

            # Process referral reward (if user was referred)
            reward = process_referral_reward(request.user, amount)
            logger.info(f"Referral reward processing completed: {reward}")

            return Response({
                "new_balance": float(wallet.balance),
                "referral_reward": float(reward) if reward > 0 else None
            }, status=status.HTTP_200_OK)


# ---------------------------#
# 3. M-PESA Callback (POST)
# ---------------------------#
@method_decorator(csrf_exempt, name="dispatch")
class MpesaCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            data = request.data
            logger.info("📥 M-PESA Callback: %s", json.dumps(data, indent=2))

            stk_callback = data.get("Body", {}).get("stkCallback", {})
            result_code = stk_callback.get("ResultCode")
            checkout_request_id = stk_callback.get("CheckoutRequestID")

            if result_code != 0:
                logger.warning(f"M-PESA transaction failed with ResultCode: {result_code}, CheckoutRequestID: {checkout_request_id}")
                # Update pending payment status to failed
                if checkout_request_id:
                    try:
                        payment = Payment.objects.get(checkout_request_id=checkout_request_id, status="pending")
                        payment.status = "failed"
                        payment.save(update_fields=["status"])
                        logger.info(f"Updated payment status to failed for CheckoutRequestID: {checkout_request_id}")
                    except Payment.DoesNotExist:
                        logger.warning(f"No pending payment found for CheckoutRequestID: {checkout_request_id}")
                return JsonResponse({"ResultCode": 0, "ResultDesc": "Transaction failed or cancelled"})

            metadata = stk_callback.get("CallbackMetadata", {})
            amount, phone = None, None

            for item in metadata.get("Item", []):
                if item["Name"] == "Amount":
                    amount = item["Value"]
                elif item["Name"] == "PhoneNumber":
                    phone = str(item["Value"])

            if not amount:
                return JsonResponse({"ResultCode": 1, "ResultDesc": "Missing Amount"})

            # Find the pending payment using CheckoutRequestID (primary method)
            payment = None
            user = None
            
            if checkout_request_id:
                try:
                    payment = Payment.objects.get(checkout_request_id=checkout_request_id, status="pending")
                    user = payment.user
                    logger.info(f"Found pending payment for user {user.email} using CheckoutRequestID: {checkout_request_id}")
                except Payment.DoesNotExist:
                    logger.warning(f"No pending payment found for CheckoutRequestID: {checkout_request_id}")
                    # Fallback to phone number method (less reliable)
                    if phone:
                        user = User.objects.filter(phone_number=phone).first()
                        if user:
                            logger.info(f"Fallback: Found user {user.email} using phone number {phone}")
                        else:
                            logger.warning(f"No user found for phone {phone}")
                    else:
                        logger.error("No phone number available for fallback")
                    return JsonResponse({"ResultCode": 1, "ResultDesc": "Transaction not found"})
            else:
                logger.error("No CheckoutRequestID in callback")
                return JsonResponse({"ResultCode": 1, "ResultDesc": "Missing CheckoutRequestID"})

            if not user:
                logger.error("No user found for transaction processing")
                return JsonResponse({"ResultCode": 1, "ResultDesc": "User not found"})

            logger.info(f"Processing M-PESA callback for user {user.email}, amount {amount}, CheckoutRequestID: {checkout_request_id}")

            wallet, _ = Wallet.objects.get_or_create(user=user)
            old_balance = wallet.balance
            wallet.balance -= Decimal(str(amount))
            wallet.save(update_fields=["balance"])
            logger.info(f"Wallet balance updated from {old_balance} to {wallet.balance}")

            # Also update the user's wallet_balance field
            old_user_balance = user.wallet_balance
            user.wallet_balance -= Decimal(str(amount))
            user.save(update_fields=["wallet_balance"])
            logger.info(f"User wallet_balance updated from {old_user_balance} to {user.wallet_balance}")

            # Update the pending payment record to completed
            if payment:
                payment.status = "completed"
                payment.save(update_fields=["status"])
                logger.info(f"Updated payment status to completed for CheckoutRequestID: {checkout_request_id}")

            # Create the rental record
            Rental.objects.create(
                user=user,
                currency=payment.currency if payment else "KES",
                amount=amount,
                expected_return=amount * 2,
                status="active",
                duration_days=20,
            )
            logger.info(f"Rental created for user {user.email}, amount {amount}")

            # Process referral reward (if user was referred)
            reward = process_referral_reward(user, amount)
            logger.info(f"Referral reward processing completed: {reward}")

            return JsonResponse({
                "ResultCode": 0, 
                "ResultDesc": "Callback processed successfully",
                "referral_reward": float(reward) if reward > 0 else None,
                "user_email": user.email,
                "amount": float(amount)
            })

        except Exception as e:
            logger.exception("Error processing M-PESA callback")
            return JsonResponse({"ResultCode": 1, "ResultDesc": f"Error: {str(e)}"})


# ---------------------------#
# 4. User Payment History (GET)
# ---------------------------#
class PaymentHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        payments = Payment.objects.filter(user=request.user).order_by("-created_at")
        serializer = PaymentSerializer(payments, many=True)
        return Response({"payments": serializer.data}, status=200)


# ---------------------------#
# 5. Admin Payments Overview (GET)
# ---------------------------#
class AdminPaymentsOverviewView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        user_id = request.query_params.get("user_id")
        payments = Payment.objects.filter(user_id=user_id) if user_id else Payment.objects.all()
        payments = payments.order_by("-created_at")

        serializer = PaymentSerializer(payments, many=True)
        total_amount = payments.aggregate(total=Sum("amount_deducted"))["total"] or 0

        return Response(
            {
                "payments": serializer.data,
                "totals_by_currency": {"KES": total_amount},
                "grand_total": total_amount,
            },
            status=200,
        )


# ---------------------------#
# 6. User Earnings (GET) - Total earnings this month from completed payments
# ---------------------------#
class EarningsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        total_earnings = Payment.objects.filter(
            user=request.user,
            status="completed",
            created_at__year=now.year,
            created_at__month=now.month
        ).aggregate(total=Sum("amount_deducted"))["total"] or 0

        return Response({"total_earnings": float(total_earnings)}, status=status.HTTP_200_OK)
