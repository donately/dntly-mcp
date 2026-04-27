# @donately/mcp

Donately's Model Context Protocol (MCP) server. Wraps the Donately public
developer documentation as a toolset that AI assistants (Claude, Cursor, etc.)
can call when their users are integrating Donately.

This is the first of two planned MCP surfaces:

1. **Dev-docs MCP** (this package) — read-only access to API reference,
   embeddable form docs, components docs, and integration guides. No auth;
   published openly.
2. **Customer-data MCP** (planned, July 2026) — OAuth-scoped access to a
   nonprofit's own Donately account (donations, donors, campaigns, etc.).
   Will live in this repo too, behind a separate transport.

## Connecting it to your AI assistant

### Option A: Hosted endpoint (recommended)

Point your client at the public Streamable HTTP endpoint:

```
https://mcp.donate.ly/mcp
```

For Claude Desktop / Cursor / any MCP-aware client, add it as an HTTP MCP
server. No install, no auth, no configuration.

### Option B: Local install via npx (stdio)

Useful for clients that only support stdio transport, or when you want to run
the server entirely locally:

```jsonc
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
{
  "mcpServers": {
    "donately": {
      "command": "npx",
      "args": ["-y", "@donately/mcp"]
    }
  }
}
```

The package ships with the doc corpus baked in, so no network calls are made
when you query it.

## Tools exposed

- `search_docs(query, limit?, category?)` — keyword search across the corpus
- `get_doc(path)` — full Markdown body of a specific doc
- `list_docs(category?)` — enumerate available docs

`category` is one of `api`, `form`, `components`, `integrations`.

## Repository layout

```
docs/                Markdown source-of-truth, organized by surface
  api/               /v2 REST API reference (one file per resource)
  form/              dntly-form embeddable donation form
  components/        dntly-components data-attribute UI library
  integrations/      Per-integration guides (Stripe, Salesforce, …)
src/
  mcp.ts             createServer() factory; tool definitions
  server.ts          stdio entrypoint (bin)
  server-http.ts     Streamable HTTP entrypoint (Railway)
  docs.ts            doc loader + in-memory keyword search
scripts/
  convert-html-docs.ts  One-off: dntly-developer-hub HTML → docs/*.md
```

## Updating the docs

The dev hub (`~/Sites/dntly-developer-hub/git-repo`) is currently the
public-facing doc site. To regenerate `docs/` from it:

```bash
npm install
npm run convert-docs
```

Long-term, the goal is to flip the source-of-truth: edit Markdown here, and
have the hub render from these files. The conversion script is the bootstrap.

## Development

Requires Node 20+.

```bash
npm install
npm run typecheck      # type-check
npm run dev            # HTTP entrypoint, auto-reload
npm run dev:stdio      # stdio entrypoint, auto-reload
npm run build          # tsc → dist/, chmods bin
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

## License

MIT
