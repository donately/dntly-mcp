---
title: "Webhooks"
source: "api/index.html"
anchor: "webhooks"
---
## Webhooks

Webhooks allow you to receive HTTP POST notifications when events occur in Donately (e.g., donation created, subscription cancelled).

### GET /v2/webhooks — List webhooks

Returns configured webhooks for the account.

### GET /v2/webhooks/:id — Get webhook

Retrieve a single webhook configuration.

### POST /v2/webhooks — Create webhook

Register a new webhook URL to receive event notifications.

### DELETE /v2/webhooks/:id — Delete webhook

Remove a webhook. You will no longer receive notifications at this URL.
