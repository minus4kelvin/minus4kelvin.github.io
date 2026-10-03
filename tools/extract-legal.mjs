// Ports the generated legal documents from the game repo into Jekyll pages,
// verbatim, so no legal text is retyped by hand.
//
//   node tools/extract-legal.mjs
//
// Re-run after regenerating the game's legal docs (npm test in the game repo).
import fs from 'node:fs';
import path from 'node:path';

const GAME = 'C:/Projects/apps/clickthemines/public';
const SITE = 'C:/Projects/apps/minus4kelvin.github.io';

// The contact address is centralised in _config.yml so it is changed in one
// place; {{ site.contact_email }} is substituted back in at Jekyll build time.
const GMAIL = /minus4kelvin@gmail\.com/g;

// The game's own copy links to its sibling pages on the product subdomain. Those
// documents now also live on the entity's own domain, so point the references
// there instead. Applied on every run so a regenerated source cannot reintroduce
// the off-domain link.
const URL_REWRITES = [
  [
    /https:\/\/minesofdoom\.minus4kelvin\.com\/account-deletion\.html/g,
    '{{ site.url }}/account-deletion/mines-of-idle-doomath/',
  ],
  [
    /https:\/\/minesofdoom\.minus4kelvin\.com\/privacy-policy\.html/g,
    '{{ site.url }}/privacy/mines-of-idle-doomath/',
  ],
  [
    /https:\/\/minesofdoom\.minus4kelvin\.com\/terms-of-use\.html/g,
    '{{ site.url }}/terms/mines-of-idle-doomath/',
  ],
];

const applyRewrites = (s) => URL_REWRITES.reduce((acc, [re, to]) => acc.replace(re, to), s);

function body(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!m) throw new Error('no <body>');
  return m[1];
}

// Drop the inline <style> block, the leading <h1>/<p class="meta"> (the Jekyll
// layout renders the title), and the trailing footer nav of duplicated links.
function sections(html) {
  return body(html)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/^\s*<h1[\s\S]*?<\/h1>/i, '')
    .replace(/<p class="meta">[\s\S]*?<\/p>/i, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .trim();
}

function page({ file, permalink, title, layout = 'page' }) {
  const raw = fs.readFileSync(path.join(GAME, file), 'utf8');
  const meta = raw.match(/<p class="meta">([\s\S]*?)<\/p>/i);
  let content = applyRewrites(sections(raw)).replace(GMAIL, '{{ site.contact_email }}');

  // Keep the generated version/date line visible on the page.
  if (meta) {
    const m = applyRewrites(meta[1]).replace(GMAIL, '{{ site.contact_email }}');
    content = `<p class="docmeta">${m}</p>\n\n${content}`;
  }

  const out = `---
layout: ${layout}
title: "${title}"
permalink: ${permalink}
---

${content}
`;
  const dest = path.join(SITE, permalink.replace(/^\//, '').replace(/\/$/, '') + '.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ ${path.relative(SITE, dest)}  (${content.length} bytes)`);
}

// Only the account-deletion instructions are mirrored here.
//
// The privacy policy and terms are NOT duplicated onto this domain: each
// product publishes its own on its own site (Mines of Idle Doomath at
// minesofdoom.minus4kelvin.com, Nhom at nhom.app/about/privacy), and a copy
// that can drift from the original is worse than a link to the real thing.
// /privacy/ and /terms/ here link straight out to those.
//
// Account deletion is mirrored because it is a cross-product requirement —
// anyone can be asked to delete data for either product from this domain — and
// the copy only changes when the game's own legal.ts changes.
page({
  file: 'account-deletion.html',
  permalink: '/account-deletion/mines-of-idle-doomath/',
  title: 'Account Deletion — Mines of Idle Doomath',
});