---
title: "Getting Started"
source: "docs/components.html"
anchor: "getting-started"
---
## Getting Started

Donately Components is a JavaScript library that lets you embed fundraising UI elements — campaign lists, donation feeds, fundraiser profiles, and forms — on any website. No backend required.

### Include the Library

Add the CSS and JavaScript files from the CDN to your page:

```
<!-- In your <head> -->
<link rel="stylesheet" href="https://cdn.donately.com/dntly-components/2.3/donately-components.css">

<!-- Before closing </body> -->
<script src="https://cdn.donately.com/dntly-components/2.3/donately-components.min.js"></script>
```

The library is versioned by major.minor (e.g., `2.3`). Patch updates are deployed automatically to the same URL, so you always get the latest bug fixes.

### Add a Component

Place the component HTML in your page using `data-dntly` attributes. Each component uses a "clonable card" pattern for list items:

```
<div data-dntly="dntly-campaign-list-component">
  <div data-dntly="cmp-list-outer-container">
    <div data-dntly="cmp-list-inner-container">
      <!-- This card is cloned for each campaign -->
      <div data-dntly="cmp-list-card" data-dntly-clonable-card style="display:none">
        <h3 data-dntly="cmp-list-card-title"></h3>
        <p data-dntly="cmp-list-card-description"></p>
        <div data-dntly="cmp-list-card-amount-raised"></div>
      </div>
    </div>
  </div>
</div>
```
