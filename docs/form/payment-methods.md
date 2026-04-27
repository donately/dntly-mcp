---
title: "Payment Methods"
source: "docs/form.html"
anchor: "payment-methods"
---
## Payment Methods

Control which payment methods are available on the form.

```
"payment-options": "cc,wallet,ach,paypal"
```

| Value | Description |
| --- | --- |
| cc  | Credit / debit card via Stripe |
| wallet | Apple Pay / Google Pay via Stripe |
| ach | ACH bank transfer via Stripe |
| paypal | PayPal (requires PayPal merchant ID) |

| Option | Description |
| --- | --- |
| payment-options | Comma-separated list of enabled payment methods |
| payment-options-layout | Layout style: `horizontal` or `vertical` |
| paypal-merchant-id | PayPal merchant ID (required for PayPal) |
