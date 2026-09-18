# TaxScout Data Retention and Disposal Policy

**Effective date:** August 22, 2026
**Owner:** Founder, TaxScout

## 1. Purpose

This policy describes how long TaxScout retains user data and how that data
is disposed of when no longer needed.

## 2. Data Retained

- Account data (email, profile, state, income range)
- Transaction data synced from connected bank accounts (via Plaid)
- Plaid access tokens for connected accounts
- Subscription/billing status (via Stripe; TaxScout does not store card data)

## 3. Retention Period

Data is retained for as long as the user maintains an active TaxScout
account. There is no independent retention schedule beyond the user's own
account lifecycle — TaxScout does not retain data for a fixed period after
it is no longer needed for the purposes above.

## 4. Disposal

- **Disconnecting a bank account** (available anytime from Settings)
  immediately revokes the associated Plaid access token via Plaid's
  `/item/remove` endpoint and deletes the corresponding record from
  TaxScout's database.
- **Deleting an account** (available anytime from Settings) removes the
  user's profile, transaction history, and any linked-account records from
  TaxScout's database.
- Deletion is enforced through the application's delete-account flow, which
  performs the removal directly against the database at the time of the
  request.

## 5. Review

As a single-founder-operated product, this policy does not yet have a
formal periodic review cycle. It reflects TaxScout's current, actual data
handling practices and will be revisited as the product and its data
volume grow.
