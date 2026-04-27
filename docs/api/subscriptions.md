---
title: "Subscriptions"
source: "api/index.html"
anchor: "subscriptions"
---
## Subscriptions

Subscriptions represent recurring donation schedules. Each subscription generates donations on its configured frequency.

### GET /v2/subscriptions — List subscriptions

Returns recurring subscriptions for the specified account.

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| limit | Results per page (max 100) |
| offset | Pagination offset |

### GET /v2/subscriptions/:id — Get subscription

Retrieve a single subscription by unique identifier.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "subscription",
  "id": "sub_4a3b2c1d0e9f",
  "amount_in_cents": 2500,
  "currency": "usd",
  "frequency": "monthly",
  "status": "active",
  "person_id": "per_a1b2c3d4e5f6",
  "campaign_id": "cmp_1a2b3c4d5e6f",
  "donations_count": 12,
  "next_charge_at": "2026-04-01T00:00:00Z",
  "created_at": "2025-06-15T10:00:00Z",
  "updated_at": "2026-03-01T00:00:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "sub_4a3b2c1d0e9f",
    "amount_in_cents": 2500,
    "currency": "usd",
    "frequency": "monthly",
    "status": "active",
    "person_id": "per_a1b2c3d4e5f6",
    "campaign_id": "cmp_1a2b3c4d5e6f",
    "next_charge_at": "2026-04-01T00:00:00Z",
    "created_at": "2025-06-15T10:00:00Z",
    "updated_at": "2026-03-01T00:00:00Z"
  }
}
```

v2019-03-15 hides the `donations_count` field.

### POST /v2/subscriptions/:id — Update subscription

Update a subscription's amount, frequency, or payment method.

### POST /v2/subscriptions/:id/run\_now — Charge now

Immediately trigger a charge for a recurring subscription instead of waiting for the next scheduled date.
