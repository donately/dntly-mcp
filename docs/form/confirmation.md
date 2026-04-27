---
title: "Confirmation Screen"
source: "docs/form.html"
anchor: "confirmation"
---
## Confirmation Screen

Customize what donors see after a successful donation. You can change the thank-you message, enable social sharing, or redirect to an external page.

```
"confirmation-config": {
  "thank_you_message_header": "Thank you for your {{formatted_amount}} donation!",
  "thank_you_message_subheader": "A receipt has been sent to {{email}}.",
  "display_social_icons": true,
  "social_share_message": "I just donated to {{social_share_account_title}}!",
  "social_share_account_title": "Our Nonprofit",
  "social_share_url": "https://example.org/donate",
  "twitter_hashtags": "donate,giveback"
}
```

### Message Options

| Property | Type | Description |
| --- | --- | --- |
| thank\_you\_message\_header | string | Main heading shown after donation. Supports `{{formatted_amount}}` placeholder. |
| thank\_you\_message\_subheader | string | Secondary message (e.g., receipt info). Supports `{{email}}` placeholder. |

### Social Sharing Options

| Property | Type | Description |
| --- | --- | --- |
| display\_social\_icons | boolean | Show social share buttons (Facebook, Twitter, Email) on the confirmation screen |
| social\_share\_message | string | Message used when sharing. Supports `{{social_share_account_title}}` placeholder. |
| social\_share\_account\_title | string | Organization name displayed in share messages |
| social\_share\_url | string | URL shared on social media (e.g., your donation page) |
| twitter\_hashtags | string | Comma-separated hashtags for Twitter shares (e.g., `"donate,giveback"`) |

### Redirect Options

| Property | Type | Description |
| --- | --- | --- |
| redirect\_url | string | URL to redirect the donor to after a successful donation. When set, the confirmation screen is skipped. |
| redirect\_with\_payload | boolean | Include the full donation data as a query parameter in the redirect URL |
| disable\_confirmation | boolean | Skip the confirmation screen entirely without redirecting |

### Redirect with Payload Example

When `redirect_with_payload` is `true`, the donor is redirected with the complete donation object appended as a query parameter. This includes the donation ID, amount, donor email, subscription details, and metadata.

```
"confirmation-config": {
  "redirect_url": "https://example.org/thank-you",
  "redirect_with_payload": true
}
```
