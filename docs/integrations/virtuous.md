---
title: "Virtuous"
source: "docs/integrations/virtuous.html"
anchor: "virtuous"
---
## Overview

The Virtuous integration syncs Donately donor and donation data to Virtuous CRM Constituents and Gifts. It supports custom field mapping and recurring gift tracking.

Once connected, syncs are triggered automatically each time a donation is created, updated, or refunded in Donately.

### What Gets Synced

-   **Constituent** — Donor identity, address, and contact information
-   **Gift** — Each donation, including recurring subscription details

## Connecting

Virtuous does not offer a standard OAuth authorization screen. Instead, it uses password-based authentication (OAuth 2.0 Resource Owner Password Credentials) to exchange your Virtuous username and password for an access token, which Donately stores and uses for all subsequent syncs.

To connect Virtuous to Donately:

1.  In the Donately dashboard, go to **Integrations** and click **Install** on the Virtuous card.
2.  Enter the email address and password you use to sign in to Virtuous CRM.
3.  If your Virtuous account has multi-factor authentication enabled, you will be prompted for a one-time code after submitting your credentials. Enter the code Virtuous sends to your authenticator app or email and click **Connect** again.
4.  On success, you are returned to the Integrations page and the Virtuous card shows **Active**.

**Credentials are never stored.** Donately forwards your Virtuous email and password to the Virtuous token endpoint and discards them as soon as the access token is received. Only the access token is persisted.

## Configuration

Per-account settings live on the Virtuous card's **Configure** page in the Donately dashboard (`/native-integrations/virtuous/configure`). Today the only configurable setting is [Custom Field Mapping](#custom-field-mapping).

Gift Defaults

Planned settings for future releases — not yet configurable from the dashboard:

| Setting | Description |
| --- | --- |
| default\_fund\_id | Virtuous fund or GL code applied to gifts when no specific designation is provided |
| default\_gift\_type | Gift type written to all gifts (e.g., `Cash`, `Credit Card`, `Online`) |
| default\_donor\_type | Constituent type applied to new constituents (e.g., `Individual`, `Organization`) |

## Field Mapping

Default mappings from Donately fields to Virtuous properties. These can be overridden using [custom field mapping](#custom-field-mapping).

### Constituent

| Donately Field | Virtuous Field |
| --- | --- |
| unique\_identifier | dntly\_donor\_id (custom) |
| email | email |
| first\_name | first\_name |
| last\_name | last\_name |
| phone\_number | phone |
| street\_address | address.street |
| street\_address\_2 | address.street2 |
| city | address.city |
| state | address.state |
| zip\_code | address.postal\_code |
| country | address.country |

### Gift

| Donately Field | Virtuous Field |
| --- | --- |
| unique\_identifier | dntly\_donation\_id (custom) |
| donation\_name | description |
| donation\_amount | amount |
| donation\_date | date |
| currency | currency |
| anonymous | is\_anonymous |
| on\_behalf\_of | tribute.name |
| comment | comment |
| transaction\_id | dntly\_transaction\_id (custom) |
| processor | dntly\_processor (custom) |
| donation\_type | dntly\_donation\_type (custom) |
| status | dntly\_status (custom) |
| subscription\_frequency | dntly\_subscription\_frequency (custom) |
| subscription\_id | dntly\_subscription\_id (custom) |
| campaign\_title | dntly\_campaign (custom) |
| fundraiser\_title | dntly\_fundraiser (custom) |
| form\_id | dntly\_form\_id (custom) |

## Record Matching

The integration uses the following strategies to find existing records before creating new ones. Strategies are tried in order — the first match wins.

### Constituent Matching

| Strategy | Description |
| --- | --- |
| FindByPersonId | Primary match using the Donately donor ID stored in the `dntly_donor_id` custom field |
| FindByEmail | Fallback match by donor email address |

### Gift Matching

| Strategy | Description |
| --- | --- |
| FindByDonationId | Match by Donately donation ID stored in the `dntly_donation_id` custom field |

## Advanced

### Custom Field Mapping

You can override the default field mappings with a custom mapping. Custom mappings are defined as a JSON object where keys are Donately field names and values are the target Virtuous property names.

```json
{
  "Person": {
    "email": "email",
    "unique_identifier": "dntly_donor_id",
    "phone_number": "phone"
  },
  "Donation": {
    "donation_amount": "amount",
    "unique_identifier": "dntly_donation_id"
  }
}
```

-   `Person` — Maps donor fields to Virtuous Constituent properties
-   `Donation` — Maps donation fields to Virtuous Gift properties

Custom mappings are merged with the defaults. You only need to specify the fields you want to override — any fields not listed in your custom mapping will use the default mapping.
