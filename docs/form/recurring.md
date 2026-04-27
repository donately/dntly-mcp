---
title: "Recurring Donation Options"
source: "docs/form.html"
anchor: "recurring"
---
## Recurring Donation Options

Configure how recurring donations are presented to donors.

### Using recurring-options (Recommended)

```
"recurring-options": {
  "frequencies": ["false", "1.month", "3.month", "12.month"],
  "type": "toggle"
}
```

| Property | Description |
| --- | --- |
| frequencies | Array of frequency options to display. `"false"` = one-time option. |
| type | Display style: `"toggle"` or default radio buttons |

### Available Frequencies

| Value | Description |
| --- | --- |
| false | One-time donation |
| 1.day | Daily |
| 7.day | Weekly |
| 14.day | Bi-weekly |
| 1.month | Monthly |
| 2.month | Bi-monthly |
| 3.month | Quarterly |
| 6.month | Semi-annually |
| 12.month | Annually |

### Legacy Options

| Option | Description |
| --- | --- |
| recurring-frequency | Legacy: comma-separated frequencies or JSON array |
| recurring-start | Start date for the recurring schedule |
| recurring-stop | End date for the recurring schedule |
