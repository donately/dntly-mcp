---
title: "Versioning"
source: "api/index.html"
anchor: "versioning"
---
## Versioning

The API uses date-based versioning. Specify the version via the `Donately-Version` header:

```
Donately-Version: 2022-12-15
```

If no version header is sent, the API defaults to **2019-03-15**. We recommend explicitly setting the version header in all requests.

v2019-03-15 (legacy) v2022-12-15 (recommended)

### v2019-03-15

The original and default API version. If no `Donately-Version` header is sent, this version is used. It includes all core resources:

-   Accounts, Campaigns, Donations, Subscriptions
-   People (donors/contacts), Fundraisers, Forms
-   Webhooks

This version is stable and widely used. All endpoints documented below are available in this version.

### v2022-12-15

The recommended version for integrations, with improvements to response formats and additional capabilities. All v2019-03-15 endpoints remain available.

### What changed

-   **Standardized response envelope** — All list endpoints return a consistent `{ object, data, summary, params }` structure
-   **Request IDs** — Every response includes a `request_id` field for debugging and support
-   **Improved error format** — Error responses now include `type`, `message`, `code`, and `request_id`
-   **Native integration support** — Accounts include native integration configuration (Salesforce, HubSpot, Mailchimp, etc.)
-   **Subscription improvements** — Additional fields for payment method details and retry status on subscriptions
-   **Donation metadata** — Expanded `meta_data` support on donations with custom field tracking

To use this version, include `Donately-Version: 2022-12-15` in every request. The endpoint paths and parameters are the same as v2019-03-15.

Webhook payloads are versioned separately from API responses. A webhook created on 2022-12-15 delivers the 2021-11-15 payload format. See [Webhooks](webhooks.md).
