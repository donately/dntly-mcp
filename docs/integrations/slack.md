---
title: "Slack"
source: "docs/integrations/slack.html"
anchor: "slack"
---
## Overview

The Slack integration sends real-time donation notifications to a selected Slack channel. Each time a donation is processed in Donately, a message is posted to the channel with details about the donor and gift.

The integration connects via OAuth. Once connected, notifications are sent automatically each time a donation is created in Donately.

### What Gets Sent

-   A notification message per donation, posted to the configured channel

## Configuration

After connecting via OAuth, select the Slack channel where donation notifications should be posted. The bot must have permission to post in the selected channel.

Only one channel can be configured per Donately account. All donation notifications from that account will be posted to the same channel.

## Notification Format

Each notification message includes the following donation details:

| Field | Description |
| --- | --- |
| donor\_name | Full name of the donor |
| donation\_amount | Donation amount with currency |
| campaign\_title | Name of the campaign the donation was made to |

### Example Message

```
🎉 New donation from Jane Smith
Amount: $100.00
Campaign: Annual Giving 2025
```
