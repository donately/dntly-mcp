---
title: "Donor Pays Fees"
source: "docs/form.html"
anchor: "donor-pays-fees"
---
## Donor Pays Fees

The donor-pays-fees option lets donors opt in to covering transaction fees so the nonprofit receives the full donation amount. This option supports multiple configuration formats depending on how much control you need.

### Simple Boolean

Enable with default fee calculations for all payment methods:

```
"donor-pays-fees": true
```

### Simple Percentage

Apply a single percentage across all payment methods:

```
"donor-pays-fees": "0.042"
```

### Per-Payment-Method Configuration

For full control, pass an object with fee settings for each payment method:

```
"donor-pays-fees": {
  "preselected": true,
  "cc": {
    "processor_percent": 0.029,
    "processor_fixed": 0.30,
    "dntly_percent": 0.04,
    "complex_calc": true
  },
  "ach": {
    "processor_percent": 0.008,
    "processor_fixed": 0,
    "processor_cap": 5.00,
    "dntly_percent": 0.04,
    "complex_calc": true
  },
  "paypal": {
    "processor_percent": 0.029,
    "processor_fixed": 0.30,
    "dntly_percent": 0.04
  }
}
```

#### Top-Level Properties

| Property | Type | Description |
| --- | --- | --- |
| preselected | boolean | Pre-check the "cover fees" checkbox when the form loads (default: `false`) |

#### Payment Method Properties

Each payment method key (`cc`, `ach`, `paypal`, `wallet`, `cash`) accepts these properties:

| Property | Type | Default (CC) | Default (ACH) | Description |
| --- | --- | --- | --- | --- |
| processor\_percent | number | 0.029 | 0.008 | Processor percentage fee as a decimal (e.g., `0.029` = 2.9%). Must be between 0 and 1. |
| processor\_fixed | number | 0.30 | 0   | Fixed per-transaction fee in dollars (e.g., `0.30` = 30 cents) |
| processor\_cap | number \| null | null | null | Maximum cap on processor fees in dollars (e.g., `5.00` for ACH). Set to `null` for no cap. |
| dntly\_percent | number | 0.04 | 0.04 | Donately platform percentage fee as a decimal (e.g., `0.04` = 4%). Must be between 0 and 1. |
| complex\_calc | boolean | true | true | Use the precise fee calculation algorithm. When `false`, uses a simpler calculation. |

### Common Examples

```
// Flat 3% fee on credit card donations
"donor-pays-fees": {
  "cc": {
    "processor_percent": 0.03,
    "processor_fixed": 0,
    "dntly_percent": 0,
    "complex_calc": false
  }
}

// Flat $2.50 fee on all donations
"donor-pays-fees": {
  "cc": {
    "processor_percent": 0,
    "processor_fixed": 2.50,
    "dntly_percent": 0,
    "complex_calc": false
  }
}

// ACH with $5 cap
"donor-pays-fees": {
  "ach": {
    "processor_percent": 0.008,
    "processor_fixed": 0,
    "processor_cap": 5.00,
    "dntly_percent": 0.04
  }
}
```
