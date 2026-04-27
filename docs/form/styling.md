---
title: "Styling & Themes"
source: "docs/form.html"
anchor: "styling"
---
## Styling & Themes

### Pre-built Themes

```
"theme": "clean"
```

Available themes: `clean`, `minimal`, and more.

### Custom Theme (CSS Variables)

Override specific CSS variables to match your brand:

```
"custom-theme": {
  "-PrimaryColor": "#4A90D9",
  "-PrimaryFontFamily": "Helvetica, Arial, sans-serif",
  "-PrimaryFontSize": "16px",
  "-FormBackgroundColor": "#ffffff",
  "-FormOuterPadding": "20px",
  "-FieldBorderColor": "#cccccc",
  "-FieldBorderWidth": "1px",
  "-FieldBackgroundColor": "#fafafa",
  "-FieldFontColor": "#333333",
  "-LabelFontColor": "#555555",
  "-ErrorTextColor": "#dc3545"
}
```

### Available CSS Variables

| Variable | Description |
| --- | --- |
| \-PrimaryColor | Main brand / button color |
| \-PrimaryFontFamily | Font family for all form text |
| \-PrimaryFontSize | Base font size |
| \-FormBackgroundColor | Form container background |
| \-FormOuterPadding | Padding around the form |
| \-FieldBackgroundColor | Input field background |
| \-FieldFontColor | Input field text color |
| \-FieldBorderColor | Input field border color |
| \-FieldBorderWidth | Input field border width |
| \-LabelFontColor | Label text color |
| \-ErrorTextColor | Error/validation message color |

### Custom CSS

For full control, inject custom CSS:

```
"custom-css": ".dntly-form .dntly-submit-btn { border-radius: 50px; }"
```
