/**
 * One-off converter: dntly-developer-hub HTML pages → Markdown chunks.
 *
 * Each `<div class="doc-section" id="X">` becomes a single Markdown file at
 * `docs/<section>/<id>.md` with frontmatter holding the source path, title, and
 * anchor. The output is the source-of-truth for the MCP server.
 *
 * Run: pnpm convert-docs   (or)   npm run convert-docs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
// @ts-expect-error - no types published for this plugin
import { gfm } from '@joplin/turndown-plugin-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const HUB_ROOT = resolve(REPO_ROOT, '../../dntly-developer-hub/git-repo');
const DOCS_OUT = join(REPO_ROOT, 'docs');

type SourceFile = {
  /** Path relative to HUB_ROOT */
  htmlPath: string;
  /** Output subdirectory under docs/ */
  outDir: string;
  /** Optional override: if the page is single-section, use this slug */
  singleSectionSlug?: string;
};

const SOURCES: SourceFile[] = [
  { htmlPath: 'api/index.html', outDir: 'api' },
  { htmlPath: 'docs/form.html', outDir: 'form' },
  { htmlPath: 'docs/components.html', outDir: 'components' },
  { htmlPath: 'docs/integrations.html', outDir: 'integrations', singleSectionSlug: 'overview' },
  { htmlPath: 'docs/integrations/stripe.html', outDir: 'integrations', singleSectionSlug: 'stripe' },
  { htmlPath: 'docs/integrations/salesforce.html', outDir: 'integrations', singleSectionSlug: 'salesforce' },
  { htmlPath: 'docs/integrations/hubspot.html', outDir: 'integrations', singleSectionSlug: 'hubspot' },
  { htmlPath: 'docs/integrations/mailchimp.html', outDir: 'integrations', singleSectionSlug: 'mailchimp' },
  { htmlPath: 'docs/integrations/constant-contact.html', outDir: 'integrations', singleSectionSlug: 'constant-contact' },
  { htmlPath: 'docs/integrations/raisers-edge.html', outDir: 'integrations', singleSectionSlug: 'raisers-edge' },
  { htmlPath: 'docs/integrations/slack.html', outDir: 'integrations', singleSectionSlug: 'slack' },
  { htmlPath: 'docs/integrations/virtuous.html', outDir: 'integrations', singleSectionSlug: 'virtuous' },
];

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.use(gfm);

// Preserve language hints on <pre><code class="language-X"> blocks.
turndown.addRule('fencedCodeWithLang', {
  filter: (node) =>
    node.nodeName === 'PRE' && node.firstChild?.nodeName === 'CODE',
  replacement: (_content, node) => {
    const codeEl = (node as HTMLElement).firstChild as HTMLElement;
    const className = codeEl.getAttribute?.('class') ?? '';
    const langMatch = className.match(/language-([\w-]+)/);
    const lang = langMatch?.[1] ?? '';
    const text = codeEl.textContent ?? '';
    return `\n\n\`\`\`${lang}\n${text.replace(/\n+$/, '')}\n\`\`\`\n\n`;
  },
});

// Drop the in-page "Try it" / "Copy" affordance buttons that pepper the hub.
turndown.addRule('stripUiButtons', {
  filter: (node) => {
    if (node.nodeName !== 'BUTTON') return false;
    const cls = (node as HTMLElement).getAttribute?.('class') ?? '';
    return /copy|try-it|toggle/i.test(cls);
  },
  replacement: () => '',
});

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function frontmatter(record: Record<string, string>): string {
  const lines = ['---'];
  for (const [k, v] of Object.entries(record)) {
    lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function convertSection(opts: {
  $: cheerio.CheerioAPI;
  sectionEl: cheerio.Cheerio<any>;
  slug: string;
  source: SourceFile;
  outFile: string;
}) {
  const { $, sectionEl, slug, source, outFile } = opts;

  // Prefer the page's <h1> for single-section pages (integration sub-pages
  // wrap their whole body and have one top-level h1), otherwise fall back to
  // the section's first <h2>.
  const h1 = sectionEl.find('h1').first();
  const h2 = sectionEl.find('h2').first();
  const title = (h1.text().trim() || h2.text().trim()) || slug;

  const html = $.html(sectionEl);
  let md = turndown.turndown(html).trim();

  // Collapse runs of blank lines and trailing whitespace.
  md = md.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+$/gm, '');

  const fm = frontmatter({
    title: title || slug,
    source: source.htmlPath,
    anchor: slug,
  });

  writeFileSync(outFile, fm + md + '\n');
}

function convertFile(source: SourceFile) {
  const fullPath = join(HUB_ROOT, source.htmlPath);
  if (!existsSync(fullPath)) {
    console.warn(`! skipping ${source.htmlPath} — not found`);
    return 0;
  }

  const html = readFileSync(fullPath, 'utf8');
  const $ = cheerio.load(html);

  // Strip elements we never want in MD output.
  $('script, style, nav, header, footer, .header, .sidebar, .breadcrumb, .version-select, .copy-btn, .badge').remove();

  // Endpoint headers are <div class="endpoint-header"> with method/path/desc
  // spans. Promote each to an <h3> so the MD has a proper heading per endpoint.
  $('.endpoint-header').each((_i, el) => {
    const header = $(el);
    const method = header.find('.method-badge').text().trim();
    const path = header.find('.endpoint-path').text().trim();
    const desc = header.find('.endpoint-desc').text().trim();
    const heading = `${method} ${path}${desc ? ` — ${desc}` : ''}`.trim();
    header.replaceWith(`<h3>${heading}</h3>`);
  });

  // Annotate version-specific response blocks so MD readers can tell them apart.
  $('.v2022-only').each((_i, el) => {
    $(el).prepend('<p><strong>v2022-12-15 response:</strong></p>');
  });
  $('.v2019-only').each((_i, el) => {
    $(el).prepend('<p><strong>v2019-03-15 response:</strong></p>');
  });

  // Default unlabeled <pre><code> blocks that look like JSON to language=json.
  $('pre code').each((_i, el) => {
    const code = $(el);
    if (code.attr('class')) return;
    const text = (code.text() || '').trim();
    if (text.startsWith('{') || text.startsWith('[')) {
      code.attr('class', 'language-json');
    }
  });

  const outDir = join(DOCS_OUT, source.outDir);
  ensureDir(outDir);

  let count = 0;

  if (source.singleSectionSlug) {
    // The integrations subpages don't use .doc-section — convert the main
    // content area instead.
    const main = $('.content').first().length ? $('.content').first() : $('body');
    const outFile = join(outDir, `${source.singleSectionSlug}.md`);
    convertSection({
      $,
      sectionEl: main,
      slug: source.singleSectionSlug,
      source,
      outFile,
    });
    count = 1;
  } else {
    $('.doc-section').each((_i, el) => {
      const sectionEl = $(el);
      const id = sectionEl.attr('id');
      if (!id) return;
      const slug = slugifyHeading(id);
      const outFile = join(outDir, `${slug}.md`);
      convertSection({ $, sectionEl, slug, source, outFile });
      count++;
    });
  }

  console.log(`✓ ${source.htmlPath} → ${count} file(s) in docs/${source.outDir}/`);
  return count;
}

function main() {
  ensureDir(DOCS_OUT);
  let total = 0;
  for (const src of SOURCES) total += convertFile(src);
  console.log(`\nDone. ${total} markdown file(s) generated under ${DOCS_OUT}.`);
}

main();
