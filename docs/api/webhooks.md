---
title: "Webhooks"
source: "api/index.html"
anchor: "webhooks"
---
## Webhooks

A webhook sends an HTTP POST to a URL you choose whenever an event happens on your account, such as a new donation or a failed recurring charge. Each webhook subscribes one URL to one event. You can also manage webhooks in the dashboard under Integrations > Webhooks.

### Events

Set `hook` to one of these values when you create a webhook.

| hook | Sent when |
| --- | --- |
| `account.donation.create.success` | A donation is created. |
| `account.donation.update.success` | A donation is updated. Updates within 15 minutes of the donation being created are not sent. |
| `account.subscription.update.success` | A recurring plan is updated. |
| `account.subscription.recur.failure` | A recurring charge fails. |
| `account.campaign.create.success` | A campaign is created. |
| `account.fundraiser.create.success` | A fundraiser is created. |
| `account.person.pii.update.success` | A contact's personal details change. |
| `account.person.erase.success` | A contact's personal information is erased from your account. The payload identifies the contact but carries no personal information, so you can erase your own copy. |

### Deliveries

Each delivery is a `POST` with a JSON body:

```
Content-Type: application/json
Donately-User-Agent: Donately/Webhooks/v2021-11-15

{
  "id": "evt_...",
  "type_string": "donation.created",
  "api_version": "2021-11-15",
  "created": 1763640000000,
  "object": "donation",
  "object_data": { ... },
  "event_data": { "event": "create" }
}
```

| Field | Description |
| --- | --- |
| `id` | The event's ID. Use it to ignore a delivery you have already processed. |
| `type_string` | Donately's internal name for the event. It can differ from the `hook` you subscribed to (for example `donation.created` for `account.donation.create.success`). |
| `api_version` | The payload format version of this webhook. See below. |
| `created` | When the event happened, in milliseconds since the Unix epoch. |
| `object` | The kind of record in `object_data`: `donation`, `subscription`, `campaign`, `fundraiser` or `person`. |
| `object_data` | The record itself. |
| `event_data` | What happened: `{"event": "create"}`, `{"event": "update", "previous_attributes": {...}}` with the values before the change, `{"event": "error", "event_attributes": {...}}` for a failed recurring charge, or `{"event": "erase"}`. |

Respond with any `2xx` status to acknowledge a delivery. Any other status, or no response, counts as a failure. Failed deliveries are retried about every two hours for up to 12 hours.

If the three most recent events for a webhook all fail every retry, the webhook is disabled automatically. Fix your endpoint, then re-enable it with **Update webhook** and `disabled=false`.

### Payload format version

Each webhook keeps one payload format for its whole life, so later changes to the API never change what your endpoint receives. The format is chosen when the webhook is created, from the `Donately-Version` header on that request: you get the newest webhook format at or below that version.

| Donately-Version on create | Webhook format |
| --- | --- |
| 2022-12-15 | 2021-11-15 (the newest format) |
| 2021-11-15 | 2021-11-15 |
| 2020-11-03 | 2020-11-03 |
| 2019-03-15, or no header | 2019-03-15 |

`version` is not a request parameter: anything sent in the body is ignored, and updating a webhook never changes it. To move a webhook to a newer format, create a new one with the newer header, then delete the old one.

### GET /v2/webhooks: List webhooks

Returns the webhooks configured on an account. Requires authentication.

| Parameter | Description |
| --- | --- |
| `account_id` (required) | Account identifier |
| `hook` (optional) | Only webhooks for these events, comma-separated |
| `order_by` (optional) | `created_at` (default), `hook`, `post_url` or `title` |
| `order` (optional) | `ASC` or `DESC` (default) |

On v2022-12-15 you can also filter by `disabled` (`true` or `false`) and by `status` of the latest delivery (`success` or `failed`).

### GET /v2/webhooks/:id: Get webhook

Retrieve a single webhook, including its payload format `version`, whether it is `disabled`, and delivery counts (`success_count`, `fail_count`, `last_attempt_status`, `last_attempt_date`).

### POST /v2/webhooks: Create webhook

Subscribe a URL to an event. Requires an account admin. Send the fields as JSON with `Content-Type: application/json`, or form-encoded.

| Parameter | Description |
| --- | --- |
| `account_id` (required) | Account identifier |
| `hook` (required) | The event to subscribe to. One of the values in Events above. |
| `post_url` (required) | The URL we POST to. Must start with `https://` or `http://`. |
| `title` (optional) | A label for the webhook |

```
curl -X POST "https://api.donately.com/v2/webhooks?account_id=act_..." \
  -u "YOUR_API_TOKEN:" \
  -H "Donately-Version: 2022-12-15" \
  -H "Content-Type: application/json" \
  -d '{
        "hook": "account.donation.create.success",
        "post_url": "https://example.com/donately",
        "title": "New donations"
      }'
```

An account can have up to 12 enabled webhooks per event. The same user cannot create two webhooks with the same `hook` and `post_url`.

### POST /v2/webhooks/:id: Update webhook

Change a webhook's URL or title, or switch it on and off. Requires an account admin. The `hook` and payload format cannot be changed; create a new webhook instead.

| Parameter | Description |
| --- | --- |
| `post_url` (optional) | New URL |
| `title` (optional) | New label |
| `disabled` (optional) | `true` stops deliveries; `false` resumes them |

On v2019-03-15, include `title` on every update. If it is left out, the title is cleared.

### DELETE /v2/webhooks/:id: Delete webhook

Remove a webhook and its delivery history. You will no longer receive notifications at this URL.
