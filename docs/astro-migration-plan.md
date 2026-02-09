# Astro + TypeScript Migration Plan

## Objective
- Move from Jekyll to Astro while keeping markdown content and legacy URL compatibility.

## Current Status (2026-02-09)
- Astro baseline files created.
- Content collection configured with TypeScript schema.
- `_pages/*.md` migrated to `src/content/posts` (excluding category `index.md`).
- Static assets copied to `public/assets`.

## Directory Mapping
- `_pages/**` -> `src/content/posts/**`
- `_layouts`, `_includes` -> `src/layouts`, `src/components`
- `assets/**` -> `public/assets/**`
- `_config.yml` site metadata -> `src/config/site.ts`

## Commands
- `npm install`
- `npm run migrate:pages`
- `npm run migrate:assets`
- `npm run dev`
- `npm run build`

## Route Strategy
- New route file: `src/pages/[...slug].astro`
- Goal: Keep legacy path convention `/:path.html`
- Legacy URL is stored in content front matter as `legacy_url`.

## Next Tasks
1. Rebuild sidebar/category tree using Astro components.
2. Rebuild pagination/search logic with typed post index.
3. Port post view features (TOC, related posts, code highlight, giscus).
4. Add redirects for any edge-case URL drift.
5. Validate visual parity and run Lighthouse/perf checks.
