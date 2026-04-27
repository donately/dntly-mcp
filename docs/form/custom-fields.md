---
title: "Custom Fields"
source: "docs/form.html"
anchor: "custom-fields"
---
## Custom Fields

Add custom form fields that are stored as metadata on the donation. Pass as a JSON array.

```
"custom-fields": [
  {
    "type": "text",
    "label": "Company Name",
    "name": "company_name",
    "required": true
  },
  {
    "type": "select",
    "label": "How did you hear about us?",
    "name": "referral_source",
    "options": ["Google", "Social Media", "Friend", "Event", "Other"]
  },
  {
    "type": "checkbox",
    "label": "Add me to the mailing list",
    "name": "mailing_list"
  },
  {
    "type": "section",
    "label": "Additional Information"
  },
  {
    "type": "hidden",
    "name": "source",
    "value": "website-homepage"
  }
]
```

### Field Types

| Type | Description |
| --- | --- |
| text | Single-line text input |
| email | Email input with validation |
| textarea | Multi-line text area |
| select | Dropdown select. Provide `options` array. |
| radio | Radio button group. Provide `options` array. |
| checkbox | Single checkbox |
| select\_state | US state dropdown (pre-populated) |
| select\_country | Country dropdown (pre-populated) |
| select\_campaign | Dropdown of account campaigns |
| select\_fundraiser | Dropdown of campaign fundraisers |
| hidden | Hidden field with preset `value` |
| section | Visual section divider / heading |
| cart\_items | Merchandise / cart item selector |
