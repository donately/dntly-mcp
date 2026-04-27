# Anthropic Connectors Directory submission

Pre-filled answers for the **Donately MCP Server (Dev Docs)** submission to
the Anthropic / Claude Connectors Directory.

**Where to submit:** <https://clau.de/mcp-directory-submission>
(fallback if blocked: email `mcp-review@anthropic.com`)

The reviewer needs only the hosted endpoint URL — no credentials, no signup.

---

## Server basics

| Field | Value |
| --- | --- |
| Server name | **Donately** |
| URL | `https://mcp.donate.ly/mcp` |
| Tagline | Donately developer docs as MCP — accurate API reference and integration guides for AI assistants |
| Description | The Donately MCP server gives AI assistants accurate, on-demand access to Donately's developer documentation: REST API reference, the embeddable donation form, the dntly-components UI library, and per-integration setup guides for Salesforce, HubSpot, Mailchimp, Stripe, and others. Useful for any developer integrating donation flows into their app or website. Read-only and unauthenticated. A separate OAuth-scoped customer-data MCP is planned for July 2026 to let nonprofit admins query and act on their own Donately account. |
| Use cases | • A developer asking Claude/Cursor "how do I create a one-time donation through the Donately API?" gets the correct `/v2/donations` endpoint with current parameters.<br>• A user generating embed code for a campaign page gets a working `<script>` tag that matches the latest dntly-form options.<br>• A solutions engineer asking "what does Donately's Salesforce integration sync?" gets the documented field map from `integrations/salesforce`.<br>• Any AI assistant fact-checking Donately integration code against the canonical docs at `developer.donately.com`. |

## Connection details

| Field | Value |
| --- | --- |
| Authentication type | **None** (public, anonymous) |
| Transport protocol | **Streamable HTTP** (stateless) |
| Read / write capabilities | **Read-only** — no mutations, no external calls |
| Connection requirements | None |

## Data & compliance

| Field | Value |
| --- | --- |
| Data handling practices | The server reads only from a Markdown corpus of Donately's public developer documentation, baked into the deployment image. **No user data is collected, stored, or transmitted.** Server is stateless — no session state, no database, no cookies. Standard HTTP request logs are retained by Railway (the host) for ≤30 days for operational debugging; no query bodies are persisted by the application. |
| Third-party connections | None. The server is fully self-contained. |
| Health data access | No |
| Category | **Developer Tools** |

## Tools

All three tools have `title`, `readOnlyHint: true`, `destructiveHint: false`,
and `openWorldHint: false` (verified via the live endpoint).

| Tool | Purpose |
| --- | --- |
| `search_docs(query, limit?, category?)` | Keyword search across the Donately developer doc corpus. Returns top-ranked matches with title, doc path, and snippet. |
| `get_doc(path)` | Fetch the full Markdown body of a specific doc by path (e.g. `api/donations`, `form/embedding`, `integrations/stripe`). |
| `list_docs(category?)` | Enumerate all available docs, optionally filtered to one category (`api`, `form`, `components`, `integrations`). |

No prompts or resources are exposed.

## Documentation & support

| Field | Value |
| --- | --- |
| Public documentation | <https://developer.donately.com/mcp.html> |
| Privacy policy | <https://www.donately.com/privacy-policy> |
| Support | `support@donate.ly` · GitHub issues at <https://github.com/donately/dntly-mcp/issues> |
| Source code | <https://github.com/donately/dntly-mcp> (MIT) |

## Test account

**Not required** — the server is public and unauthenticated. To test:

1. Add custom connector in Claude → URL `https://mcp.donate.ly/mcp` → Connect.
2. Ask Claude: *"Search the Donately docs for how to create a donation."*
3. Verify Claude calls `search_docs` and surfaces the `api/donations` endpoint with parameter list.

## Launch readiness

| Field | Value |
| --- | --- |
| GA date | 2026-04-27 |
| Surfaces tested | Claude.ai (web), Claude Desktop (stdio via `npx -y @donately/mcp`), Cursor (HTTP + stdio), Anthropic MCP Inspector, manual JSON-RPC over `curl` |

## Branding

| Field | Value |
| --- | --- |
| Logo | _to attach: Donately mark — same as used on `donately.com` / dashboards._ |
| Favicon | <https://developer.donately.com/favicon.ico> _(verify URL — generic favicon may need swap to Donately mark before submission)_ |

## Optional: link URIs

None used.

---

## Pre-submission checklist

- [x] Hosted endpoint live and serving valid TLS at `https://mcp.donate.ly/mcp`
- [x] All tools have `title` and explicit `readOnlyHint`
- [x] No PII / health data handled; data flow documented
- [x] Privacy policy URL public and reachable
- [x] Public install instructions live at `developer.donately.com/mcp.html`
- [x] Source published MIT-licensed at `github.com/donately/dntly-mcp`
- [x] `@donately/mcp` published on npm (alternative install path)
- [ ] Logo asset attached in submission form (drop in when filling)

## Likely review timeline

> "Review times vary with queue volume. No expedited track exists; the
> submission form remains open continuously."
> — <https://claude.com/docs/connectors/building/submission>

In practice for similar dev-tool submissions, expect days to a couple weeks.
