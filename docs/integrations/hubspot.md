---
title: "HubSpot"
source: "docs/integrations/hubspot.html"
anchor: "hubspot"
---
## Overview

The HubSpot integration syncs Donately donor and donation data to HubSpot Contacts and Deals. You can configure which pipeline and deal stage donations are assigned to, including separate stages for recurring donations.

The integration connects via OAuth. Once connected, syncs are triggered automatically each time a donation is created, updated, or refunded in Donately.

### What Gets Synced

-   **Contact** — Donor identity and address information
-   **Deal** — Each donation, assigned to a configurable pipeline and deal stage

## Configuration

These settings are configured per Donately account and control how records are created and linked in HubSpot.

Pipeline

| Setting | Description |
| --- | --- |
| pipeline | HubSpot pipeline name where donation deals are created |
| pipeline\_id | HubSpot pipeline UUID |

Deal Stages

| Setting | Description |
| --- | --- |
| deal\_stage | Deal stage assigned to one-time donations (e.g., "Closed Won") |
| deal\_stage\_id | HubSpot deal stage UUID for one-time donations |
| recurring\_deal\_stage | Deal stage assigned to recurring donations (e.g., "Pledged") |
| recurring\_deal\_stage\_id | HubSpot deal stage UUID for recurring donations |

## Field Mapping

