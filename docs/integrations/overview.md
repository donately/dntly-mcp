---
title: "How It Works"
source: "docs/integrations.html"
anchor: "overview"
---
## How It Works

Donately's native integrations automatically sync donor and donation data to your external tools when events occur (e.g., a new donation is made). Each integration connects via OAuth and uses a default field mapping that can be customized.

### Available Integrations

[

![Salesforce](images/integrations/salesforce.svg)

#### Salesforce

Full CRM sync — Contacts, Accounts, Opportunities. Supports household/single account models, campaign rules, record types, and custom field mapping.

→](integrations/salesforce.html)[

![HubSpot](images/integrations/hubspot.svg)

#### HubSpot

Contacts and Deals. Configurable pipeline and deal stage mapping for donations and recurring gifts.

→](integrations/hubspot.html)[

![Virtuous](images/integrations/virtuous.svg)

#### Virtuous

Full CRM sync — Constituents and Gifts. Supports custom field mapping and recurring gift tracking.

→](integrations/virtuous.html)[

![Mailchimp](images/integrations/mailchimp.svg)

#### Mailchimp

Syncs donors as contacts to a selected Mailchimp audience list.

→](integrations/mailchimp.html)[

![Constant Contact](images/integrations/constant-contact.svg)

#### Constant Contact

Syncs donors as contacts to a selected Constant Contact list.

→](integrations/constant-contact.html)[

![Slack](images/integrations/slack.svg)

#### Slack

Sends real-time donation notifications to a selected Slack channel.

→](integrations/slack.html)

## Upcoming Integrations

[

![Raiser's Edge](images/integrations/raisers-edge.svg)

#### Raiser's Edge In Progress

Full CRM sync — Constituents and Gifts via the Blackbaud SKY API. Supports custom field mapping.

→](integrations/raisers-edge.html)

## Sync Flow

When a donation is processed in Donately, the integration engine runs the following steps:

1.  **Event triggered** — A donation is created, updated, or refunded.
2.  **Mapping applied** — The default field mapping (plus any custom overrides) is used to transform Donately data into the target system's format.
3.  **Record lookup** — For CRM integrations (Salesforce, HubSpot), the system checks if the donor already exists by email or Donately ID.
4.  **Upsert** — The donor record is created or updated, then the donation record is created in the target system.
5.  **Event logged** — A sync event is recorded in Donately with success/failure status. Failed syncs can be retried from the dashboard.
