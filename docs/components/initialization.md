---
title: "Initialization"
source: "docs/components.html"
anchor: "initialization"
---
## Initialization

Initialize all components on the page by calling `buildComponents()`:

```
<script>
  function dntlyReady(name, callback) {
    window.setTimeout(function() {
      if (window[name]) { callback(); }
      else { dntlyReady(name, callback); }
    }, 10);
  }

  dntlyReady("DonatelyComponents", function() {
    DonatelyComponents.componentHandler.buildComponents({
      options: {
        "donately-id": "act_ba7d12ab27bb",
        "campaign-id": "cmp_e4b08ef12147",   // optional
        "fundraiser-id": "fndr_3ae925bf846f", // optional
        "form-id": "frm_3ae925bf846f"         // optional
      },
      afterComponentLoad: function(parentElement, componentInstanceKey) {
        // Called when each component finishes loading
      }
    });
  });
</script>
```

Options can also be passed via URL query parameters (e.g., `?campaign_id=cmp_xxx&limit=10`) or as data attributes on the component element.
