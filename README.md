# dntly-mcp

Donately's Model Context Protocol (MCP) server. Wraps the Donately public
developer documentation as a toolset that AI assistants (Claude, Cursor, etc.)
can call when their users are integrating Donately.

This is the first of two planned MCP surfaces:

1. **Dev-docs MCP** (this repo, in progress) — read-only access to API
   reference, embeddable form docs, components docs, and integration guides.
   No auth; published openly.
2. **Customer-data MCP** (planned, July 2026) — OAuth-scoped access to a
   nonprofit's own Donately account (donations, donors, campaigns, etc.).
   Lives in this repo too, behind a separate transport.

## Repository layout

```
docs/                 Markdown source-of-truth, organized by surface
  api/                /v2 REST API reference (one file per resource)
  form/               dntly-form embeddable donation form
  components/         dntly-components data-attribute UI library
  integrations/       Per-integration guides (Stripe, Salesforce, …)
src/                  MCP server (TypeScript) — to be written
scripts/
  convert-html-docs.ts  One-off: dntly-developer-hub HTML → docs/*.md
```

## Doc Markdown format

Every file has YAML frontmatter:

```yaml
---
title: "Donations"
source: "api/index.html"
anchor: "donations"
---
```

- `title` — human-readable section title
- `source` — path inside `dntly-developer-hub` that this MD was generated from
- `anchor` — the original HTML `id`, used for deep-linking back to the hub

The body is GitHub-flavored Markdown. API parameter tables are rendered as GFM
tables; version-specific responses (v2019-03-15 vs v2022-12-15) are labeled
inline.

## Updating the docs

The dev hub (`~/Sites/dntly-developer-hub/git-repo`) remains the public-facing
doc site. To regenerate `docs/` after the hub changes:

```bash
npm install
npm run convert-docs
```

Long-term, the goal is to flip the source-of-truth: edit Markdown here, and
have the hub render from these files. The conversion script is a bootstrap.

## Development

Requires Node 20+.

```bash
npm install
npm run typecheck   # type-check the MCP server
npm run dev         # run the MCP server with auto-reload (once src/ exists)
```

## Status

- [x] Repo skeleton
- [x] Initial doc migration from dntly-developer-hub
- [ ] MCP server (`src/server.ts`) with tools: `search_docs`, `get_endpoint`, `get_integration_guide`, `get_embed_recipe`
- [ ] Hosted deployment (Railway, behind `mcp.donately.com`)
- [ ] `npx @donately/mcp` stdio package for local installs
- [ ] Anthropic MCP directory submission

See the platform roadmap for the full plan and how this fits with the
customer-data MCP follow-up.
