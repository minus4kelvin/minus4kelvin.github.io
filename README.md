# minus4kelvin.com

Jekyll source for the website of **−4 Kelvin LLC** (Nhom · Mines of Idle Doomath).
Deployed to GitHub Pages via the `CNAME` file; Cloudflare proxies `minus4kelvin.com`.

This site exists to satisfy the Apple Developer Program enrollment requirement:

> Your organization's website must be publicly available and functional, and its
> domain name must be associated with your organization.

`CNAME` points at `minus4kelvin.com`. Do **not** submit `minus4kelvin.github.io` —
the registrable domain of that host is `github.io`, which belongs to GitHub, so it
can never satisfy the requirement.

## Build

```bash
bundle install
bundle exec jekyll serve      # http://127.0.0.1:4000
bundle exec jekyll build      # -> _site/
```

> **Ruby 3.3+ note.** The pinned Jekyll 4.1.1 predates Ruby 3.3 and crashes on
> `bundle exec jekyll build` with
> `undefined method '[]' for nil` in `jekyll/log_adapter.rb` — Ruby 3.3's `Logger`
> reads `@level_override[Fiber.current]`, which 4.1.1 does not expect. It does not
> affect GitHub Pages, which builds with its own Jekyll. To build locally on Ruby
> 3.3, either upgrade the pin to `jekyll ~> 4.3` or build under Ruby 2.7/3.1.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Studio homepage — identity, both products, entity summary |
| `/products/` | Catalogue with per-product detail |
| `/about/` | About the studio |
| `/contact/` | **Contact & legal information** — the page enrollment review checks |
| `/support/` | Support hub, per-product help routes |
| `/privacy/` | Index — links to each product&rsquo;s own published policy |
| `/terms/` | Entity-level terms of use (also covering Nhom) + link to the game&rsquo;s own |
| `/account-deletion/` | Deletion routes per product |
| `/account-deletion/mines-of-idle-doomath/` | Mirrored from the game&rsquo;s own page |
| `/legal` | Compatibility hub for older links |
| `/minesofdoom/privacy` · `/minesofdoom/terms` | Legacy paths, now point at the game&rsquo;s live policies |

## Configuration

Everything an owner needs to change lives in `_config.yml`:

```yaml
contact_email: kelvin@minus4kelvin.com   # MUST be on the entity's own domain
entity:
  name: "−4 Kelvin LLC"
  type: "Limited Liability Company (LLC)"
  jurisdiction: "Texas, United States"
```

The entity block is deliberately short: Apple's website rule has no field list,
so it only needs enough to show that `minus4kelvin.com` belongs to
**−4 Kelvin LLC** — the legal name, the entity type, where it was formed, and a
contact on the matching domain. Filing number, registered street address,
telephone and founding year are not published.

Any `entity` field left empty renders as a visible amber `TODO` marker rather
than a blank cell, so an unfinished field cannot ship unnoticed. Fill them in
`_config.yml` — not in the page templates.

**No D‑U‑N‑S number is published.** Apple collects it on the enrollment form and
cross-checks it against Dun & Bradstreet; it is not a website requirement. The
website rule is only that the site is publicly available, functional, and on the
entity's own domain — there is no field list to satisfy.

**One contact address.** `kelvin@minus4kelvin.com` handles support, data
deletion, press and security. Cloudflare Email Routing is already live for the
domain (MX → `route*.mx.cloudflare.net`, SPF → `include:_spf.mx.cloudflare.net`).
To split these into separate mailboxes, add keys to `_config.yml` and reference
them from the templates.

## Legal documents

**Product policies are not duplicated here.** Each product publishes its own, and
those copies stay accurate as the product changes; this site links straight out
rather than keeping a second copy that can drift.

| Product | Own policy |
| --- | --- |
| Mines of Idle Doomath | `minesofdoom.minus4kelvin.com/privacy-policy.html` · `/terms-of-use.html` · `/account-deletion.html` |
| Nhom | `nhom.app/about/privacy` |

The one exception is the **account-deletion instructions**, which are mirrored
here because deletion is a cross-product requirement — anyone can be asked to
delete data for either product from this domain. That page is **generated**, not
hand-maintained:

```bash
node tools/extract-legal.mjs
```

It copies `../clickthemines/public/account-deletion.html` verbatim, replacing the
hardcoded contact address with `{{ site.contact_email }}` so it is defined in
exactly one place.

Re-run after regenerating the game's docs:

```bash
cd ../clickthemines && pnpm test   # regenerates from src/mines_of_doom/legal.ts
cd ../minus4kelvin.github.io && node tools/extract-legal.mjs
```

### Contact address

The address is `LEGAL_CONTACT_EMAIL` in `../clickthemines/src/mines_of_doom/legal.ts`.
Apple requires that a work email address be associated with the organization's
domain, so it must **not** be a `gmail.com` address. Update `_config.yml` and
`legal.ts` together so the site and the in-app documents agree.

## ⚠ Outstanding before resubmitting

- [x] Domain email live — `kelvin@minus4kelvin.com`
- [x] Entity block complete: **−4 Kelvin LLC**, LLC, formed in Texas, USA
- [x] Both products surfaced on the site with live screenshots
- [x] Reverse footer link to `minus4kelvin.com` added to the game
      (`clickthemines`: `siteContent.ts` → `SITE_PUBLISHER`, rendered in
      `+html.tsx` and in the footer of every `public/*.html` page)
