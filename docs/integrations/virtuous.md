---
title: "Virtuous"
source: "docs/integrations/virtuous.html"
anchor: "virtuous"
---
## Overview

The Virtuous integration syncs Donately donor and donation data to Virtuous CRM Constituents and Gifts. It supports custom field mapping and recurring gift tracking.

Once connected, syncs are triggered automatically when a donation is created, updated or refunded, when a donor's details change, and when a recurring plan changes.

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

**Your Virtuous password is never stored.** Donately forwards your email and password to the Virtuous token endpoint and discards the password as soon as the tokens come back. What is kept is the access token, the refresh token that keeps the connection alive without asking you to sign in again, and your email address — which the Configure page shows back to you as *Connected as*.

## Configuration

Per-account settings live on the Virtuous card's **Configure** page in the Donately dashboard (`/native-integrations/virtuous/configure`), listed here in the order they appear there:

| Section | Description |
| --- | --- |
| [Project linking](#project-linking) | Designate gifts to a Virtuous Project based on the originating Donately form, campaign, fundraiser, or metadata |
| [Cover-the-cost fee project](#project-linking) | Where the donor's covered processing fee is designated — its own Project, or the gift's |
| [Sync mode](#sync-modes) | Whether gifts post straight into Virtuous or queue for admin approval first |
| [Missing name fallback](#missing-name-fallback) | How to handle donors with no first or last name (Virtuous rejects nameless contacts) |
| [Refunds & bank donation timing](#when-bank-donations-appear) | Whether refunds post a reversing transaction, and whether bank donations sync before they settle |
| Gift & donor defaults | Force a Virtuous gift type on every gift, and the constituent type used for new donors. Left alone, gift type is derived from how the donor paid and donor type is `Household` — which suits almost everyone |
| [Custom field mapping](#custom-field-mapping) | Override the default mappings between Donately fields and Virtuous properties |

## Sync Modes

Gifts reach Virtuous by one of two routes, chosen per account with `settings.sync_mode`. The trade-off is **immediacy vs. review**: direct mode puts the gift in Virtuous within seconds, queue mode holds it for an admin to approve first.

| | `direct` (default) | `import_queue` |
| --- | --- | --- |
| Endpoint | `POST /api/Gift` | `POST /api/v2/Gift/Transaction` |
| Admin review before the gift counts | No — lands in the gift list immediately | **Yes** — every gift queues for approval in Virtuous |
| Findable straight after sync | Yes | No — `404` until an admin approves it |
| Updating a gift after it syncs | Yes | Only once approved |
| Project designation | by **Project ID** (`giftDesignations`) | by **Project name** (`designations`) |
| Recurring gift linkage | Donately creates the RecurringGift and attaches each charge to it | Virtuous groups the charges itself when the batch is approved |
| Custom fields | pre-installed only (see below) | pre-installed only (see below) |

Two consequences worth planning around:

- **Project rules resolve differently.** Queue mode matches the Project by *name*, so a Project renamed in Virtuous stops matching and the gift lands undesignated in the "Update Needed" bucket. Direct mode matches by ID and is unaffected by renames.
- **Recurring gifts are linked by different mechanisms.** In direct mode Donately creates the Virtuous RecurringGift record itself and attaches each charge to it as a payment, immediately. In queue mode every charge carries a shared series identifier and its frequency, and Virtuous's import matching groups them into a recurring gift when the batch is approved. The practical difference is timing and control: the recurring record does not exist until someone approves the first charge, and because Donately never receives its ID, a later cancellation is matched to the recurring gift rather than addressed by ID.

### When bank donations appear

Card gifts sync within seconds of the payment completing.

For most cards that is the moment the donor submits. If the donor's bank requires **3D Secure** — the extra verification step where they approve the payment in their banking app — the gift appears once they finish that challenge, not when they press Donate. That is usually still seconds, but a donor who switches devices or gets a slow bank page can take longer. If they abandon the challenge, **no gift is created at all**: the payment never completed, so there is nothing to record.

**Bank transfers (ACH) do not settle immediately.** The money takes **several business days** to clear, and by default Donately waits for it to settle before creating the gift. An account on direct sync mode can opt out of that wait — see *Refunds & bank donation timing* on the Configure page. Measured across 66 recent settlements, clearing took **3.5 to 6.5 days, averaging 5.1** — so a bank donation given on a Monday usually appears in Virtuous between Thursday and the following Monday.

**PayPal usually settles within minutes** and behaves like a card. The exception is when the donor pays from a bank account rather than a balance or card — PayPal then holds the payment while it clears, and that gift waits for settlement in the same way an ACH gift does. You cannot tell which it will be at the moment the donor gives.

This is deliberate. A gift created before the money cleared would sit in your revenue totals at an amount that may never arrive. Waiting for settlement means every gift in Virtuous represents money you actually received.

**If you turn that wait off**, a transfer that later bounces is cleaned up for you: Donately removes the gift it created, so nothing is left claiming money that never arrived. Worth knowing about that:

- **A deletion leaves no visible trace.** The gift simply disappears, with no reversing entry in the donor's giving history to explain it — so a total that moves between two reports has nothing in Virtuous to account for the change.
- **A gift your team has already acknowledged or receipted is never deleted.** Removing it would undo real work with nothing to show for it, so it stays and Donately raises a warning instead, for you to correct by hand.
- This applies only to gifts Donately created early and that never settled. **A genuine refund is different** — that money did arrive, so it is cancelled with a reversing transaction and both entries stay on the donor's record.

## Custom Fields

Donately sends a set of custom fields so your Virtuous records carry the Donately donation, transaction, subscription, campaign, fundraiser and form identifiers alongside the standard amount/date/donor data.

Most go on the **Gift** object. Three of them — the subscription fields — are sent on **both** Gift and **Recurring Gift**, so if you want them on the recurring record you have to create them twice, once on each object. The **Object** column below says which.

**Virtuous only stores a custom field whose name already exists on that object, in _both_ sync modes.** Anything you have not defined is silently discarded — the record itself still saves with all its standard fields, but the discarded values never appear on it. There is no API for creating custom fields, so this step is manual and has to be done before the data will start landing.

### Where to create them in Virtuous

1. Open **Settings** (the gear at the bottom of the left sidebar) and choose the **Data Customization** tab.
2. Find the **Custom Fields and Collections** card and click **Custom Fields**. You can also go straight there: [app.virtuoussoftware.com/Generosity/CustomField](https://app.virtuoussoftware.com/Generosity/CustomField)
3. Click **New Custom Field**.
4. **Set OBJECT to the object named in the table below** — `Gift` for most, `Recurring Gift` for the subscription fields' second copy. It defaults to `Contact`, and a field created on the wrong object will not receive any of this data — this is the easiest step to get wrong.
5. Enter the **NAME** exactly as written in the table below, including the `dntly_` prefix. The match is exact.
6. Set **DATA TYPE** to **Text**. Every field below is text, including the true/false ones — Donately sends `"true"` / `"false"` as strings.
7. **Save Field**, then repeat for each field you want.

**DISPLAY** and **GROUP** are optional and affect only how the field is labelled and grouped in the Virtuous UI.

The table is ordered by how much each field adds, so if you are not creating all fourteen, start at the top. Every one is **Text** type.

| Field name | Object | Purpose | Why it helps |
| --- | --- | --- | --- |
| `dntly_donation_status` | Gift | Donation status (`processed`, `refunded`, `failed`, etc.) | **Virtuous gifts have no status field of their own.** Without this, a refunded or failed gift is indistinguishable from a good one in your CRM. The single highest-value field here. |
| `dntly_donation_id` | Gift | Donately's unique donation ID | The durable link back to Donately. Lets you reconcile a gift against Donately directly instead of matching on amount and date, and it is what support will ask for. |
| `dntly_transaction_id` | Gift | Processor (Stripe/PayPal) transaction ID for the charge | The processor's own charge ID — what appears on your bank reconciliation and what Stripe or PayPal support need to trace a payment. |
| `dntly_subscription_frequency` | Gift **and** Recurring Gift | Donately's recurring cadence, as written by Donately (`1.month`, `12.month`, `14.day`) | Virtuous's recurring gift has a fixed frequency list, and Donately maps six of its cadences onto it. Anything outside that — fortnightly, every 4 months, daily — exists **nowhere** in Virtuous without this field. |
| `dntly_subscription_id` | Gift **and** Recurring Gift | Donately subscription ID if the gift is part of a recurring plan | Groups every charge of one recurring plan together. On the Recurring Gift object it is the only way to trace that record back to Donately — Virtuous offers no reference lookup for it. |
| `dntly_donation_fundraiser` | Gift | Title of the Donately fundraiser the gift belongs to | Peer-to-peer attribution — which supporter's fundraising page produced the gift. Virtuous has no native equivalent, so this is the only way to credit them. |
| `dntly_donation_campaign` | Gift | Title of the Donately campaign the gift belongs to | Preserves Donately's campaign grouping. Virtuous Projects are configured separately and won't necessarily match your campaign structure. |
| `dntly_subscription_status` | Gift **and** Recurring Gift | Status of the recurring plan the gift belongs to | Whether the plan behind this charge is still active — useful when reviewing lapsed recurring donors. |
| `dntly_donation_processor` | Gift | Payment processor that handled the gift | Which processor took the money. Worth having if you run more than one, e.g. Stripe alongside PayPal. |
| `dntly_donation_recurring` | Gift | Whether the gift came from a recurring plan | Segment one-time from recurring giving at a glance, without joining to the recurring gift record. |
| `dntly_donation_form` | Gift | Title of the Donately form the donor used | Which form the donor gave through — useful for comparing form performance. |
| `dntly_form_id` | Gift | Donately form ID the donor used | The stable identifier for that form. Titles get renamed; this does not. |
| `dntly_on_behalf_of` | Gift | Tribute / "on behalf of" text supplied by the donor | The honoree or tribute the donor typed. Often needed for acknowledgement letters. |
| `dntly_donation_anonymous` | Gift | Whether the donor gave anonymously | Records the donor's explicit anonymity choice, separately from the gift's privacy flag in Virtuous. |

**Every one of these is optional** — skip any you don't want, and it is simply omitted. Nothing about the integration depends on them: gift matching, donor matching, amounts, dates, designations and recurring linkage all use Virtuous's built-in fields and work whether or not a single custom field exists.

If you only want a few, start with **`dntly_donation_status`** — Virtuous gifts have no status field, so this is the only place a refund or failure shows. After that, the fields carrying information Virtuous has no home for at all: **`dntly_transaction_id`** (the processor's charge id), **`dntly_donation_fundraiser`** and **`dntly_donation_campaign`** (peer-to-peer and campaign attribution), and **`dntly_donation_form`** / **`dntly_form_id`**.

`dntly_donation_id` is the one you can most easily skip — it duplicates the gift's built-in Transaction ID, which Donately sets on every gift regardless. Anonymity and tribute text are already written to Virtuous's own fields too.

## Field Mapping

How Donately data lands on the Virtuous record.

**Most of these are fixed, not configurable.** Names, email, phone and address are assembled into Virtuous's nested `contactIndividuals` / `contactAddresses` shape by the integration itself, and the gift's identifiers, type and `dntly_*` fields are set the same way. Only a handful of top-level gift fields — amount, date, description, currency, notes, tribute, privacy — plus the constituent's `referenceId` go through the mapping layer that [custom field mapping](#custom-field-mapping) can override.

### Constituent

| Donately Field | Virtuous Field |
| --- | --- |
| unique\_identifier | referenceId (built-in, paired with `referenceSource: "Donately"`) |
| email | contactIndividuals[].contactMethods[] — type `Home Email` |
| first\_name | contactIndividuals[].firstName |
| last\_name | contactIndividuals[].lastName |
| phone\_number | contactIndividuals[].contactMethods[] — type `Home Phone` |
| street\_address | contactAddresses[].address1 |
| street\_address\_2 | contactAddresses[].address2 |
| city | contactAddresses[].city |
| state | contactAddresses[].stateCode |
| zip\_code | contactAddresses[].postal |
| country | contactAddresses[].countryCode |

### Gift

Built-in Virtuous fields are always written. Custom fields (`dntly_*`) are only stored if you [created them first](#custom-fields).

| Donately Field | Virtuous Field |
| --- | --- |
| unique\_identifier | transactionId (built-in, paired with `transactionSource: "Donately"`) |
| donation\_name | description |
| donation\_amount | amount |
| donation\_date | giftDate |
| currency | currencyCode |
| donation\_type | giftType (built-in enum — card → `Credit`, ACH → `EFT`, cash/check → `Cash`) |
| anonymous | isPrivate |
| on\_behalf\_of | tributeDescription |
| comment | notes |
| transaction\_id | dntly\_transaction\_id (custom) |
| processor | dntly\_donation\_processor (custom) |
| status | dntly\_donation\_status (custom) |
| subscription\_id | dntly\_subscription\_id (custom) |
| subscription\_frequency | dntly\_subscription\_frequency (custom) |
| subscription\_status | dntly\_subscription\_status (custom) |
| campaign\_title | dntly\_donation\_campaign (custom) |
| fundraiser\_title | dntly\_donation\_fundraiser (custom) |
| form\_title | dntly\_donation\_form (custom) |
| form\_id | dntly\_form\_id (custom) |

### Recurring Gift

When a donor sets up a recurring gift, Donately also creates a **RecurringGift** record in Virtuous and attaches each charge to it as a payment. This happens in **direct mode**; in queue mode Virtuous builds the equivalent record itself from the series identifier on each transaction (see [Sync Modes](#sync-modes)).

| Donately Field | Virtuous Field |
| --- | --- |
| _(resolved constituent)_ | contactId |
| subscription start day | startDate |
| recurring frequency | frequency (built-in enum — see below) |
| subscription amount | amount |
| matched project rule | designations `[{ projectId, amountDesignated }]` |

Each individual charge is then attached to that record from the gift side, as `recurringGiftPayments: [{ id, amount, state: "Add" }]`.

Donately also sends three custom fields on the recurring gift record. Like the gift custom fields, they are **only stored if you create them first** — on the **Recurring Gift** object this time, not Gift:

| Field name | Why it helps |
| --- | --- |
| `dntly_subscription_id` | Virtuous has no way to look a recurring gift up by an external reference, so without this the record cannot be traced back to the Donately recurring plan at all. |
| `dntly_subscription_frequency` | Donately maps six of its cadences onto Virtuous's fixed frequency list. If your plan runs on anything else — fortnightly, every 4 months — the real schedule is recorded **nowhere** in Virtuous without this field. |
| `dntly_subscription_status` | Whether the plan is still active, cancelled or lapsed. |

These three are also sent on the Gift object, so they appear in the [Custom Fields](#custom-fields) table too — creating them there does not create them here. Same steps, with **Object** set to **Recurring Gift**.

**Frequency is a fixed Virtuous enum**, and only these Donately cadences map onto it:

| Donately | Virtuous |
| --- | --- |
| Weekly | `Weekly` |
| Monthly | `Monthly` |
| Every 2 months | `Bimonthly` |
| Quarterly | `Quarterly` |
| Every 6 months | `Semiannually` |
| Yearly | `Annually` |

Any other cadence — daily, every 2 or 3 days, fortnightly, every 4 months — has no Virtuous equivalent. Those charges still sync as ordinary one-time gifts; only the recurring record is skipped, and the integration records a warning rather than misrepresenting the schedule on the donor's record.

**Two things worth knowing:**

- **A recurring gift has no built-in external reference.** Unlike gifts and constituents, Virtuous's recurring gift record has no `transactionSource`/`transactionId` pair and no lookup by external id — which is exactly why the `dntly_subscription_id` custom field above matters. Create it and the record points back at the Donately plan; skip it and the only link lives on Donately's side.
- **Cancelling in Donately cancels in Virtuous** when Donately knows which record to cancel. Where it doesn't — queue-mode subscriptions, and older ones set up before this was added — it will only act on an unambiguous match of amount and frequency for that donor. Anything less certain raises a warning for you to cancel by hand, because cancelling the wrong schedule cannot be undone.

## Record Matching

The integration uses the following strategies to find existing records before creating new ones. Strategies are tried in order — the first match wins.

### Constituent Matching

| Strategy | Description |
| --- | --- |
| FindByPersonId | Primary match on Virtuous's built-in constituent reference — `GET /api/Contact/Donately/{referenceId}`, where `referenceId` is the Donately donor ID. Contacts created before this was introduced have no reference stamped, so they match on email until their next sync writes one. |
| FindByEmail | Fallback match by donor email address |

### Gift Matching

| Strategy | Description |
| --- | --- |
| FindByDonationId | Match on Virtuous's built-in transaction reference — `GET /api/Gift/Donately/{transactionId}`, where `transactionId` is the Donately donation ID. In `import_queue` mode a gift is not findable until an admin approves it. |

Both use built-in Virtuous fields, so matching works whether or not any custom fields are installed.

## Advanced

### Project Linking

Each Virtuous gift can be designated to a Project — Virtuous's accounting object for funds, programs, or campaigns. Donately picks the Project for each gift by walking an ordered list of rules. **Rules are evaluated top-to-bottom, and the first matching rule wins.** A donation that doesn't match any rule will not be designated to a Project unless you add a fallback rule.

Each rule has a `type` and the fields specific to that type:

| Rule type | When it matches | Required fields |
| --- | --- | --- |
| `form` | Donation came through a specific Donately form | `match_value` (form `unique_identifier`), `virtuous_project_id` |
| `campaign` | Donation belongs to a specific Donately campaign | `match_value` (campaign `unique_identifier`), `virtuous_project_id` |
| `fundraiser` | Donation belongs to a specific Donately fundraiser | `match_value` (fundraiser `unique_identifier`), `virtuous_project_id` |
| `meta_data` | A specific key/value pair appears in the donation's `meta_data` | `meta_key`, `match_value`, `virtuous_project_id` |
| `fallback_project` | Always — catches everything that didn't match an earlier rule | `virtuous_project_id` |

Order rules from most specific to least specific. If you use a `fallback_project` rule, put it last so it only fires when nothing earlier matched.

Example `settings.project_rules`:

```json
[
  { "type": "form", "match_value": "frm_abc123", "virtuous_project_id": 12345 },
  { "type": "meta_data", "meta_key": "appeal", "match_value": "endofyear", "virtuous_project_id": 67890 },
  { "type": "campaign", "match_value": "cmp_xyz789", "virtuous_project_id": 11111 },
  { "type": "fallback_project", "virtuous_project_id": 99999 }
]
```

The matched rule designates the gift amount to that Project. If the donor covered the processing fee **and** you have configured a fee Project, the gift arrives with two designations instead — the fee amount to the fee Project, the remainder to the matched one. The wire shape differs by [sync mode](#sync-modes): `direct` sends `giftDesignations: [{ projectId, amount, state }]` and matches the Project by **ID**; `import_queue` sends `designations: [{ name, amountDesignated }]` and matches by **name**, so renaming a Project in Virtuous will stop queue-mode rules from matching.

**Queue mode also needs the Project name.** Because `import_queue` matches by name, a rule needs `virtuous_project_name` alongside `virtuous_project_id`. A queue-mode rule carrying only the id designates to an empty name, and the gift lands in "Update Needed" — the same symptom as a renamed Project.

**Precedence:** in direct mode, project linking sets the gift's `projects` array *after* the payload is built from the field mappings, so if a [custom mapping override](#custom-field-mapping) also writes to `projects`, the project rule wins. In queue mode the designations travel under a different key, so a custom mapping writing `projects` is left untouched and simply has no effect.

### Missing Name Fallback

Virtuous expects a first and last name on every constituent, while Donately accepts donors with no name at all — anonymous donors, single-field donation forms, mobile flows that only ask for email. Without a fallback those donors have nothing to create a contact from, and their gifts cannot sync.

This applies when **both** names are missing. A donor with one of the two is sent through as-is.

Two strategies are available, configured via `settings.missing_name_fallback`:

| Value | Behavior |
| --- | --- |
| `email` (default) | Split the donor's email at the last `@` and use each side as a placeholder. `jane@acme.org` becomes `firstName: "jane"`, `lastName: "acme.org"`. The gift still syncs. Each fallback fires an `account.integration.run.warning` Event with `warning_type: "NAME_FALLBACK_APPLIED"` so the team can subscribe a Notification, patch the donor record in Donately, and re-run the integration to replace the placeholder. |
| `skip` | Record an `upsert_contact_skipped` failure on the integration run. The gift is *not* synced. The run's failure summary fires `account.integration.run.failure` at the end. Pick this if a hard signal in the run history is more useful than a placeholder contact in Virtuous. |

Either way, if the donor has no name *and* no usable email (blank, or no `@`), the integration falls back to recording the skip — there's nothing to synthesize from.

### Custom Field Mapping

You can override the default field mappings with a custom mapping. Custom mappings are defined as a JSON object where keys are Donately field names and values are the target Virtuous property names.

```json
{
  "Person": {
    "unique_identifier": "referenceId"
  },
  "Donation": {
    "donation_amount_for_native_integrations": "amount",
    "donation_date_for_virtuous": "giftDate",
    "donation_name_for_native_integrations": "description",
    "currency": "currencyCode",
    "comment": "notes",
    "on_behalf_of": "tributeDescription",
    "anonymous": "isPrivate"
  }
}
```

-   `Person` — Maps donor fields to Virtuous Constituent properties
-   `Donation` — Maps donation fields to Virtuous Gift properties

**A custom mapping replaces the default for that record type — it is not merged with it.** Whatever you supply is the complete mapping, so any default key you leave out is no longer sent at all. The example above lists every `Donation` default for exactly this reason: to change one, copy the whole block and edit that line.

Supplying `{"Donation": {"donation_amount_for_native_integrations": "amount"}}` on its own would stop sending the gift's date, description, currency, notes, tribute and privacy flag on every subsequent sync.

The keys are Donately method names, not column names, and several differ from what you might guess — `donation_amount_for_native_integrations`, not `donation_amount`. A key that isn't a real method fails the sync for that record.

If you map something to the gift's `projects` field here AND have a [Project Linking](#project-linking) rule that matches, the project rule wins — see the precedence note in that section.
