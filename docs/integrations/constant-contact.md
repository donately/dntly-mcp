---
title: "Overview"
source: "docs/integrations/constant-contact.html"
anchor: "constant-contact"
---
## Overview

The Constant Contact integration syncs donor email addresses and names to a selected Constant Contact list. When a donation is processed, the donor is added to (or updated in) the chosen list.

The integration connects via OAuth. Once connected, syncs are triggered automatically each time a donation is created in Donately.

### What Gets Synced

-   **Contact** — Donor email address, first name, and last name

## Configuration

After connecting via OAuth, select which Constant Contact list donors should be synced to. No additional field mapping configuration is required.

Only one list can be selected per Donately account. All donors from that account will be synced to the same list.

## Field Mapping

The following Donately donor fields are synced to Constant Contact by default.

| Donately Field | Constant Contact Field |
| --- | --- |
| email | email\_address |
| first\_name | first\_name |
| last\_name | last\_name |
