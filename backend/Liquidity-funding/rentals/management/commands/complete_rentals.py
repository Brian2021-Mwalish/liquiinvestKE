
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from rentals.models import Rental
from payment.models import Wallet
from Users.models import Referral
from decimal import Decimal


class Command(BaseCommand):
    help = 'Complete rentals that have reached their end date and process referral rewards'

    def handle(self, *args, **options):
        now = timezone.now()
        
        # Complete matured rentals
        completed_rentals = self.complete_matured_rentals(now)
        
        # Process referral rewards for new rentals
        referral_rewards = self.process_referral_rewards()
        
        # Summary
        self.stdout.write(
            self.style.SUCCESS(f'Successfully completed {completed_rentals} rentals')
        )
        self.stdout.write(
            self.style.SUCCESS(f'Processed {referral_rewards} referral rewards')
        )

    def complete_matured_rentals(self, now):
        """Complete rentals that have reached their end date"""
        matured_rentals = Rental.objects.filter(
            status='active',
            is_completed=False,
            end_date__lte=now
        )

        completed_count = 0
        for rental in matured_rentals:
            try:
                with transaction.atomic():
                    # Get user's wallet
                    wallet = rental.user.wallet
                    
                    # Move money from rental_balance to balance (doubled amount)
                    return_amount = rental.expected_return
                    success = wallet.complete_rental(rental.amount, return_amount)
                    
                    if success:
                        # Mark rental as completed
                        rental.is_completed = True
                        rental.completion_date = now
                        rental.is_claimed = True
                        rental.status = 'completed'
                        rental.save()
                        
                        completed_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'Completed rental {rental.unique_id} for user {rental.user.email}, '
                                f'added {return_amount} to wallet balance'
                            )
                        )
                    else:
                        self.stdout.write(
                            self.style.WARNING(
                                f'Failed to complete rental {rental.unique_id} - insufficient rental balance'
                            )
                        )
                        
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error completing rental {rental.unique_id}: {str(e)}'
                    )
                )

        return completed_count

    def process_referral_rewards(self):
        """Process referral rewards for rentals that haven't been rewarded yet"""
        # Find rentals that have a referrer but haven't given referral reward
        unrewarded_rentals = Rental.objects.filter(
            referrer__isnull=False,
            referral_reward_given=False
        )

        reward_count = 0
        for rental in unrewarded_rentals:
            try:
                with transaction.atomic():
                    # Calculate referral reward (50% of rental amount)
                    reward_amount = rental.amount * Decimal('0.50')
                    
                    # Add reward to referrer's wallet
                    referrer_wallet = rental.referrer.wallet
                    referrer_wallet.add_referral_reward(reward_amount)
                    
                    # Update rental record
                    rental.referral_reward_given = True
                    rental.save()
                    
                    # Update referral record
                    try:
                        referral = Referral.objects.get(
                            referrer=rental.referrer,
                            referred=rental.user
                        )
                        referral.reward_given = True
                        referral.rental_amount = rental.amount
                        referral.reward_amount = reward_amount
                        referral.save()
                    except Referral.DoesNotExist:
                        # Create referral record if it doesn't exist
                        Referral.objects.create(
                            referrer=rental.referrer,
                            referred=rental.user,
                            referred_email=rental.user.email,
                            referred_name=rental.user.full_name,
                            reward_given=True,
                            rental_amount=rental.amount,
                            reward_amount=reward_amount,
                            status='completed'
                        )
                    
                    reward_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Given referral reward of {reward_amount} to {rental.referrer.email} '
                            f'for rental by {rental.user.email}'
                        )
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error processing referral reward for rental {rental.unique_id}: {str(e)}'
                    )
                )

        return reward_count
