---
title: "Iframe Mode"
source: "docs/form.html"
anchor: "iframe-mode"
---
## Iframe Mode

When the form is embedded cross-domain or needs additional security isolation, it runs inside an iframe automatically. You can control iframe dimensions:

| Option | Description |
| --- | --- |
| iframe-height | Custom iframe height in pixels (default: auto-resize) |
| iframe-width | Custom iframe width (default: `100%`) |

The form automatically communicates resize events to the parent page so the iframe height adjusts to fit the content.

### Additional Options

| Option | Type | Description |
| --- | --- | --- |
| ecard | JSON | E-card configuration for tribute/memorial donations |
| tracking-codes | JSON | Custom tracking codes stored with the donation |
