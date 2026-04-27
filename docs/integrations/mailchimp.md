---
title: "Overview"
source: "docs/integrations/mailchimp.html"
anchor: "mailchimp"
---
## Overview

The Mailchimp integration syncs donor email addresses and names to a selected Mailchimp audience list. When a new donation is made, the donor is added to (or updated in) the chosen list.

The integration connects via OAuth. Once connected, syncs are triggered automatically each time a donation is created in Donately.

### What Gets Synced

-   **Audience Member** — Donor email address, first name, and last name

## Configuration

After connecting via OAuth, select which Mailchimp audience list donors should be synced to. No additional field mapping configuration is required.

Only one audience list can be selected per Donately account. All donors from that account will be synced to the same list.

## Field Mapping

The following Donately donor fields are synced to Mailchimp by default.

| Donately Field | Mailchimp Field |
| --- | --- |
| email | Email Address |
| first\_name | FNAME |
| last\_name | LNAME |
