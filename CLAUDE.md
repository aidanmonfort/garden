# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A customized [Quartz v5](https://quartz.jzhao.xyz/) static site generator for a personal digital garden at `aidanmonfort.github.io/garden`. Content is written in Obsidian and published as a website.

## Common Commands

```bash
#plugin restore
npx quartz plugin restore

#plugin resolve
npx quartz plugin resolve

# Development server (watch mode)
npx quartz build --serve

# Production build
npx quartz build

# Build docs site
npm run docs

# Type check + format check
npm run check

# Auto-format
npm run format

# Run tests
npm run test

# Install/update plugins
npm run install-plugins
```

Requires Node >= 22 and npm >= 10.9.2.

## Working Files
Edits will not be made to anything in the .quartz/ or content/ directories. The first directory is where the plugins exist and so they do will not be changed. The second is the content in my obsidian notebook, changing these files can cause issues in Obsidian. 

## Architecture Overview

The build pipeline flows: **parse → filter → emit**
- `quartz/processors/parse.ts` — remark/rehype markdown pipeline
- `quartz/processors/filter.ts` — decides which files get published
- `quartz/processors/emit.ts` — generates output HTML/assets

### Configuration

All site config lives in `quartz.config.yaml` (YAML-based, not the older `quartz.config.ts`). This declares:
- Site metadata and theme
- Which plugins to load (transformers, filters, emitters, components)
- Page layouts per page type (content, folder, tag, 404)

The entry point `quartz.ts` loads config/layout and registers custom components (e.g. `VideoCardsView` with id `"cards"`).

### Plugin System (`quartz/plugins/`)

Four plugin types:
- **Transformers** — modify markdown/HTML during parsing (e.g. syntax highlighting, wikilinks, LaTeX)
- **Filters** — decide what content to publish (e.g. remove drafts)
- **Emitters** — generate output files (HTML pages, search index, RSS, OG images)
- **PageTypes** — handle different file types (`.md`, `.canvas`, `.base`)

Plugins are loaded dynamically via `quartz/plugins/loader/`. Supports local plugins and `github:` URL-sourced plugins.

### Components (`quartz/components/`)

Preact/TSX components for UI. Key pieces:
- **Frames** — page layout wrappers: `DefaultFrame`, `MinimalFrame`, `FullWidthFrame`
- **`VideoCardsView.tsx`** — custom card grid for Bases entries (registered as `"cards"` view)
- `renderPage.tsx` — server-side renders all page types

### Content (`content/`)

Obsidian vault. Key files:
- `Videos.base` — structured database file for the video collection
- `quartz.config.yaml` controls what gets published (drafts excluded via `RemoveDrafts` filter)

## Custom Additions in This Fork

- `VideoCardsView.tsx` — card grid component for Bases page type with configurable image/sizing
- YAML-based config instead of TypeScript config
- Plausible analytics, Giscus comments, CNAME for custom domain
- `sync-notes.yaml` GitHub Action to sync Obsidian content
