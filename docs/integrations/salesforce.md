---
title: "Salesforce"
source: "docs/integrations/salesforce.html"
anchor: "salesforce"
---
## Overview

The Salesforce integration syncs Donately donor and donation data to Salesforce Contacts, Accounts, and Opportunities. It supports both single-account and household-account models, and can associate donations with Salesforce Campaigns.

The integration connects via OAuth. Once connected, syncs are triggered automatically each time a donation is created, updated, or refunded in Donately.

### What Gets Synced

-   **Contact** — Donor identity and address information
-   **Account** — Donor's associated account (single or household model)
-   **Opportunity** — Each donation, including recurring subscription details
-   **Campaign** — Donations can be associated with a Salesforce Campaign (optional)

## Configuration

These settings are configured per Donately account and control how records are created and linked in Salesforce.

Integration User

| Setting | Description | Default |
| --- | --- | --- |
| user\_id | 18-character Salesforce User ID used for API calls and record ownership | —   |

Account Mapping

| Setting | Description | Default |
| --- | --- | --- |
| account\_model | How Accounts are created and associated with Contacts:  <br>  <br>`single` — All contacts share one default Account, created once during initialization.  <br>`household` — Each contact gets a dedicated Account named by the `household_name_format` template (NPSP-style).  <br>`none` — Donately does not create or assign Accounts. Salesforce or NPSP automation handles account creation. | `single` |
| household\_name\_format | Template for household Account names when `account_model` is `household`. Supports `{first_name}` and `{last_name}` tokens. | `{last_name} Household` |
| account\_record\_type\_id | Salesforce Record Type ID applied to new Accounts | —   |

Contact Mapping

| Setting | Description | Default |
| --- | --- | --- |
| contact\_role | Role assigned to the Contact on the Opportunity Contact Role (e.g., "Donor") | —   |
| contact\_record\_type\_id | Salesforce Record Type ID applied to new Contacts | —   |

Opportunity Mapping

