---
title: "Callbacks & Events"
source: "docs/form.html"
anchor: "callbacks"
---
## Callbacks & Events

Callbacks are passed in the `Donately.init()` configuration:

| Callback | Description |
| --- | --- |
| afterFormLoad | Fires when the form has fully rendered and is ready |
| onSuccess | Fires after a successful donation. Receives the donation object. |
| onError | Fires on a donation error. Receives the error object. |
| afterNavigateHook | Fires after step navigation. Receives the current step number. |

### Example

```
Donately.init({
  selector: '#my-form',
  options: { ... },
  onSuccess: function(donation) {
    // Redirect to a thank-you page
    window.location.href = '/thank-you?amount=' + donation.amount_in_cents;
  },
  onError: function(error) {
    console.error('Donation failed:', error.message);
  }
});
```