Default mappings from Donately fields to HubSpot properties. These can be overridden using [custom field mapping](#custom-field-mapping).

### Contact

| Donately Field | HubSpot Native Property | Donately Custom Property | Custom Property Deprecating Soon |
| --- | --- | --- | --- |
| email | email | —   |     |
| first\_name | firstname | —   |     |
| last\_name | lastname | —   |     |
| unique\_identifier | —   | dntly\_donor\_id |     |
| full\_address | —   | dntly\_full\_address |     |
| street\_address + street\_address\_2 | address (combined) | dntly\_donor\_street / dntly\_donor\_apartment | x   |
| city | city | dntly\_donor\_city | x   |
| state | state | dntly\_donor\_state | x   |
| zip\_code | zip | dntly\_donor\_zip | x   |
| country | country | dntly\_donor\_country | x   |
| phone\_number | phone | dntly\_donor\_phone | x   |

### Deal (Donation)

| Donately Field | HubSpot Native Property | Donately Custom Property |
| --- | --- | --- |
| (literal) "Donately Donation" | dealname | —   |
| donation\_amount | amount | —   |
| currency\_code | deal\_currency\_code | —   |
| unique\_identifier | —   | dntly\_donation\_id |
| donation\_date | —   | dntly\_donation\_date |
| status | —   | dntly\_donation\_status |
| transaction\_id | —   | dntly\_donation\_transaction\_id |
| processor | —   | dntly\_donation\_processor |
| donation\_type | —   | dntly\_donation\_type |
| anonymous | —   | dntly\_donation\_anonymous |
| on\_behalf\_of | —   | dntly\_donation\_on\_behalf\_of |
| comment | —   | dntly\_donation\_comment |
| recurring | —   | dntly\_donation\_recurring |
| subscription\_frequency | —   | dntly\_subscription\_frequency |
| subscription\_id | —   | dntly\_subscription\_id |
| subscription\_status | —   | dntly\_subscription\_status |
| subscription\_start\_day | —   | dntly\_subscription\_start\_day |
| campaign\_id | —   | dntly\_donation\_campaign\_id |
| campaign\_title | —   | dntly\_donation\_campaign\_title |
| fundraiser\_id | —   | dntly\_donation\_fundraiser\_id |
| fundraiser\_title | —   | dntly\_donation\_fundraiser\_title |
| form\_id | —   | dntly\_donation\_form\_id |
| donor\_id | —   | dntly\_donor\_id |
| livemode | —   | dntly\_donation\_livemode |
| tracking\_codes | —   | dntly\_donation\_tracking\_codes |
| metadata | —   | dntly\_donation\_meta\_data |
| ecard | —   | dntly\_donation\_ecard |
| notes | —   | dntly\_donation\_notes |
| dtd\_company\_name | —   | dntly\_donation\_dtd\_company\_name |

## Record Matching

When syncing data, the integration uses a series of strategies to find existing records in HubSpot before creating new ones. Strategies are tried in order — the first match wins.

### Contact Matching

| Strategy | How It Works |
| --- | --- |
| FindByPersonId | Searches for a contact by the `dntly_donor_id` custom property. This is the primary strategy and matches contacts created by the native integration. |
| FindByEmail | Falls back to searching by the contact's `email` field. Used when `dntly_donor_id` is not found (e.g., contacts created manually or by another tool). |

### Deal Matching

| Strategy | How It Works |
| --- | --- |
| FindByDonationId | Searches for a deal by the `dntly_donation_id` custom property. This is the primary strategy and matches deals created by the native integration. |
| FindByCompositeMatch | Falls back to matching by a combination of the associated contact's email, deal amount, and close date. Only targets deals that do _not_ have `dntly_donation_id` set. Used to match legacy records synced via Zapier or other tools that did not include the Donately Donation ID. If multiple deals match the same criteria, the match is skipped and a new deal is created instead — the ambiguous match is flagged for manual review in the Donately dashboard so you can merge duplicates in HubSpot if needed. When a single match is found, all native fields (including `dntly_donation_id`) are backfilled on the next update, so subsequent syncs use the faster primary strategy automatically. |

The composite match strategy is designed for one-time migration scenarios. Once a legacy deal is matched and updated with the Donately Donation ID, all future syncs for that donation will use the primary `FindByDonationId` strategy.

## Advanced

### Custom Field Mapping

You can override the default field mappings with a custom mapping. Custom mappings are defined as a JSON object where keys are Donately field names (or [helper expressions](#mapping-helpers)) and values are the target HubSpot property names.

```json
{
  "Person": {
    "email": "email",
    "unique_identifier": "dntly_donor_id",
    "phone_number": "phone"
  },
  "Donation": {
    "donation_amount": "amount",
    "comment": "dntly_donation_comment"
  }
}
```

-   `Person` — Maps donor fields to HubSpot Contact properties
-   `Donation` — Maps donation fields to HubSpot Deal properties

Custom mappings are merged with the defaults. You only need to specify the fields you want to override — any fields not listed in your custom mapping will use the default mapping.

#### Mapping Helper Expressions

Instead of a Donately field name, the key side of a mapping entry can use a helper expression to compute or transform the value written to HubSpot.

| Expression | Description | Example |
| --- | --- | --- |
| custom\_string:<value> | Writes a literal string to the HubSpot property regardless of donation data. | `"custom_string:Online Donation": "hs_deal_source"` → writes `"Online Donation"` to `hs_deal_source` |

```json
{
  "Donation": {
    // Literal string — always write "Online" to hs_deal_source
    "custom_string:Online": "hs_deal_source"
  }
}
```

#### Available Donately Fields

The tables below list the Donately fields that can be used as keys in a custom mapping. Any public method on the underlying record is accepted — these are the ones most commonly useful for CRM sync.

##### Person (donor) → HubSpot Contact

| Field | Returns | Notes |
| --- | --- | --- |
| Identity & name |     |     |
| `email` | Donor email address | Primary key for matching |
| `unique_identifier` | Donately Person ID | Stable, globally unique |
| `first_name` | Raw first name as entered | Used by default mapping |
| `last_name` | Raw last name as entered | Used by default mapping |
| `full_name` | `"{first_name} {last_name}"` | Use this for a single “donor name” custom property |
| `name` | Alias of `full_name` |     |
| `full_name_or_email` | `full_name` if present, otherwise `email` | Safe fallback when names may be blank |
| `first_name_or_email` | `first_name` if length > 2, otherwise `email` |     |
| `first_name_clean` | Titleized `first_name`, “ And ” → “ and ” | Normalizes ALL-CAPS / all-lowercase entries |
| `last_name_clean` | Titleized `last_name` |     |
| Contact |     |     |
| `phone_number` | Raw phone as entered |     |
| `phone_number_formatted` | Formatted phone (e.g. `(555) 123-4567`) |     |
| Address |     |     |
| `street_address` | Street line 1 |     |
| `street_address_2` | Street line 2 (apt/suite) |     |
| `city` | City |     |
| `state` | State / region |     |
| `zip_code` | ZIP / postal code |     |
| `country` | Country |     |
| `full_address` | All address fields joined with spaces | Includes blanks |
| `full_address_for_native_integrations` | Non-blank address fields joined with `,` | Cleanest single-line address; default mapping uses this |
| Flags & metadata |     |     |
| `newsletter` | Boolean — opted into newsletter |     |
| `fundraiser` | Boolean — has ever created a fundraiser |     |
| `email_verified` | Timestamp when email was verified (or `nil`) |     |
| `created_at` | When the Donately Person record was created |     |
| `updated_at` | When the Person record last changed |     |

##### Donation → HubSpot Deal

| Field | Returns | Notes |
| --- | --- | --- |
| Identity |     |     |
| `unique_identifier` | Donately Donation ID |     |
| `transaction_id` | Payment processor charge ID | e.g. Stripe `ch_...` |
| Amount & currency |     |     |
| `donation_amount_for_native_integrations` | Amount as decimal dollars (e.g. `25.00`) | Default mapping uses this for `amount` |
| `amount_in_cents` | Amount as integer cents |     |
| `donation_amount_formatted_for_native_integrations` | Locale-formatted string (e.g. `$25.00`) |     |
| `currency` | ISO currency code, lowercase (e.g. `usd`) |     |
| `currency_code_for_native_integrations` | Currency code upper-cased (e.g. `USD`) |     |
| Date |     |     |
| `donation_date` | Ruby timestamp (UTC) |     |
| `donation_date_for_native_integrations` | Unix epoch milliseconds | Default mapping uses this; HubSpot date fields expect ms |
| `donation_date_in_account_timezone` | Timestamp shifted to the account’s timezone |     |
| `created_at` | When the Donation record was created |     |
| Type & status |     |     |
| `status` | `completed`, `failed`, `refunded`, etc. |     |
| `donation_type` | Internal type code (e.g. `cc`, `paypal`) |     |
| `get_donation_type` | Human label (`Credit Card`, `Paypal`, …) |     |
| `processor` | `stripe`, `paypal`, `authorize_net` |     |
| `livemode` | Boolean — live vs test |     |
| `anonymous` | Boolean |     |
| `recurring` | Boolean — part of a recurring subscription |     |
| `recurring?` | Boolean — same as `recurring` | Default mapping uses this |
| `refunded?` / `refunded` | Boolean — has been refunded |     |
| `refunded_at` | Refund timestamp |     |
| Content |     |     |
| `donation_description_for_native_integrations` | `"$25 Donation to {campaign} {fundraiser}"` |     |
| `donation_name` / `name` | Donor full name (or `ANONYMOUS` / tribute name) |     |
| `comment` | Donor’s comment |     |
| `notes` | Internal notes |     |
| `on_behalf_of` | Tribute / honoree name |     |
| `dump` | Raw tracking-code dump from the form |     |
| `origin` | Originating page URL |     |
| `clean_origin` | URL-unescaped `origin` |     |
| `ecard` | E-card JSON (if used) |     |
| `metadata_for_native_integrations` | HTML-unescaped JSON blob of all `meta_data` |     |
| Donor (delegated to Person) |     |     |
| `email`, `first_name`, `last_name`, `phone_number` | Delegated from the donor | Same values as on Person |
| `street_address`, `street_address_2`, `city`, `state`, `zip_code`, `country` | Donor address fields |     |
| `full_address_for_native_integrations` | Donor address as a single space-joined string |     |
| Campaign / Fundraiser / Form |     |     |
| `campaign_id_for_native_integrations` | Campaign’s `unique_identifier` |     |
| `campaign_title_for_native_integrations` | Campaign title |     |
| `fundraiser_id_for_native_integrations` | Fundraiser’s `unique_identifier` |     |
| `fundraiser_title_for_native_integrations` | Fundraiser title |     |
| `form_id_for_native_integrations` | Form’s `unique_identifier` |     |
| Subscription (recurring) |     |     |
| `subscription_id_for_native_integrations` | Subscription’s `unique_identifier` |     |
| `subscription_frequency_for_native_integrations` | `monthly`, `yearly`, etc. |     |
| `subscription_start_day_for_native_integrations` | `YYYY-MM-DD` string |     |
| `subscription_status_for_native_integrations` | Subscription state |     |
| Misc |     |     |
| `donor_id_for_native_integrations` | Donor’s `unique_identifier` |     |
| `dtd_company_name_for_native_integrations` | Double-the-Donation matched company name |     |

Any public method on the underlying Ruby record is callable from a mapping key, so a field not listed here may still work. If you need something that isn’t here, [reach out to support](mailto:support@donately.com) and we’ll confirm availability or add it.
