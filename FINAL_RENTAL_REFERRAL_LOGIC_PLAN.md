# Final Rental Withdrawal Logic Implementation Plan

## Complete System Requirements

### Money Types and Flow:
1. **Rental Money**: 
   - Before maturity (20 days): Locked in `rental_balance` (NOT available for withdrawal)
   - After maturity: Doubled amount added to `wallet_balance` (available for withdrawal)

2. **Referral Money**:
   - Trigger: When referred user creates a rental
   - Amount: 50% of the rental payment amount
   - Destination: Directly to `wallet_balance` (immediately available for withdrawal)
   - Display: Shown in referral section for tracking

3. **Admin Awards**:
   - Destination: Directly to `wallet_balance` (immediately available for withdrawal)

## Complete Implementation Plan

### Phase 1: Database Schema Updates

1. **Update CustomUser Model**:
   ```python
   rental_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
   # Keep existing wallet_balance for available money
   ```

2. **Update Rental Model**:
   ```python
   is_completed = models.BooleanField(default=False)
   completion_date = models.DateTimeField(null=True, blank=True)
   is_claimed = models.BooleanField(default=False)
   # Add referrer tracking
   referrer = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
   referral_reward_given = models.BooleanField(default=False)
   ```

3. **Update Referral Model**:
   ```python
   reward_given = models.BooleanField(default=False)
   rental_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
   reward_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
   ```

### Phase 2: Referral Logic Implementation

1. **Rental Creation with Referral Tracking**:
   ```python
   def create_rental_with_referral(self, user, amount, currency):
       # Create rental
       rental = Rental.objects.create(
           user=user,
           amount=amount,
           currency=currency,
           referrer=user.referred_by  # Link to referrer if exists
       )
       
       # Lock money in rental
       user.wallet_balance -= amount
       user.rental_balance += amount
       user.save()
       
       # Check if this rental triggers referral reward
       if rental.referrer and not rental.referral_reward_given:
           reward_amount = amount * Decimal('0.50')  # 50% of rental amount
           rental.referrer.wallet_balance += reward_amount
           rental.referrer.save()
           
           # Update referral record
           referral = Referral.objects.get(referrer=rental.referrer, referred=user)
           referral.reward_given = True
           referral.rental_amount = amount
           referral.reward_amount = reward_amount
           referral.save()
           
           rental.referral_reward_given = True
           rental.save()
       
       return rental
   ```

### Phase 3: Enhanced Balance Logic

1. **Balance Properties**:
   ```python
   @property
   def available_balance(self):
       return self.wallet_balance  # Available for withdrawal
   
   @property
   def locked_rental_balance(self):
       return self.rental_balance  # Locked in active rentals
   
   @property
   def total_balance(self):
       return self.wallet_balance + self.rental_balance
   
   @property
   def total_referral_earnings(self):
       return sum(referral.reward_amount for referral in self.referral_history.filter(reward_given=True))
   ```

2. **Withdrawal Validation**:
   ```python
   def can_withdraw(self, amount):
       return amount <= self.wallet_balance  # Only wallet_balance is withdrawable
   ```

### Phase 4: Automated Rental Completion

1. **Background Job Enhancement**:
   ```python
   def complete_matured_rentals():
       matured_rentals = Rental.objects.filter(
           is_completed=False,
           end_date__lte=timezone.now()
       )
       
       for rental in matured_rentals:
           # Double the amount and add to wallet
           return_amount = rental.amount * 2
           
           # Move from rental_balance to wallet_balance
           rental.user.rental_balance -= rental.amount
           rental.user.wallet_balance += return_amount
           rental.user.save()
           
           # Mark rental as completed
           rental.is_completed = True
           rental.completion_date = timezone.now()
           rental.is_claimed = True
           rental.save()
   ```

### Phase 5: Frontend Implementation

1. **Wallet Display**:
   ```
   💰 Wallet Balance: KES 1,500 (Available for withdrawal)
   🔒 Active Rentals: KES 800 (Locked for 20 days)
   📊 Total Balance: KES 2,300
   
   Withdrawal: Available up to KES 1,500
   ```

2. **Referral Section Enhancement**:
   ```
   Referral Earnings: KES 750
   - User X: KES 500 (from KES 1,000 rental)
   - User Y: KES 250 (from KES 500 rental)
   
   Total referral rewards are added to your wallet automatically
   ```

3. **Rental Display**:
   ```
   Active Rentals:
   - KES 1,000 → KES 2,000 (18 days remaining)
   - KES 800 → KES 1,600 (15 days remaining)
   
   Completed Rentals:
   - KES 500 → KES 1,000 (Completed: 2024-01-15)
   ```

### Phase 6: Complete Money Flow Examples

1. **Scenario 1: User with Referral**:
   ```
   User A refers User B
   User B signs up
   User B creates rental: KES 1,000
   → KES 1,000 locked in User B's rental_balance
   → User A automatically gets KES 500 in wallet_balance
   → After 20 days: User B gets KES 2,000 in wallet_balance
   ```

2. **Scenario 2: Direct User**:
   ```
   User C creates rental: KES 500
   → KES 500 locked in User C's rental_balance
   → After 20 days: User C gets KES 1,000 in wallet_balance
   ```

### Implementation Steps:
1. ✅ Create comprehensive plan with referral logic
2. ⏳ Update database models
3. ⏳ Implement referral tracking in rental creation
4. ⏳ Update balance calculation methods
5. ⏳ Enhance withdrawal validation
6. ⏳ Update automated rental completion
7. ⏳ Create referral tracking in UI
8. ⏳ Test complete referral flow
9. ⏳ Test withdrawal restrictions
10. ⏳ Deploy and monitor

## Benefits:
- ✅ Referral rewards automatically added to wallet (immediately available)
- ✅ Clear tracking of referral earnings in UI
- ✅ Rental money protected during lock period
- ✅ Automatic 50% referral reward calculation
- ✅ Complete prevention of rental exploitation
- ✅ Transparent balance breakdown for users
