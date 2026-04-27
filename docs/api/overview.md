---
title: "Overview"
source: "api/index.html"
anchor: "overview"
---
## Overview

The Donately API is a RESTful JSON API for managing donations, campaigns, donors, and fundraisers on the Donately platform. All requests use the base URL:

```
https://api.donately.com/v2
```

All request and response bodies use JSON. Set the `Content-Type: application/json` header for requests with a body.

### ID Format

All Donately resources use unique identifiers with a type prefix:

-   `act_` — Accounts
-   `cmp_` — Campaigns
-   `dnt_` — Donations
-   `sub_` — Subscriptions
-   `per_` — People / Contacts
-   `fun_` — Fundraisers
-   `frm_` — Forms
-   `hok_` — Webhooks
