---
title: "Callbacks"
source: "docs/components.html"
anchor: "callbacks"
---
## Callbacks

The `afterComponentLoad` callback fires after each component finishes loading its data and rendering:

```
DonatelyComponents.componentHandler.buildComponents({
  options: { "donately-id": "act_ba7d12ab27bb" },
  afterComponentLoad: function(parentElement, componentInstanceKey) {
    console.log("Component loaded:", componentInstanceKey);
    // parentElement is the DOM node of the component
  }
});
```
