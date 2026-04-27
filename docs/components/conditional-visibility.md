---
title: "Conditional Visibility"
source: "docs/components.html"
anchor: "conditional-visibility"
---
## Conditional Visibility

The logic component (`dntly-logic-component`) enables conditional show/hide of elements based on data values, without writing JavaScript.

### Show/Hide Attributes

```
<!-- Show element only when condition is true -->
<div data-dntly-show-if="type==p2p_fundraisers">
  This is a peer-to-peer campaign!
</div>

<!-- Hide element when condition is true -->
<div data-dntly-hide-if="total_count==0">
  Campaign list content
</div>
```

### Supported Operators

-   `==` — Equal to
-   `!=` — Not equal to
-   `&&` — Logical AND (combine conditions)
-   `||` — Logical OR (either condition)
