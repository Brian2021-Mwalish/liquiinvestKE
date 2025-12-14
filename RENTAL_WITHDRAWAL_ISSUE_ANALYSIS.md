# Rental Withdrawal Issue Analysis

## Current Problem
Users can rent currency and then withdraw money from their wallet, but the money doubling process (rental completion) continues to run in the background. This creates a scenario where:

1. User rents currency for amount X
2. User withdraws X from their wallet 
3. When rental period ends, system adds X * 2 to wallet (doubles the amount)
4. User effectively gets their original amount back + the doubled amount

## Root Cause Analysis

### Current Flow:
1. **Rental Creation**: Creates Rental record with `expected_return = amount * 2`
2. **Wallet Operations**: Users can withdraw from wallet balance at any time
3. **Automated Completion**: `complete_rentals.py` runs periodically and adds `expected_return` to wallet regardless of user withdrawal history

### Issues:
- No tracking of user's withdrawal behavior
- Rental completion is independent of user's wallet activities
- Users can exploit this by withdrawing before completion and getting doubled amount
- No distinction between available balance and pending rental returns

## Proposed Solutions

### Solution 1: Track Rental Status with Claimed Flag
- Add `is_claimed` field to Rental model
- Only add to wallet when rental is actually claimed
- Allow users to claim completed rentals manually

### Solution 2: Separate Wallet Balances
- Create separate `available_balance` and `pending_returns` fields
- Only allow withdrawal from `available_balance`
- Move completed rental returns to `available_balance` when claimed

### Solution 3: Immediate vs Delayed Credit System
- Keep current system but implement a "pending returns" system
- Rental completion adds to pending, not directly to wallet
- Users must explicitly move pending returns to wallet

## Recommended Approach: Solution 1 (Claimed Flag)
This is the simplest and most reliable solution that maintains existing functionality while fixing the exploit.
