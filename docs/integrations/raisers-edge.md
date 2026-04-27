---
title: "Raiser's Edge"
source: "docs/integrations/raisers-edge.html"
anchor: "raisers-edge"
---
## Overview

The Raiser's Edge integration syncs Donately donor and donation data to Blackbaud Raiser's Edge NXT Constituents and Gifts via the Blackbaud SKY API. It uses OAuth 2.0 with a Blackbaud subscription key for authentication.

Once connected, syncs are triggered automatically each time a donation is created, updated, or refunded in Donately.

### What Gets Synced

-   **Constituent** — Donor identity, address, email, and phone information
-   **Gift** — Each donation, including recurring subscription details

The Raiser's Edge integration requires custom fields to be created in your Blackbaud environment before syncing. These fields store Donately IDs used for record matching. Setup instructions will be provided during onboarding.

## Configuration

These settings are configured per Donately account. In addition to OAuth credentials, the integration requires a Blackbaud API subscription key.

Authentication

| Setting | Description |
| --- | --- |
| subscription\_key | Blackbaud API subscription key sent as the `Bb-Api-Subscription-Key` request header on all API calls |

## Field Mapping

Default mappings from Donately fields to Raiser's Edge fields. These can be overridden using [custom field mapping](#custom-field-mapping).

### Constituent

| Donately Field | Raiser's Edge Field |
| --- | --- |
| unique\_identifier | custom\_constituent\_dntly\_person\_id (custom) |
| first\_name | first\_name |
| last\_name | last\_name |
| email | email.address |
| phone\_number | phone.number |
| street\_address | address.street |
| city | address.city |
| state | address.state |
| zip\_code | address.postal\_code |
| country | address.country |

### Gift

| Donately Field | Raiser's Edge Field |
| --- | --- |
| unique\_identifier | custom\_gift\_dntly\_donation\_id (custom) |
| donation\_name | description |
| donation\_amount | amount |
| donation\_date | date |
| anonymous | is\_anonymous |
| on\_behalf\_of | tribute.name |
| comment | comment |
| transaction\_id | custom\_gift\_dntly\_transaction\_id (custom) |
| processor | custom\_gift\_dntly\_processor (custom) |
| donation\_type | custom\_gift\_dntly\_donation\_type (custom) |
| status | custom\_gift\_dntly\_status (custom) |
| subscription\_frequency | custom\_gift\_dntly\_recurring\_frequency (custom) |
| subscription\_id | custom\_gift\_dntly\_subscription\_id (custom) |

## Record Matching

The integration uses the following strategies to find existing records before creating new ones. Strategies are tried in order — the first match wins.

### Constituent Matching

| Strategy | Description |
| --- | --- |
| FindByPersonId | Primary match using the Donately donor ID stored in the `custom_constituent_dntly_person_id` custom field |
| FindByEmailAndName | Fallback match using donor email, first name, and last name via the Blackbaud constituent search endpoint |

### Gift Matching

| Strategy | Description |
| --- | --- |
| FindByDonationId | Match by Donately donation ID stored in the `custom_gift_dntly_donation_id` custom field |

## Advanced

### Custom Field Mapping

You can override the default field mappings with a custom mapping. Custom mappings are defined as a JSON object where keys are Donately field names and values are the target Raiser's Edge field names.

```json
{
  "Person": {
    "email": "email.address",
    "unique_identifier": "custom_constituent_dntly_person_id",
    "phone_number": "phone.number"
  },
  "Donation": {
    "donation_amount": "amount",
    "unique_identifier": "custom_gift_dntly_donation_id"
  }
}
```

-   `Person` — Maps donor fields to Raiser's Edge Constituent fields
-   `Donation` — Maps donation fields to Raiser's Edge Gift fields

Custom mappings are merged with the defaults. You only need to specify the fields you want to override — any fields not listed in your custom mapping will use the default mapping.
