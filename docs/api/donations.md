---
title: "Donations"
source: "api/index.html"
anchor: "donations"
---
## Donations

Donations represent individual gifts made through the platform. They can be one-time or recurring, and support multiple payment methods.

### GET /v2/donations — List donations

Returns donations for the specified account. Requires authentication.

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| status optional | `completed`, `pending`, `refunded`, `rejected` |
| person\_id optional | Filter by donor |
| campaign\_id optional | Filter by campaign |
| fundraiser\_id optional | Filter by fundraiser |
| donation\_type optional | `cc` or `cash_or_check` |
| recurring optional | `true` or `false` |
| anonymous optional | `true` or `false` |
| currency optional | ISO currency code (e.g. `usd`, `cad`) |
| keyword optional | Text search |
| amount\_in\_cents optional | Filter by amount |
| created optional | Date range filter: `{gt: timestamp, lt: timestamp}` |
| updated optional | Date range filter: `{gt: timestamp, lt: timestamp}` |
| limit | Results per page (max 100) |
| offset | Pagination offset |
| sort | `ASC` or `DESC` |
| order\_by | Sort field (e.g. `created_at`, `amount_in_cents`) |

### GET /v2/donations/:id — Get donation

Retrieve a single donation by unique identifier.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "donation",
  "id": "dnt_9f8e7d6c5b4a",
  "amount_in_cents": 5000,
  "currency": "usd",
  "status": "completed",
  "campaign_id": "cmp_1a2b3c4d5e6f",
  "person_id": "per_a1b2c3d4e5f6",
  "recurring": false,
  "anonymous": false,
  "comment": "Keep up the great work!",
  "on_behalf_of": null,
  "donation_type": "card",
  "ecard": { ... },
  "origin": "form",
  "notes": "Internal note",
  "payment_intent_secret": "pi_xxx_secret_yyy",
  "paypal_order_id": null,
  "subscription": {
    "id": "sub_xxx",
    "recurring_start_day": 1,
    "recurring_stop_day": null,
    "recurring_frequency": "monthly"
  },
  "fundraiser": {
    "id": "fun_xxx",
    "type": "individual"
  },
  "form": { "id": "frm_xxx", "title": "Main Form" },
  "created_at": "2026-03-01T14:30:00Z",
  "updated_at": "2026-03-01T14:30:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "dnt_9f8e7d6c5b4a",
    "amount_in_cents": 5000,
    "currency": "usd",
    "status": "completed",
    "campaign_id": "cmp_1a2b3c4d5e6f",
    "person_id": "per_a1b2c3d4e5f6",
    "recurring": false,
    "anonymous": false,
    "comment": "Keep up the great work!",
    "on_behalf_of": null,
    "donation_type": "cc",
    "subscription": {
      "id": "sub_xxx"
    },
    "fundraiser": {
      "id": "fun_xxx"
    },
    "created_at": "2026-03-01T14:30:00Z",
    "updated_at": "2026-03-01T14:30:00Z"
  }
}
```

v2019-03-15 hides `ecard`, `origin`, `notes`. Nested subscription removes `recurring_start_day`, `recurring_stop_day`, `recurring_frequency`. Nested fundraiser removes `type`. Donation types limited to `cc`, `ach`, `cash`, `paypal`.

### POST /v2/donations — Create donation

Create a new donation. This endpoint can be used without authentication for public campaign donations (typically called from the embeddable form).

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| amount\_in\_cents required | Donation amount in cents |
| campaign\_id optional | Campaign to attribute donation to |
| fundraiser\_id optional | Fundraiser to attribute donation to |
| first\_name optional | Donor first name |
| last\_name optional | Donor last name |
| email optional | Donor email address |
| currency optional | ISO currency code (default: `usd`) |
| anonymous optional | Mark as anonymous donation |
| comment optional | Donor comment |
| on\_behalf\_of optional | Name of honoree |
| meta\_data optional | Custom metadata (JSON object) |

**v2022-12-15 response:**

#### Additional v2022-12-15 Parameters

| Parameter | Description |
| --- | --- |
| donation\_type optional | `card`, `stripe`, `ach`, `paypal`, `cash`, `dipjar` |
| origin optional | Source of the donation (e.g. `form`, `api`, `dashboard`) |
| notes optional | Internal notes (not visible to donor) |
| ecard optional | E-card configuration object |

**v2019-03-15 response:**

Accepted `donation_type` values: `cc`, `ach`, `cash`, `paypal`

### POST /v2/donations/:id — Update donation

Update an existing donation record.

### POST /v2/donations/:id/refund — Refund donation

Refund a donation. This will process a refund through the original payment processor (Stripe or PayPal).

### POST /v2/donations/:id/send\_receipt — Resend receipt

Resend the donation receipt email to the donor.
