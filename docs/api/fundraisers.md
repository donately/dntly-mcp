---
title: "Fundraisers"
source: "api/index.html"
anchor: "fundraisers"
---
## Fundraisers

Fundraisers are individual or team-based sub-campaigns created by supporters for peer-to-peer fundraising.

### GET /v2/fundraisers — List fundraisers

Returns fundraisers for the specified account. Public fundraisers are accessible without authentication.

| Parameter | Description |
| --- | --- |
| account\_id required | Account identifier |
| campaign\_id optional | Filter by parent campaign |
| limit | Results per page (max 100) |
| offset | Pagination offset |

### GET /v2/fundraisers/:id — Get fundraiser

Retrieve a single fundraiser by unique identifier.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "fundraiser",
  "id": "fun_7e8f9a0b1c2d",
  "title": "Jane's Run for Hope",
  "type": "individual",
  "parent": { "id": "fun_xxx", "title": "Team Alpha" },
  "team_leader": { "id": "per_xxx", "name": "Jane Doe" },
  "page_template": { ... },
  "goal_in_cents": 500000,
  "total_raised_in_cents": 125000,
  "campaign_id": "cmp_1a2b3c4d5e6f",
  "created_at": "2026-02-01T00:00:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "fun_7e8f9a0b1c2d",
    "title": "Jane's Run for Hope",
    "goal_in_cents": 500000,
    "total_raised_in_cents": 125000,
    "campaign_id": "cmp_1a2b3c4d5e6f",
    "created_at": "2026-02-01T00:00:00Z"
  }
}
```

v2019-03-15 hides `type`, `parent`, `team_leader`, and `page_template` fields.
