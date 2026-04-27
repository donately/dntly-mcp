---
title: "Donor Fields"
source: "docs/form.html"
anchor: "donor-fields"
---
## Donor Fields

Control which donor information fields are shown on the form. Most fields accept either `true` to enable with defaults, or a configuration object for more control.

| Option | Type | Description |
| --- | --- | --- |
| email | string | Pre-fill the donor's email address |
| name | object \| boolean | Show first/last name fields. See [name configuration](#field-config-name). |
| address | object \| boolean | Show full address fields (street, city, state, zip, country). See [address configuration](#field-config-address). |
| phone | object \| boolean | Show phone number field. See [phone configuration](#field-config-phone). |
| comment | boolean | Show comment/message field |
| onbehalfof | boolean | Show "on behalf of" / tribute field |
| anonymous | boolean | Show "make my donation anonymous" checkbox |

### Field Configuration

Fields that accept objects can be passed as `true` to enable with defaults, or as an object for granular control.

#### name

```
// Enable with defaults
"name": true

// With options
"name": { "required": true }
```

| Property | Type | Description |
| --- | --- | --- |
| required | boolean | Make first and last name fields required |

#### phone

```
// Enable with defaults (required)
"phone": true

// Enable but optional
"phone": { "required": false }
```

| Property | Type | Description |
| --- | --- | --- |
| required | boolean | Make the phone field required (default: `true`). Set to `false` to make it optional. |

#### address

```
// Enable with defaults (required)
"address": true

// With full options
"address": {
  "required": true,
  "preselect_country": "US",
  "disabled": false
}
```

| Property | Type | Description |
| --- | --- | --- |
| required | boolean | Make all address fields required (street, city, state, zip, country). Set to `false` to make optional. |
| preselect\_country | boolean \| string | Set to `true` to auto-detect the donor's country, or pass a country code (e.g., `"US"`, `"CA"`, `"GB"`) to pre-select a specific country. |
| disabled | boolean | Lock the country dropdown so it cannot be changed. Only applies when `preselect_country` is set. |
