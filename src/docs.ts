/**
 * Loads the Markdown corpus under `docs/` into memory and provides simple
 * keyword search + lookup helpers.
 *
 * The corpus is small (≈53 files, <300KB total), so we eagerly load everything
 * at startup and keep it in memory. No vector index, no fancy ranking — just
 * tokenized term-frequency scoring with a title-hit boost. Good enough for v0;
 * we can layer embeddings on later if recall starts to hurt.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

export type DocCategory = 'api' | 'form' | 'components' | 'integrations';

export interface Doc {
  /** Path relative to docs/, no extension — e.g. "api/donations" */
  path: string;
  category: DocCategory;
  /** Slug within the category — e.g. "donations" */
  slug: string;
  title: string;
  /** Source HTML path inside dntly-developer-hub */
  source: string;
  /** Original HTML anchor on the dev hub page */
  anchor: string;
  /** Markdown body (frontmatter stripped) */
  body: string;
  /** Pre-tokenized lowercase body for cheap searching */
  searchHaystack: string;
}

const __filename = fileURLToPath(import.meta.url);
const SRC_DIR = dirname(__filename);
// `src/docs.ts` and `dist/docs.js` are both one level inside the repo, so
// docs/ is always at `../docs` relative to this file.
const DOCS_ROOT = join(SRC_DIR, '..', 'docs');

const CATEGORIES: DocCategory[] = ['api', 'form', 'components', 'integrations'];

let cache: Doc[] | null = null;

function walkMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

function inferCategory(relPath: string): DocCategory {
  const top = relPath.split('/')[0] as DocCategory;
  if (!CATEGORIES.includes(top)) {
    throw new Error(`Doc at ${relPath} is not under a known category`);
  }
  return top;
}

export function loadDocs(): Doc[] {
  if (cache) return cache;
  const files = walkMarkdown(DOCS_ROOT);
  const docs: Doc[] = files.map((file) => {
    const rel = relative(DOCS_ROOT, file).replace(/\\/g, '/');
    const path = rel.replace(/\.md$/, '');
    const category = inferCategory(rel);
    const slug = path.slice(category.length + 1);
    const raw = readFileSync(file, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as Record<string, string>;
    const body = parsed.content.trim();
    return {
      path,
      category,
      slug,
      title: fm.title ?? slug,
      source: fm.source ?? '',
      anchor: fm.anchor ?? slug,
      body,
      searchHaystack: (fm.title + ' ' + body).toLowerCase(),
    };
  });
  // Stable ordering: category then slug. Makes list output predictable.
  docs.sort((a, b) =>
    a.category === b.category ? a.slug.localeCompare(b.slug) : a.category.localeCompare(b.category)
  );
  cache = docs;
  return docs;
}

export interface SearchResult {
  path: string;
  category: DocCategory;
  title: string;
  source: string;
  anchor: string;
  score: number;
  snippet: string;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9_/]+/)
    .filter((t) => t.length > 1);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count++;
    idx += needle.length;
  }
  return count;
}

function buildSnippet(body: string, tokens: string[], maxLen = 240): string {
  const lower = body.toLowerCase();
  let bestIdx = -1;
  for (const t of tokens) {
    const idx = lower.indexOf(t);
    if (idx !== -1 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx;
  }
  const start = Math.max(0, (bestIdx === -1 ? 0 : bestIdx) - 60);
  const slice = body.slice(start, start + maxLen).replace(/\s+/g, ' ').trim();
  return (start > 0 ? '… ' : '') + slice + (start + maxLen < body.length ? ' …' : '');
}

export interface SearchOptions {
  limit?: number;
  category?: DocCategory;
}

export function searchDocs(query: string, options: SearchOptions = {}): SearchResult[] {
  const { limit = 5, category } = options;
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const docs = loadDocs().filter((d) => !category || d.category === category);

  const scored: SearchResult[] = [];
  for (const doc of docs) {
    let titleScore = 0;
    let bodyScore = 0;
    let matched = 0;
    const titleLower = doc.title.toLowerCase();
    for (const t of tokens) {
      const titleHits = countOccurrences(titleLower, t);
      const bodyHits = countOccurrences(doc.searchHaystack, t) - titleHits;
      const tokenScore = titleHits * 8 + bodyHits;
      if (tokenScore > 0) matched++;
      titleScore += titleHits * 8;
      bodyScore += bodyHits;
    }
    // Require every multi-token query to land at least one hit on each term;
    // single-token queries can still match.
    if (tokens.length > 1 && matched < tokens.length) continue;
    const total = titleScore + bodyScore;
    if (total === 0) continue;

    // Normalize body hits by sqrt(body length / 1KB) so an integration doc
    // 10x longer than an API resource page doesn't automatically outrank it
    // for a generic term. Title hits are not normalized — they're high-signal.
    const bodyKb = Math.max(1, doc.body.length / 1000);
    const score = titleScore + bodyScore / Math.sqrt(bodyKb);

    scored.push({
      path: doc.path,
      category: doc.category,
      title: doc.title,
      source: doc.source,
      anchor: doc.anchor,
      score: Math.round(score * 10) / 10,
      snippet: buildSnippet(doc.body, tokens),
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export function getDoc(path: string): Doc | null {
  const normalized = path.replace(/^\/+|\/+$/g, '').replace(/\.md$/, '');
  return loadDocs().find((d) => d.path === normalized) ?? null;
}

export function listDocs(category?: DocCategory): Pick<Doc, 'path' | 'category' | 'title'>[] {
  return loadDocs()
    .filter((d) => !category || d.category === category)
    .map((d) => ({ path: d.path, category: d.category, title: d.title }));
}
