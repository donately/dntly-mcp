# Announcement drafts — dntly-mcp v0.1 launch

Held drafts for distribution channels we haven't fired yet. Not user docs;
these don't ship to the MCP server (they live outside `docs/`).

## Slack — internal (#general or #engineering)

Casual, team-wide, includes the why.

> 🤖 Donately just shipped an MCP server.
>
> What it is: a Model Context Protocol server that wraps the developer hub. Plug it into Claude / Cursor / any MCP-aware AI assistant and the assistant can search Donately's API docs, form embed recipes, and integration guides without us pasting URLs.
>
> Two ways to use it:
> • Hosted: `https://mcp.donate.ly/mcp` — point your client at the URL, no install
> • Local: `npx -y @donately/mcp` — for clients that only do stdio (Claude Desktop today)
>
> Why we built it: every API platform that matters now ships one (Stripe, Vercel, Neon, Supabase, Prisma). Devs integrating with Donately should get accurate code from their AI assistant by default. Cheap to run, almost free to keep current.
>
> Next up: a customer-data MCP in July with OAuth scopes — letting NPO admins ask Claude/ChatGPT things like "how did last month's campaign do?" or "refund donation X."
>
> Install instructions + tool list: https://developer.donately.com/mcp.html
> Source: https://github.com/donately/dntly-mcp

## X / Twitter

Tight, quotable. Two-tweet thread option.

**Tweet 1**

> Donately is now on MCP.
>
> Connect Claude, Cursor, or any AI assistant to our developer docs:
>
> 🌐 `https://mcp.donate.ly/mcp` (hosted)
> 📦 `npx -y @donately/mcp` (local)
>
> Your AI now writes Donately integrations with the actual API reference in front of it.
>
> developer.donately.com/mcp.html

**Tweet 2 (optional reply)**

> First of two: this one is read-only, public docs.
>
> Coming July: OAuth-scoped MCP that lets nonprofits ask Claude things like "how did last month's campaign do?" or "refund donation X" against their own Donately account.
