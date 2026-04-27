---
title: "Campaigns"
source: "api/index.html"
anchor: "campaigns"
---
## Campaigns

Campaigns are fundraising initiatives within an account. They can be general donation campaigns, peer-to-peer campaigns, or event-based campaigns.

### GET /v2/campaigns — List campaigns

Returns campaigns for the specified account. Public campaigns are accessible without authentication.

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| status optional | `draft`, `published`, or `archived` |
| type optional | Campaign type filter (e.g. `peer_to_peer`, `donation`) |
| keyword optional | Search by title or content |
| has\_fundraisers optional | Filter to campaigns with fundraisers |
| limit | Results per page (max 100) |
| offset | Pagination offset |
| sort | `ASC` or `DESC` |
| order\_by | Sort field |

### GET /v2/campaigns/:id — Get campaign

Retrieve a single campaign by unique identifier. Public campaigns can be accessed without authentication.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "campaign",
  "id": "cmp_1a2b3c4d5e6f",
  "title": "Annual Fund Drive",
  "status": "published",
  "type": "donation",
  "goal_in_cents": 10000000,
  "total_raised_in_cents": 4250000,
  "page_template": { ... },
  "created_at": "2026-01-01T00:00:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "cmp_1a2b3c4d5e6f",
    "title": "Annual Fund Drive",
    "status": "published",
    "type": "donation",
    "goal_in_cents": 10000000,
    "total_raised_in_cents": 4250000,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

v2019-03-15 hides the `page_template` field.

### POST /v2/campaigns — Create campaign

Create a new campaign for the specified account. Requires authentication.

### POST /v2/campaigns/:id — Update campaign

Update an existing campaign.

### DELETE /v2/campaigns/:id — Delete campaign

Delete a campaign. This action cannot be undone.
