---
title: "Forms"
source: "api/index.html"
anchor: "forms"
---
## Forms

Forms define the configuration for embeddable donation forms, including presets, fields, styling, and payment options.

### GET /v2/forms — List forms

Returns forms for the specified account.

### GET /v2/forms/:id — Get form

Retrieve a single form by unique identifier.

#### Response

**v2022-12-15 response:**

```json
{
  "object": "form",
  "id": "frm_3d4e5f6a7b8c",
  "title": "Main Donation Form",
  "url": "https://donately.com/form/xxx",
  "form_editor": { ... },
  "page_template": { ... },
  "account_id": "act_ba7d12ab27bb",
  "created_at": "2025-09-01T00:00:00Z",
  "request_id": "req_1234567890123"
}
```

**v2019-03-15 response:**

```json
{
  "success": true,
  "data": {
    "id": "frm_3d4e5f6a7b8c",
    "title": "Main Donation Form",
    "account_id": "act_ba7d12ab27bb",
    "created_at": "2025-09-01T00:00:00Z"
  }
}
```

v2019-03-15 hides `url`, `form_editor`, and `page_template` fields.

### GET /v2/forms/:id/config — Get form config

Returns the full configuration for a form, including all options needed to render the embeddable donation form. Public endpoint.

### POST /v2/forms — Create form

Create a new donation form configuration.

### POST /v2/forms/:id — Update form

Update an existing form's configuration.

### POST /v2/forms/:id/make\_form\_default — Set as default

Set this form as the default form for the account.

### DELETE /v2/forms/:id — Delete form

Delete a form. This action cannot be undone.