| Setting | Description | Default |
| --- | --- | --- |
| donation\_stage\_name | Opportunity stage for one-time donations | `Closed Won` |
| recurring\_donation\_stage\_name | Opportunity stage for recurring donations | `Pledged` |
| opportunity\_record\_type\_id | Salesforce Record Type ID applied to new Opportunities | —   |
| gift\_type\_field | Custom field API name to store the gift type on the Opportunity | —   |
| gift\_type\_value | Value written to `gift_type_field` | `Donately` |
| source\_field | Custom field API name to store the donation source on the Opportunity | —   |
| source\_value\_from | Template for the source value. Supports [template tokens](#template-tokens) like `{campaign_title}`. | —   |
| fund\_field | Custom field API name to store the fund/designation on the Opportunity | —   |
| fund\_default\_value | Default value written to `fund_field` | `General Operating` |

Campaign Mapping — optional

When configured, donations are associated with a matching Salesforce Campaign based on campaign rules. See [Campaign Rules](#campaign-rules) for how matching works.

| Setting | Description | Default |
| --- | --- | --- |
| campaign\_member\_status | Status assigned to the Contact when added as a Campaign Member (e.g., "Responded") | —   |

## Field Mapping

Default mappings from Donately fields to Salesforce fields. These can be overridden using [custom field mapping](#custom-field-mapping).

### Contact

| Donately Field | Salesforce Field |
| --- | --- |
| email | Email |
| first\_name | FirstName |
| last\_name | LastName |
| unique\_identifier | dntly\_PersonId\_\_c |
| phone\_number | Phone |
| street\_address | MailingStreet |
| city | MailingCity |
| state | MailingState |
| zip\_code | MailingPostalCode |
| country | MailingCountry |
| full\_address | dntly\_FullAddress\_\_c |

### Account

| Donately Field | Salesforce Field |
| --- | --- |
| title | Name |
| unique\_identifier | dntly\_AccountId\_\_c |

### Opportunity (Donation)

| Donately Field | Salesforce Field |
| --- | --- |
| donation\_name | Name |
| donation\_amount | Amount |
| donation\_date | CloseDate |
| donation\_description | Description |
| unique\_identifier | dntly\_DonationId\_\_c |
| currency | dntly\_Currency\_\_c |
| donation\_type | dntly\_DonationType\_\_c |
| transaction\_id | dntly\_TransactionId\_\_c |
| processor | dntly\_Processor\_\_c |
| livemode | dntly\_Livemode\_\_c |
| anonymous | dntly\_Anonymous\_\_c |
| on\_behalf\_of | dntly\_OnBehalfOf\_\_c |
| comment | dntly\_Comments\_\_c |
| status | dntly\_DonationStatus\_\_c |
| recurring | dntly\_DonationRecurring\_\_c |
| subscription\_frequency | dntly\_RecurringFrequency\_\_c |
| subscription\_id | dntly\_SubscriptionId\_\_c |
| subscription\_status | dntly\_SubscriptionStatus\_\_c |
| subscription\_start\_date | dntly\_SubscriptionStartDate\_\_c |
| campaign\_id | dntly\_CampaignId\_\_c |
| campaign\_title | dntly\_CampaignName\_\_c |
| fundraiser\_id | dntly\_FundraiserId\_\_c |
| fundraiser\_title | dntly\_FundraiserName\_\_c |
| form\_id | dntly\_FormId\_\_c |
| account\_id | dntly\_AccountId\_\_c |
| tracking\_codes | dntly\_TrackingCodes\_\_c |
| metadata | dntly\_Metadata\_\_c |
| dtd\_company\_name | dntly\_DtdCompanyName\_\_c |

### Campaign Rules

Campaign rules allow you to route donations to specific Salesforce Campaigns based on matching criteria. Rules are evaluated in order — the first match wins.

#### Rule Types

| Type | Description |
| --- | --- |
| form | Match by the Donately Form used for the donation |
| campaign | Match by the Donately Campaign the donation was made to |
| fundraiser | Match by the Donately Fundraiser the donation was made through |
| meta\_data | Match by a metadata key/value on the donation |
| auto\_create\_from\_campaign | Automatically create a Salesforce Campaign from the Donately campaign |
| auto\_create\_from\_fundraiser | Automatically create a sub-campaign from the Donately fundraiser under the parent campaign |
| fallback\_campaign | Default catch-all rule if no other rules match |

#### Rule Structure

```json
{
  "type": "campaign",
  "match_value": "cmp_e4b08ef12147",
  "match_label": "Annual Giving Campaign",
  "sf_campaign_id": "7013t000001ABC",
  "sf_campaign_name": "2025 Annual Fund"
}
```

Rules are evaluated in order from top to bottom. Place your most specific rules first and the fallback rule last. Only one fallback rule and one auto-create rule are recommended.

## Duplicate Detection

When Salesforce's duplicate detection rules fire during a Contact create or update, the integration automatically handles the `DUPLICATES_DETECTED` error by retrying with Salesforce's `allowSave` header. The contact is saved successfully and the potential duplicates are flagged for manual review in the Donately dashboard.

This means your Salesforce duplicate rules will never block syncs from Donately, but you'll still be alerted to potential duplicates so you can merge records as needed.

### Account Creation by Account Model

How Accounts are created and associated with the Contact depends on the `account_model` setting:

| account\_model | Account Behavior |
| --- | --- |
| single | One shared Account is created (or found) once during integration setup and reused for all Contacts and Opportunities. The Contact's `AccountId` is always set to this single Account. |
| household | A dedicated Account is created per Contact, named using the `household_name_format` template (e.g., "Smith Household"). If a household Account for that donor already exists it is reused. The Contact's `AccountId` is set to this household Account, and the Opportunity is linked to it as well. |
| none | Donately does not create or assign any Account. The Contact's `AccountId` is left unset, allowing Salesforce flows or NPSP automation to assign it. For Opportunities, if the Contact has no `AccountId` at sync time, the Opportunity's account association is also left unset. |

Use `account_model: none` if your Salesforce org uses NPSP or custom automation to manage Account creation. Donately will sync the Contact and Opportunity without interfering with your existing Account assignment logic.

## Advanced

### Template Tokens

Some configuration fields support dynamic tokens that are replaced with actual values at sync time:

| Token | Resolves To | Used In |
| --- | --- | --- |
| {first\_name} | Donor's first name | household\_name\_format |
| {last\_name} | Donor's last name | household\_name\_format |
| {campaign\_title} | Donately campaign title | source\_value\_from |
| {fundraiser\_title} | Donately fundraiser title | source\_value\_from |
| {fundraiser\_or\_campaign\_title} | Fundraiser title if present, otherwise campaign title | source\_value\_from |

```
// Household name format
"{last_name} Household"
// Resolves to: "Smith Household"

// Source value from campaign
"Online - {campaign_title}"
// Resolves to: "Online - Annual Giving 2025"
```

### Custom Field Mapping

You can override the default field mappings with a custom mapping. Custom mappings are defined as a JSON object where keys are Donately field names and values are either a Salesforce field API name or a [helper expression](#mapping-helpers).

```json
{
  "Person": {
    "email": "Email",
    "unique_identifier": "dntly_PersonId__c",
    "phone_number": "MobilePhone"
  },
  "Donation": {
    "donation_amount": "Amount",
    "comment": "My_Custom_Comments__c"
  }
}
```

-   `Person` — Maps donor fields to Salesforce Contact fields
-   `Donation` — Maps donation fields to Salesforce Opportunity fields

Custom mappings are merged with the defaults. You only need to specify the fields you want to override — any fields not listed in your custom mapping will use the default mapping.

#### Mapping Helper Expressions

Instead of a Donately field name, the value side of a mapping entry can use a helper expression to compute or transform the value written to Salesforce.

| Expression | Description | Example |
| --- | --- | --- |
| custom\_string:<value> | Writes a literal string to the Salesforce field regardless of donation data. | `"custom_string:Online Donation": "My_Source__c"` → writes `"Online Donation"` to `My_Source__c` |
| date\_format(<format>) | Formats the donation's `donation_date` using a pattern built from `yyyy`, `mm`, and `dd` tokens. Returns `nil` if no donation date is present. | `"date_format(yyyy-mm-dd)": "My_Date__c"` → writes `"2025-03-15"` to `My_Date__c` |
| donation.meta\_data\['<key>'\] | Reads a value from the donation's `meta_data` hash by key. Returns `nil` if the key is not present. | `"donation.meta_data['source_code']": "My_Source__c"` → writes the `source_code` metadata value to `My_Source__c` |
| <expr> \| <expr> | Fallback operator. Tries the first expression; if it returns `nil` or an empty string, uses the second expression instead. Expressions can be any mapping helper (meta\_data, custom\_string, method name, etc.). Can be chained for multiple fallbacks. | `"donation.meta_data['honoree_name'] \| donation.meta_data['cf_text_2_3']": "dntly_OnBehalfOf__c"` → uses `honoree_name` if present, otherwise falls back to `cf_text_2_3` |

```json
{
  "Donation": {
    // Literal string — always write "Online" to My_Channel__c
    "custom_string:Online": "My_Channel__c",

    // Date format — write donation date as "2025-03-15"
    "date_format(yyyy-mm-dd)": "My_CloseDate__c",

    // Metadata — pull a custom source_code passed on the donation
    "donation.meta_data['source_code']": "My_Source__c",

    // Fallback — try honoree_name first, fall back to cf_text_2_3
    // Useful when multiple forms write tribute data to different meta_data keys
    "donation.meta_data['honoree_name'] || donation.meta_data['cf_text_2_3']": "dntly_OnBehalfOf__c"
  }
}
```

#### Available Donately Fields

The tables below list the Donately fields that can be used as keys in a custom mapping. Any public method on the underlying record is accepted — these are the ones most commonly useful for CRM sync.

##### Person (donor) → Salesforce Contact

| Field | Returns | Notes |
| --- | --- | --- |
| Identity & name |     |     |
| `email` | Donor email address | Primary key for matching |
| `unique_identifier` | Donately Person ID | Stable, globally unique |
| `first_name` | Raw first name as entered |     |
| `last_name` | Raw last name as entered |     |
| `first_name_for_native_integrations` | Same as `first_name` | Default mapping uses this; safe to swap with `first_name` |
| `last_name_for_native_integrations` | Same as `last_name` | Default mapping uses this |
| `full_name` | `"{first_name} {last_name}"` | Use this for a single “donor name” custom field |
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
| `address` | Alias of `full_address` |     |
| `full_address_for_native_integrations` | Non-blank address fields joined with `,` | Cleanest single-line address; default mapping uses this |
| Flags & metadata |     |     |
| `newsletter` | Boolean — opted into newsletter |     |
| `fundraiser` | Boolean — has ever created a fundraiser |     |
| `email_verified` | Timestamp when email was verified (or `nil`) |     |
| `created_at` | When the Donately Person record was created |     |
| `updated_at` | When the Person record last changed |     |
| `person.meta_data['<key>']` | Reads a single key from the Person’s `meta_data` hash | Helper expression; returns `nil` if key missing |

##### Donation → Salesforce Opportunity

| Field | Returns | Notes |
| --- | --- | --- |
| Identity |     |     |
| `unique_identifier` | Donately Donation ID |     |
| `transaction_id` | Payment processor charge ID | e.g. Stripe `ch_...` |
| Amount & currency |     |     |
| `donation_amount_for_native_integrations` | Amount as decimal dollars (e.g. `25.00`) | Default mapping uses this for `Amount` |
| `amount_in_cents` | Amount as integer cents |     |
| `donation_amount_formatted_for_native_integrations` | Locale-formatted string (e.g. `$25.00`) |     |
| `currency` | ISO currency code, lowercase (e.g. `usd`) |     |
| `currency_code_for_native_integrations` | Currency code upper-cased (e.g. `USD`) |     |
| Date |     |     |
| `donation_date` | Ruby timestamp (UTC) | Use `date_format(…)` helper for string output |
| `donation_date_for_native_integrations` | Unix epoch milliseconds |     |
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
| `recurring_for_native_integrations` | Forced boolean cast of `recurring` |     |
| `refunded?` / `refunded` | Boolean — has been refunded |     |
| `refunded_at` | Refund timestamp |     |
| Content |     |     |
| `donation_name_for_native_integrations` | Verbose name (e.g. `Jane Smith $25.00 One-Time donation on 2026-04-24…`) | Default mapping uses this for `Name` |
| `donation_description_for_native_integrations` | `"$25 Donation to {campaign} {fundraiser}"` | Default mapping uses this for `Description` |
| `donation_name` / `name` | Donor full name (or `ANONYMOUS` / tribute name) |     |
| `comment` | Donor’s comment |     |
| `notes` | Internal notes |     |
| `on_behalf_of` | Tribute / honoree name |     |
| `dump` | Raw tracking-code dump from the form |     |
| `origin` | Originating page URL |     |
| `clean_origin` | URL-unescaped `origin` |     |
| `ecard` | E-card JSON (if used) |     |
| `metadata_for_native_integrations` | HTML-unescaped JSON blob of all `meta_data` |     |
| `donation.meta_data['<key>']` | Reads a single key from the donation’s `meta_data` | Helper expression |
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
| Account & misc |     |     |
| `donation_account_for_native_integrations` | Nonprofit account’s `unique_identifier` |     |
| `donor_id_for_native_integrations` | Donor’s `unique_identifier` |     |
| `dtd_company_name_for_native_integrations` | Double-the-Donation matched company name |     |

Any public method on the underlying Ruby record is callable from a mapping key, so a field not listed here may still work. If you need something that isn’t here, [reach out to support](mailto:support@donately.com) and we’ll confirm availability or add it.
