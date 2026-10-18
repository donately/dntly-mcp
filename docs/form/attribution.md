---
title: "Attribution & UTM Tracking"
source: "docs/form.html"
anchor: "attribution"
---
## Attribution & UTM Tracking

Donately records the page URL the form was loaded on, and the UTM parameters reported in the dashboard are parsed from that URL at the moment the form loads. If a visitor clicks an ad today and donates next week from a bookmark, the URL carries no parameters and the UTM columns are empty.

To attribute delayed conversions, store the first-touch parameters in the browser and feed them into hidden fields on the form. Donately saves any custom field onto the donation record, so the values flow into reporting and exports.

### Step 1: Add hidden fields

Declare one hidden field per value you want to keep. See [Custom Fields](#custom-fields) for the full field reference.

```
"custom-fields": [
  { "type": "hidden", "id": "utm_source" },
  { "type": "hidden", "id": "utm_medium" },
  { "type": "hidden", "id": "utm_campaign" },
  { "type": "hidden", "id": "utm_content" },
  { "type": "hidden", "id": "utm_term" },
  { "type": "hidden", "id": "utm_id" },
  { "type": "hidden", "id": "gclid" },
  { "type": "hidden", "id": "fbclid" }
]
```

**Always set `id` explicitly.** The DOM element id and the `meta_data` key are both derived from it, and the rules are strict:

| Situation | Resulting id |
| --- | --- |
| `id` provided | Lowercased, with anything outside `a-z 0-9 - _` stripped |
| `id` omitted, `label` provided | Random suffix appended, not predictable |
| `id` omitted and no `label` | Fully random |
| `id` collides with another field or a layout location | `_` appended |

Only the first row gives you an id you can target from your own script.

### Step 2: Capture first touch

Run this as early as possible on every page that can receive ad traffic, not just the donation page.

```js
(function () {

  var ATTRIBUTION_DAYS = 30;
  var ATTRIBUTION_MS   = ATTRIBUTION_DAYS * 24 * 60 * 60 * 1000;
  var TIMESTAMP_KEY    = "dntly_attr_timestamp";

  var KEYS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content",
    "utm_term", "utm_id", "gclid", "fbclid"
  ];

  var params = new URLSearchParams(window.location.search);

  function clearAll() {
    KEYS.forEach(function (k) {
      localStorage.removeItem("dntly_attr_" + k);
    });
    localStorage.removeItem(TIMESTAMP_KEY);
  }

  var now      = Date.now();
  var storedAt = parseInt(localStorage.getItem(TIMESTAMP_KEY), 10) || 0;

  if (storedAt && (now - storedAt) > ATTRIBUTION_MS) {
    clearAll();
  }

  var incoming = KEYS.some(function (k) {
    return !!params.get(k);
  });

  // Any marketing parameter present means a new click. Clear the previous
  // set first, or a Google click inherits the fbclid from an earlier Meta one.
  if (incoming) {

    clearAll();

    KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) {
        localStorage.setItem("dntly_attr_" + k, v);
      }
    });

    localStorage.setItem(TIMESTAMP_KEY, String(now));
  }

})();
```

### Step 3: Populate the fields

The form renders asynchronously, so poll briefly rather than assuming the fields exist at `load`.

```js
window.addEventListener("load", function () {

  var KEYS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content",
    "utm_term", "utm_id", "gclid", "fbclid"
  ];

  var attempts = 0;

  var interval = setInterval(function () {

    KEYS.forEach(function (k) {
      var field = document.getElementById(k);
      if (field) {
        field.value = localStorage.getItem("dntly_attr_" + k) || "";
      }
    });

    if (++attempts >= 20) {
      clearInterval(interval);
    }

  }, 500);

});
```

### Where the values land

Each hidden field is stored on the donation's `meta_data`, keyed by the field id, and is available through the API, exports, and as a column in the Donations table.

```json
{
  "utm_source": "meta",
  "utm_medium": "paid_social",
  "utm_campaign": "spring_appeal",
  "utm_content": "120251589127400551"
}
```

These are separate from Donately's own UTM columns, which continue to read from the page URL. On a returning visit the built-in columns are empty while your custom fields are populated. Report on the custom fields.

### Gotchas

| Issue | Detail |
| --- | --- |
| Host redirects strip parameters | Many platforms drop marketing parameters on a non-canonical redirect. Squarespace strips `utm_source`, `utm_medium`, `utm_campaign` and `gclid` on any redirect hop. Point every ad at the exact canonical URL, with `https` and the correct `www` form. |
| Meta sends `campaign.id` with a dot | `params.get("campaign_id")` returns `null`. Read `campaign.id` and store it under a name of your choosing. |
| Private browsing | Closing the last private window discards local storage entirely. Nothing survives, by design. |
| No expiry means permanent credit | Without the timestamp check above, a click from a year ago is still credited. Match the window to your reporting window. |
| Blending across clicks | Writing only the parameters present on the current URL leaves stale values from an earlier, different click. Clear before writing. |
