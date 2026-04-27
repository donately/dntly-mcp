---
title: "Errors"
source: "api/index.html"
anchor: "errors"
---
## Errors

Error responses follow a consistent format:

**v2022-12-15 response:**

```json
{
  "type": "bad_request",
  "message": "Description of what went wrong",
  "code": "400",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

v2019-03-15 returns a simpler error format. Upgrade to v2022-12-15 for structured `type`, `code`, and `request_id` fields.

### HTTP Status Codes

| Code | Meaning |
| --- | --- |
| 200 | Success |
| 400 | Bad Request — missing or invalid parameters |
| 401 | Unauthorized — invalid or missing API token |
| 403 | Forbidden — authenticated but insufficient permissions |
| 404 | Not Found |
| 422 | Unprocessable — validation errors |
| 429 | Rate Limited — too many requests |
| 500 | Internal Server Error |
