---
title: "Accounts"
source: "api/index.html"
anchor: "accounts"
---
## Accounts

Accounts represent organizations on Donately. Each account has its own campaigns, donors, forms, and settings.

### GET /v2/accounts — List accounts

Returns accounts accessible to the authenticated user.

| Parameter | Description |
| --- | --- |
| limit | Results per page (max 100) |
| offset | Pagination offset |

### GET /v2/accounts/:id — Get account

Retrieve a single account by its unique identifier. Public account info is available without authentication.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "account",
  "id": "act_ba7d12ab27bb",
  "title": "My Nonprofit",
  "currency": "usd",
  "integration_accounts": [ ... ],
  "partner_type": "standard",
  "page_template": { ... },
  "billing": {
    "plan": "grow",
    "subscription_stripe_id": "sub_xxx",
    "subscription_prepaid_max_usd": 50000,
    "subscription_status": "active"
  },
  "created_at": "2020-01-15T12:00:00Z",
  "updated_at": "2026-02-10T08:30:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "act_ba7d12ab27bb",
    "title": "My Nonprofit",
    "currency": "usd",
    "billing": {
      "plan": "grow"
    },
    "google_analytics_id": "UA-12345678-1",
    "created_at": "2020-01-15T12:00:00Z",
    "updated_at": "2026-02-10T08:30:00Z"
  }
}
```

v2019-03-15 hides `integration_accounts`, `partner_type`, `page_template`, and billing subscription details. It adds a computed `google_analytics_id` field.

### GET /v2/accounts/mine — Get current account

Returns the account associated with the authenticated API token.

### POST /v2/accounts — Create account

Create a new Donately account.

### POST /v2/accounts/:id — Update account

Update an existing account's settings.
