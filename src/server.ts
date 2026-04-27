/**
 * dntly-mcp server entrypoint.
 *
 * Exposes the Donately public developer documentation as an MCP toolset.
 * Tools:
 *   - search_docs(query, limit?, category?)   keyword search
 *   - get_doc(path)                            fetch one doc by path
 *   - list_docs(category?)                     list all available docs
 *
 * Transport: stdio (suitable for IDE/Claude Desktop launches). HTTP transport
 * for the hosted `mcp.donately.com` deployment can be added alongside.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { searchDocs, getDoc, listDocs, loadDocs, type Doc } from './docs.js';

const HUB_BASE_URL = 'https://developer.donately.com';

/** Build the canonical dev-hub URL for a given doc, so callers can deep-link. */
function hubUrl(doc: Pick<Doc, 'source' | 'anchor'>): string {
  const path = doc.source.replace(/\.html$/, '.html');
  return `${HUB_BASE_URL}/${path}#${doc.anchor}`;
}

function formatSearchResult(result: ReturnType<typeof searchDocs>[number]): string {
  const url = hubUrl(result);
  return [
    `### ${result.title}`,
    `Path: \`${result.path}\` · Category: \`${result.category}\` · [hub link](${url})`,
    '',
    result.snippet,
  ].join('\n');
}

const server = new McpServer({
  name: 'dntly-mcp',
  version: '0.1.0',
});

server.registerTool(
  'search_docs',
  {
    title: 'Search Donately developer docs',
    description:
      'Keyword search across the Donately developer documentation (API reference, embeddable form, components library, integration guides). Returns the top-ranked matches with title, doc path, and a snippet. Follow up with `get_doc` to read a full match.',
    inputSchema: {
      query: z.string().min(1).describe('Search query, e.g. "create donation" or "stripe statement descriptor"'),
      limit: z.number().int().min(1).max(20).optional().describe('Max results to return (default 5)'),
      category: z
        .enum(['api', 'form', 'components', 'integrations'])
        .optional()
        .describe('Restrict the search to one doc category'),
    },
  },
  async ({ query, limit, category }) => {
    const results = searchDocs(query, { limit, category });
    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No matches for "${query}"${category ? ` in category "${category}"` : ''}.`,
          },
        ],
      };
    }
    const body =
      `Found ${results.length} match${results.length === 1 ? '' : 'es'} for "${query}":\n\n` +
      results.map(formatSearchResult).join('\n\n---\n\n');
    return { content: [{ type: 'text', text: body }] };
  }
);

server.registerTool(
  'get_doc',
  {
    title: 'Get a Donately developer doc',
    description:
      'Fetch the full Markdown body of a Donately developer doc by path. Paths look like `api/donations`, `form/embedding`, `components/campaign-list`, `integrations/stripe`. Use `search_docs` or `list_docs` to discover paths.',
    inputSchema: {
      path: z.string().min(1).describe('Doc path, e.g. "api/donations" (no leading slash, no .md extension)'),
    },
  },
  async ({ path }) => {
    const doc = getDoc(path);
    if (!doc) {
      return {
        content: [
          {
            type: 'text',
            text: `No doc at "${path}". Try \`list_docs\` to see available paths.`,
          },
        ],
      };
    }
    const url = hubUrl(doc);
    const header = `# ${doc.title}\n\nCategory: \`${doc.category}\` · Path: \`${doc.path}\` · [hub link](${url})\n\n---\n\n`;
    return { content: [{ type: 'text', text: header + doc.body }] };
  }
);

server.registerTool(
  'list_docs',
  {
    title: 'List Donately developer docs',
    description:
      'List every available Donately developer doc, optionally filtered by category. Use the returned paths with `get_doc`.',
    inputSchema: {
      category: z
        .enum(['api', 'form', 'components', 'integrations'])
        .optional()
        .describe('Restrict to a single category (api, form, components, integrations)'),
    },
  },
  async ({ category }) => {
    const docs = listDocs(category);
    const grouped = new Map<string, typeof docs>();
    for (const d of docs) {
      const arr = grouped.get(d.category) ?? [];
      arr.push(d);
      grouped.set(d.category, arr);
    }
    const sections: string[] = [];
    for (const [cat, items] of grouped) {
      sections.push(
        `## ${cat} (${items.length})\n\n` +
          items.map((d) => `- \`${d.path}\` — ${d.title}`).join('\n')
      );
    }
    return {
      content: [
        {
          type: 'text',
          text:
            sections.length === 0
              ? `No docs found${category ? ` in category "${category}"` : ''}.`
              : sections.join('\n\n'),
        },
      ],
    };
  }
);

async function main() {
  // Touch the doc cache so any frontmatter/parse errors surface at boot, not
  // on the first tool call.
  const docs = loadDocs();
  // stderr only — stdout is reserved for the JSON-RPC channel.
  console.error(`[dntly-mcp] loaded ${docs.length} docs`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('[dntly-mcp] fatal:', err);
  process.exit(1);
});
