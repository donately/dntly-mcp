---
title: "Donation Options"
source: "docs/form.html"
anchor: "donation-options"
---
## Donation Options

| Option | Type | Description |
| --- | --- | --- |
| amount | number \| object | Default donation amount, or an object for more control (see below) |
| presets | string \| object | Preset donation amounts (see below) |
| campaign-id | string | Campaign to attribute donation to |
| fundraiser-id | string | Fundraiser to attribute donation to |
| currency | string | ISO currency code (default: `usd`) |
| dont-send-receipt-email | boolean | Suppress the automatic donation receipt email |

### Amount Configuration

Pass a number for a simple default, or an object for more control:

```
// Simple default amount
"amount": 50

// Object with full options
"amount": {
  "default": 50,
  "placeholder": 100,
  "disabled": false,
  "required": false
}
```

| Property | Type | Description |
| --- | --- | --- |
| default | number | Pre-filled donation amount in dollars |
| placeholder | number | Placeholder text shown when the amount field is empty |
| disabled | boolean | Lock the amount field so it cannot be changed by the donor |
| required | boolean | Set to `false` to make the amount field optional |

### Presets Configuration

Pass a comma-separated string for simple presets, or an object for advanced control:

```
// Simple comma-separated
"presets": "25,50,100,250"

// Advanced object format
"presets": {
  "presets": [
    { "label": "$25", "amount": 25 },
    { "label": "$50", "amount": 50 },
    { "label": "{{currency_symbol}}100", "amount": 100 },
    { "label": "Other Amount", "amount": "", "type": "input" }
  ],
  "fullWidthPresets": true,
  "presetsAsSelect": false
}
```

| Property | Type | Description |
| --- | --- | --- |
| presets | array | Array of preset objects (see below) |
| fullWidthPresets | boolean | Render preset buttons at full width |
| presetsAsSelect | boolean | Render presets as a dropdown select instead of buttons |

#### Preset Object Properties

| Property | Type | Description |
| --- | --- | --- |
| label | string | Display text for the preset. Supports `{{currency_symbol}}` placeholder. |
| amount | number | Donation amount in dollars |
| amount\_in\_cents | number | Alternative: specify amount in cents instead of dollars |
| type | string | Set to `"input"` to render as an editable text field instead of a button |
