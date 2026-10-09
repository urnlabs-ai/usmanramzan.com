import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);
}
const pages = new Map();
for (const file of files(root).filter((file) => file.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: expected one H1`);
  assert(!/eprecisio|unifonic|emumba/i.test(html), `${file}: employer identity leaked`);
  assert(/rel="canonical" href="https:\/\/usmanramzan.com\//.test(html), `${file}: canonical missing`);
  assert(html.includes('name="description"'), `${file}: description missing`);
  assert(html.includes(file.endsWith('/404.html') ? 'noindex, follow' : 'index, follow'), `${file}: robots missing`);
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  if (file.includes('/writing/') && dirname(file) !== join(root, 'writing')) {
    const article = schemas.find((schema) => schema['@type'] === 'BlogPosting');
    assert(article?.headline && article.author?.name && article.datePublished, `${file}: article schema missing`);
    assert(new Date(article.dateModified) >= new Date(article.datePublished), `${file}: invalid modification date`);
    assert(existsSync(join(root, new URL(article.image).pathname)), `${file}: social image missing`);
  }
  pages.set(file, { html, ids });
}
let links = 0;
for (const [file, { html }] of pages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) continue;
    const url = new URL(href, `https://usmanramzan.com/${file.slice(root.length + 1)}`);
    let target = join(root, decodeURIComponent(url.pathname));
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target) && !target.split('/').pop().includes('.')) target = join(target, 'index.html');
    assert(existsSync(target), `${file}: broken link ${href}`);
    if (url.hash && pages.has(target)) assert(pages.get(target).ids.has(decodeURIComponent(url.hash.slice(1))), `${file}: missing anchor ${href}`);
    links++;
  }
}
assert(!readFileSync(join(root, 'sitemap-0.xml'), 'utf8').includes('/404/'), '404 indexed in sitemap');
assert(readFileSync(join(root, 'rss.xml'), 'utf8').includes('<item>'), 'RSS empty');
assert(!/eprecisio|unifonic|emumba/i.test(readFileSync(join(root, 'llms.txt'), 'utf8')), 'llms.txt identity leaked');
const home = readFileSync(join(root, 'index.html'), 'utf8');
assert(home.includes('B2B SaaS') && home.includes('DevOps') && home.includes('AI-agent'), 'Homepage offer is unclear');
assert(home.includes('urnlabs.com/#organization'), 'URN Labs organization schema missing');
assert(home.includes('Book a 30-min call') && home.includes('/work-with-me/#call-request'), 'Homepage call CTA missing');
assert(home.includes('apple-touch-icon.png'), 'Touch icon missing');
assert(existsSync(join(root, 'apple-touch-icon.png')), 'Touch icon asset missing');
assert(home.includes('image/avif') && home.includes('image/webp'), 'Responsive modern portrait formats missing');
for (const slug of ['aws-to-oci-forty-apps', 'fractional-cto-four-companies']) {
  const html = readFileSync(join(root, 'writing', slug, 'index.html'), 'utf8');
  assert(!html.includes('Updated') && !html.includes('2026-10-09'), `${slug}: layout-only date leaked`);
}
const engagement = readFileSync(join(root, 'work-with-me/index.html'), 'utf8');
assert(engagement.includes('hello@urnlabs.com') && !engagement.includes('gmail.com'), 'Branded contact email missing');
assert(engagement.includes('does not send a message or reserve a calendar slot'), 'Call request behavior must be clear');
for (const [file, { html }] of pages) {
  assert(!/href="\/(?:about|experience|writing|faq|work|work-with-me)"/.test(html), `${file}: noncanonical navigation link`);
}
console.log(`Passed metadata, schema, identity and ${links} internal link checks across ${pages.size} pages.`);
