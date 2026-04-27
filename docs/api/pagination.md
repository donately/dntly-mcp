---
title: "Pagination & Filtering"
source: "api/index.html"
anchor: "pagination"
---
## Pagination & Filtering

All list endpoints support pagination and filtering via query parameters.

### Pagination

| Parameter | Description |
| --- | --- |
| limit | Number of records to return. Max `100`, default varies by endpoint. |
| offset | Number of records to skip. Default `0`. |

### Sorting

| Parameter | Description |
| --- | --- |
| sort | `ASC` or `DESC` |
| order\_by | Field to sort by, e.g. `created_at`, `amount_in_cents` |

### Standard Response Envelope

**v2022-12-15 response:**

```json
{
  "object": "list",
  "data": [ ... ],
  "summary": {
    "total_count": 142,
    "offset": 0,
    "limit": 20
  },
  "params": {
    "account_id": "act_ba7d12ab27bb",
    "api_version": "2022-12-15",
    "limit": 20,
    "offset": 0
  },
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": [ ... ],
  "count": 142,
  "offset": 0,
  "per_page": 20
}
```

v2019-03-15 uses a flat response structure. Upgrade to v2022-12-15 for standardized `summary` and `params` objects.
