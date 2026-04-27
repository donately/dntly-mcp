---
title: "Embedding the Form"
source: "docs/form.html"
anchor: "embedding"
---
## Embedding the Form

The Donately embeddable form is a JavaScript-powered donation form that supports credit cards, ACH bank transfers, PayPal, Apple Pay, Google Pay, recurring donations, custom fields, and more.

This documentation covers **version 6.x** (current production). Version 7.x is a major rebuild and is coming soon.

### Method 1: Simple Script (Recommended)

The easiest way to embed your form. Add a single script tag with your account ID, Stripe key, and form ID. The form configuration is fetched automatically from the Donately API. Works on any page builder that allows script embeds (Webflow, Squarespace, Wix, Drupal, etc.).

```
<script
  src="https://cdn.donately.com/6.0/donately.min.js"
  data-donately-id="act_ba7d12ab27bb"
  data-stripe-publishable-key="pk_live_xxxx"
  data-donately-form-id="frm_xxxx"
  data-donately-fetch-config="true"
  async="async">
</script>
```

**Tip:** We recommend re-copying the embed code each time you make changes to your form in the Donately dashboard.

### Method 2: Iframe

Perfect for tools that limit your ability to use JavaScript on your site (e.g., WordPress). The iframe is generated automatically from your form configuration.

```
<iframe
  src="https://cdn.donately.com/6.0/donate-form.html?form_id=frm_xxxx&account_id=act_ba7d12ab27bb&stripe_key=pk_live_xxxx"
  width="100%"
  height="850px"
  frameborder="0"
  allowtransparency="true"
  allow="payment *"
  style="max-width:600px;">
</iframe>
```

### Method 3: Advanced Script

Gives you full control of the embed code. Best for developers with programming experience who want to customize callbacks, handle events, or pass dynamic options.

```
<div id="dntly-donation-form"></div>
<script src="https://cdn.donately.com/6.0/donately.min.js" async="async"></script>
<script>
  dntlyReady("Donately", function(t) {
    Donately.init({
      selector: '#dntly-donation-form',
      options: {
        "donately-id": "act_ba7d12ab27bb",
        "stripe-publishable-key": "pk_live_xxxx",
        "donately-form-id": "frm_xxxx"
      },
      afterFormLoad: function() {},
      afterNavigateHook: function(stepNumber) {},
      onSuccess: function(donation) {},
      onError: function(error) {}
    });
  });
  function dntlyReady(name, callback) {
    window.setTimeout(function() {
      if (window[name]) { callback(window[name]); }
      else { dntlyReady(name, callback); }
    }, 10);
  }
</script>
```
