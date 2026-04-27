---
title: "URL Parameter Prefill"
source: "docs/form.html"
anchor: "url-prefill"
---
## URL Parameter Prefill

You can pre-populate form values by appending query parameters to the donation page URL. This works on hosted Donately pages (`pages.donately.com`) and on any page where the form is embedded directly (HTTPS required).

There are two types of URL parameters:

-   **Form Option** — Sets a form configuration option (e.g., default amount, campaign, recurring frequency). Uses short parameter names like `amount`, `campaign-id`.
-   **Field Prefill** — Directly sets the value of a form input field after the form loads. Uses `donately-` prefixed parameter names that match the field element IDs (e.g., `donately-first-name`, `donately-email`).

### Example

```
https://pages.donately.com/yourorg/form/frm_xxxx?campaign-id=cmp_7ce279325f9e&recurring-frequency=1.month&amount=55
```

### Form Option Parameters

These parameters set form configuration options. Values are validated and only whitelisted parameters are accepted.

| Parameter | Type | Description | Example |
| --- | --- | --- | --- |
| amount | Form Option | Pre-set the donation amount (in dollars) | `amount=55` |
| campaign-id | Form Option | Attribute the donation to a specific campaign | `campaign-id=cmp_7ce279325f9e` |
| fundraiser-id | Form Option | Attribute the donation to a specific fundraiser | `fundraiser-id=fun_xxxx` |
| currency | Form Option | Set the currency (3-letter ISO code) | `currency=usd` |
| recurring-frequency | Form Option | Pre-select a recurring frequency | `recurring-frequency=1.month` |
| presets | Form Option | Set preset donation amounts (comma-separated) | `presets=25,50,100,250` |
| comment | Form Option | Show or hide the comment field | `comment=true` |
| onbehalfof | Form Option | Show or hide the "on behalf of" field | `onbehalfof=true` |
| anonymous | Form Option | Show or hide the anonymous checkbox | `anonymous=true` |
| address | Form Option | Show or hide the address fields | `address=true` |
| phone | Form Option | Show or hide the phone field | `phone=true` |

### Field Prefill Parameters

These parameters directly set the value of form input fields after the form loads. Use the field's element ID as the parameter name.

| Parameter | Type | Description |
| --- | --- | --- |
| donately-amount | Field Prefill | Donation amount input |
| donately-email | Field Prefill | Email address |
| donately-first-name | Field Prefill | First name |
| donately-last-name | Field Prefill | Last name |
| donately-phone-number | Field Prefill | Phone number |
| donately-comment | Field Prefill | Comment / message |
| donately-anonymous | Field Prefill | Anonymous checkbox (`true` / `false`) |
| donately-onbehalf | Field Prefill | On behalf of / tribute name |
| donately-street-address | Field Prefill | Street address line 1 |
| donately-street-address-2 | Field Prefill | Street address line 2 |
| donately-city | Field Prefill | City |
| donately-state | Field Prefill | State / Province |
| donately-zip-code | Field Prefill | ZIP / Postal code |
| donately-country | Field Prefill | Country |
| donately-donor-pays-fees | Field Prefill | Donor pays fees checkbox (`true` / `false`) |

### Example: Multiple Parameters

```
https://pages.donately.com/yourorg/form/frm_xxxx?amount=100&recurring-frequency=1.month&campaign-id=cmp_xxxx&donately-email=jane@example.com&donately-first-name=Jane&donately-last-name=Doe
```

**Tip:** URL-encode special characters in parameter values. Spaces should be encoded as `%20`. Checkbox fields accept `true` or `false` as values.

**Note:** URL parameter prefill only works when the form is rendered directly on the page (HTTPS). Forms that fall back to iframe rendering (HTTP) do not support URL parameter prefill.

**Tracking codes:** Any URL parameters that are not recognized as form options are automatically stored as tracking codes on the donation. This is useful for attribution (e.g., `?utm_source=email&utm_campaign=spring2025`).
