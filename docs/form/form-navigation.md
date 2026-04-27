---
title: "Form Navigation"
source: "docs/form.html"
anchor: "form-navigation"
---
## Form Navigation

Configure multi-step form navigation to break the form into logical steps. Pass a JSON object with step definitions:

```
"form-navigation": {
  "steps": [
    {
      "label": "Amount",
      "sections": ["presets", "amount", "donorpaysfees", "recurringgroup"]
    },
    {
      "label": "Payment",
      "sections": ["paymentmethods"]
    },
    {
      "label": "Your Info",
      "sections": ["namegroup", "email", "phone", "addressgroup", "comment"]
    },
    {
      "label": "Review",
      "sections": ["summary", "submit"]
    }
  ]
}
```

### Available Sections

| Section | Description |
| --- | --- |
| presets | Preset amount buttons |
| amount | Custom amount input |
| donorpaysfees | Donor covers fees checkbox |
| recurringgroup | Recurring frequency selector |
| paymentmethods | Payment method selection (card, ACH, PayPal, etc.) |
| authname | Card holder name |
| namegroup | First and last name fields |
| email | Email field |
| phone | Phone number field |
| addressgroup | Street address fields |
| citygroup | City, state, zip fields |
| countrygroup | Country selector |
| billingzip | Billing zip code only |
| comment | Comment / message field |
| onbehalf | On behalf of / tribute field |
| anonymous | Anonymous donation checkbox |
| ecard | E-card configuration |
| dtd | Double the Donation employer match |
| summary | Donation summary/review |
| submit | Submit / donate button |
