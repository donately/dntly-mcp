---
title: "Authentication"
source: "api/index.html"
anchor: "authentication"
---
## Authentication

Authenticate requests using your API token with HTTP Basic Auth. Encode your token as base64 with a trailing colon:

```
Authorization: Basic {base64(YOUR_API_TOKEN + ':')}
```

You can find your API token in the Donately dashboard under Settings → API.

### Account Scoping

Most endpoints require specifying which account to query. Pass the account ID as a header or query parameter:

```
Donately-Account: act_ba7d12ab27bb
# or
?account_id=act_ba7d12ab27bb
```

Some endpoints (like creating a donation or viewing public campaigns) work without authentication for public-facing use.