- [ ] Add the same reverse footer link to **`nhom.app`**
- [ ] **Nhom publishes no terms of use.** It has `/about/privacy` but no terms
      page (checked: `/terms`, `/about/terms`, `/about/terms-of-use` all 404).
      `/terms/` currently covers Nhom at the entity level. A product-specific
      terms page should be published on `nhom.app` — Nhom has messaging,
      user-generated content and a dating category marked 18+, so guideline 1.2
      will want moderation and reporting rules documented.
- [ ] Make sure the LLC filing is current, and have the D‑U‑N‑S number on hand
      for the **enrollment form** (it is not needed on the site)

## ⚠ Separate issue: the app has no real icon

`../clickthemines/app-icons/icon.png` and `adaptive-icon.png` are both the **Expo
placeholder grid**, not artwork, and `logo.jpg` still reads **“MINES OF DOOM”**
while the product is **“Mines of Idle Doomath”** (`app.config.ts:32`).

This does not affect this website, but it will fail App Store submission
validation, which requires a real 1024×1024 icon.

**The fix already exists.** `minus4kelvin-branding/dist/appicon/icon-1024.png` is
described in that repo's README as *"fully opaque, square, and has no alpha
channel — exactly what Xcode requires"*, and `dist/android/mipmap-*/` has the
matching adaptive foreground/background/monochrome layers. Copying those into
`clickthemines/app-icons/` and `android/app/src/main/res/` replaces the
placeholders with the real identity. Not done here — it changes the app build.

## Brand

All marks, icons and the social card come from **`C:/Projects/minus4kelvin-branding`**
(the "Nothingness" system). That repo is the source of truth — SVGs there are the
origin, PNGs are rasterised from them. **Regenerate there, then re-copy**; never
edit an asset in this repo.

The system is monochrome by construction: `bone` is the only ink, on true black,
and hierarchy comes from a white→grey luminance ramp. The rule is *never introduce
hue* — if something needs to stand out, move it up the ramp. `assets/main.css`
declares the eight tokens from `rn/src/tokens.ts` as CSS custom properties and
uses nothing else.

| Token | Hex | Used for |
| --- | --- | --- |
| `void` | `#000000` | page ground, `theme-color` |
| `abyss` | `#08080A` | raised surfaces, cards |
| `ink` | `#101015` | panels, media wells, chips |
| `ash` | `#1E1E24` | borders, dividers |
| `dim` | `#4A4A52` | muted marks, the `TODO` chip |
| `mid` | `#8A8A94` | secondary type |
| `bone` | `#F5F5F0` | **the ink** — primary type |
| `white` | `#FFFFFF` | accent, primary headings |

Also taken from the brand repo: `field-subtle-512.png` as the hero background
texture, and the header uses the **horizontal lockup** — the corona *is* the
minus, so the logo alone reads `−4 KELVIN` and no text is set beside it.

## Assets

| File | Source in `minus4kelvin-branding` |
| --- | --- |
| `assets/brand/logo-horizontal{,@2x,@3x}.png` | `dist/rn/` — header lockup (bone on transparent) |
| `assets/brand/mark-large{,@2x,@3x}.png` | `dist/rn/` |
| `assets/brand/field-subtle-512.png` | `dist/patterns/` — hero texture |
| `assets/social/og-1200x630.png` | `dist/social/` — `og:image` |
| `favicon/icon.svg` | `dist/favicon/` |
| `assets/favicon/favicon-*.png` | `dist/favicon/` — 16/32/48/96/128 |
| `assets/apple-touch-icon.png` | `dist/favicon/` |
| `assets/android-chrome-{192,512}.png`, `assets/msapplication-icon-144.png` | `dist/favicon/` |
| `assets/img/nhom-app.png` | live capture of `nhom.app`, downscaled to 1200px |
| `assets/img/nhom-logo.png` | Nhom wordmark, cropped from that capture |
| `assets/img/mines-main.png` | `clickthemines/screenshots/main.png` |
| `assets/img/mines-shop.png` | `clickthemines/screenshots/shop.png` (currently unused) |

**Careful:** in `dist/rn/`, `logo-horizontal.png` is the **bone** mark and
`logo-horizontal-inverted.png` is the **dark** mark. The site ground is true
black, so it needs the plain one — the inverted file renders black-on-black and
disappears. The same applies to `mark-large` / `mark-large-inverted`.

## Changes from the previous site

The old site was a single `<h1>-4 Kelvin</h1>` on a black page.

- `index.markdown` and `_layouts/splash.html` deleted — replaced by `index.html`
  and the shared `default` layout. Keeping both would have collided on `/`.
- `assets/main.css` fully replaced (the old file was a GitHub Pages template).
- `_layouts/default.html` replaced with a full site layout (SEO meta, nav, footer).
- `assets/main.css.map` reference dropped along with the old stylesheet.
- `legal.md`, `minesofdoom/*.md` rewritten as pointer pages so old links keep working.
- `Gemfile` / `Gemfile.lock` **untouched**.

## Legal text accuracy

The only text reproduced here is the Mines of Idle Doomath account-deletion
instructions, copied verbatim from the game's own source of truth. Nothing about
Nhom's data handling or community rules has been invented: `/privacy/` links to
Nhom's own published policy, and `/terms/` is entity-level copy that applies to
every product.