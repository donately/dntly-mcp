---
title: "Stripe Integration"
source: "docs/integrations/stripe.html"
anchor: "stripe"
---
# Stripe Integration

How Donately integrates with Stripe for payment processing, including charge descriptions, statement descriptors, and recurring billing.

## Charge Descriptions

Stripe charges created by Donately use two separate text fields that appear in different places. Understanding the distinction is important for nonprofits and their donors.

### `description` — Stripe Dashboard & Receipts

|     |     |
| --- | --- |
| Where it appears | Stripe Dashboard, Stripe-generated email receipts (if enabled) |
| Character limit | 121 characters |
| Who sees it | Nonprofit admins in Stripe; donors if Stripe receipts are enabled |
| Format | `{Frequency} Donation to {Campaign}: {Fundraiser}` |
| Example | Monthly Donation to Annual Gala: John's Fundraiser |
| Customizable by nonprofit? | No — set automatically by Donately |

For recurring donations, the description is prefixed with the billing frequency (e.g. "Monthly", "Weekly", "Quarterly"). One-time donations have no prefix.

### `statement_descriptor` — Bank & Card Statements

|     |     |
| --- | --- |
| Where it appears | Donor's bank or credit card statement |
| Character limit | 22 characters (Stripe hard limit) |
| Who sees it | Donors reviewing their bank/card transactions |
| Default value | `DONATELY.COM` |
| Customizable by nonprofit? | Yes — nonprofits can set their own statement descriptor in their Stripe account settings (e.g. "CORNERSTONE INTL") |

The bank may append additional information to the statement descriptor (transaction date, merchant location, card last 4, "RECURRING PYMT"). This is added by the card network and issuing bank, not by Donately or Stripe.

## Recurring Frequency Labels

The following labels are used in the `description` field for recurring donations:

| Frequency | Label | Example Description |
| --- | --- | --- |
| `1.month` | Monthly | Monthly Donation to Annual Gala |
| `2.month` | Bi-Monthly | Bi-Monthly Donation to Annual Gala |
| `3.month` | Quarterly | Quarterly Donation to Annual Gala |
| `4.month` | Tri-Annual | Tri-Annual Donation to Annual Gala |
| `6.month` | Semi-Annual | Semi-Annual Donation to Annual Gala |
| `12.month` | Annual | Annual Donation to Annual Gala |
| `1.day` | Daily | Daily Donation to Annual Gala |
| `7.day` | Weekly | Weekly Donation to Annual Gala |
| `14.day` | Bi-Weekly | Bi-Weekly Donation to Annual Gala |
| `28.day` | 4-Weekly | 4-Weekly Donation to Annual Gala |
| Unknown | Recurring | Recurring Donation to Annual Gala |
| One-time | _(none)_ | Donation to Annual Gala |

## Future Sections (TODO)

-   Stripe Connect setup and onboarding flow
-   Payment methods (credit card, ACH via Plaid)
-   Webhook handling
-   Refund processing
-   Subscription/recurring billing lifecycle
-   Fee structure and application fees
-   Testing with Stripe test mode
