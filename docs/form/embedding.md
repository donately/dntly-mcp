---
title: "Embedding the Form"
source: "docs/form.html"
anchor: "embedding"
---
## Embedding the Form

The Donately embeddable form is a JavaScript-powered donation form that supports credit cards, ACH bank transfers, PayPal, Apple Pay, Google Pay, recurring donations, custom fields, and more.

This documentation covers **version 6.x** (current production). Version 7.x is a major rebuild and is coming soon.

### Method 1: Simple Script (Recommended)

The easiest way to embed your form. Add a single script tag with your account ID, Stripe key, and form ID. The form configuration is fetched automatically from the Donately API. Works on any page builder that lets your script run in the page itself (Webflow, Squarespace, Drupal, etc.). **Not Wix:** its HTML block sandboxes pasted markup in a cross-origin frame without `allow="payment"`, which silently removes Apple Pay and Google Pay. Use Method 4 there.

```
<script
  src="https://cdn.donately.com/core/6.0/donately.min.js"
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
  src="https://cdn.donately.com/core/6.0/donate-form.html?form_id=frm_xxxx&account_id=act_ba7d12ab27bb&stripe_key=pk_live_xxxx"
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
<script src="https://cdn.donately.com/core/6.0/donately.min.js" async="async"></script>
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

### Method 4: Custom Element

For page builders that refuse to run your script in the page. Wix is the one that matters today: its "HTML Code" element sandboxes whatever you paste into a cross-origin frame with no `allow="payment"`, so Apple Pay and Google Pay cannot run there no matter how the form is embedded. Its separate "Custom Element" widget *does* put your tag in the published page's own DOM, but it accepts only a script URL and a tag name, never markup.

`donately-element.js` registers `<donately-donate-form>` for exactly that slot. It is a delivery format, not a different technique: the element writes the Method 1 script into itself, with the same loader and the same `data-donately-*` attributes. Pasting it into an HTML block fails the same way Method 1 does.

```
<script src="https://cdn.donately.com/core/6.0/donately-element.js" async="async"></script>
<donately-donate-form
  account-id="act_ba7d12ab27bb"
  form-id="frm_xxxx"
  stripe-key="pk_live_xxxx"></donately-donate-form>
```

On Wix you do not paste that. Add "Embed Code", then "Custom Element", and fill in the fields:

| Field | Value |
| --- | --- |
| Server URL | `https://cdn.donately.com/core/6.0/donately-element.js` |
| Tag name | `donately-donate-form` |
| `account-id` | your account ID |
| `form-id` | the form to render |
| `stripe-key` | your Stripe publishable key |

Attribute names are the element's own; it maps them to the `data-donately-*` names the bundle reads. Any extra `data-*` attribute is passed through verbatim, so `campaign-id` and `data-donately-campaign-id` both work.

**Two things that make a correct setup look broken:**

- **Wix requires a Premium plan with a domain connected.** Below that, Wix strips the element server-side and replaces it with an empty div carrying `wix-disabled-custom-element-reason="required-wix-premium-account"`. Nothing of ours reaches the page, so there is no script, no tag and no network request to debug. Search the published page source for that attribute.
- **Check the published page, not the editor preview.** Wix renders custom elements inside a frame while you are editing, which is the one thing that hides the wallet. It will be missing in preview even when everything is right.

Requires a browser with custom element support; the element logs a warning and renders nothing on anything older. See also the step-by-step [Wix embedding guide](https://support.donately.com/help/embed-wix).
