# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Project

This is a personal digital garden (Aidan's Notes) built on [Quartz v4](https://quartz.jzhao.xyz/), a static site generator for Obsidian vaults. The site is published as a website from Markdown notes stored in the `content/` directory (a git submodule pointing to a private vault at `https://github.com/aidanmonfort/vault.git`).

## Commands

```bash
# Install dependencies
npm ci

# Build the site (outputs to public/)
npx quartz build

# Build and serve locally with hot reload
npx quartz build --serve

# Type check and formatting check
npm run check

# Auto-format code
npm run format

# Run tests
npm test

# Run a single test file
npx tsx --test quartz/util/path.test.ts

# Build docs site locally
npm run docs

# Sync content submodule to latest
git submodule update --remote content
```

## Architecture

The build pipeline processes content through three plugin stages, defined in `quartz/plugins/types.ts`:

1. **Transformers** (`quartz/plugins/transformers/`) — Operate on individual files via unified/remark/rehype plugins. They parse Markdown, apply syntax highlighting, resolve links, render LaTeX, etc.
2. **Filters** (`quartz/plugins/filters/`) — Decide which processed files to publish (e.g., `RemoveDrafts` excludes files with `draft: true` frontmatter).
3. **Emitters** (`quartz/plugins/emitters/`) — Take all processed content and emit HTML files, assets, sitemaps, RSS feeds, OG images, etc.

The build orchestrator is `quartz/build.ts`, which calls `processors/parse.ts` → `processors/filter.ts` → `processors/emit.ts`.

### Configuration

- **`quartz.config.ts`** — Global config (site title, base URL, theme colors, analytics, ignore patterns) and the plugin pipeline.
- **`quartz.layout.ts`** — Page layout composition using components from `quartz/components/`. Defines `sharedPageComponents`, `defaultContentPageLayout`, and `defaultListPageLayout`.

### Components

Components in `quartz/components/` are Preact TSX files. They receive a `QuartzComponent` interface and can define associated CSS (`css` property) and client-side scripts. The layout files assemble these components into page regions (left sidebar, right sidebar, beforeBody, etc.).

### Content

- `content/` — Git submodule of the Obsidian vault (`aidanmonfort/vault`). Automatically synced every 2 days via GitHub Actions (`.github/workflows/sync-notes.yaml`).
- Files matching `private`, `templates`, `Templates`, `.obsidian` glob patterns are ignored during build.

### Deployment

The site deploys to Cloudflare Pages. The GitHub Actions workflow (`.github/workflows/deploy-preview.yaml`) handles preview deployments on PRs.

### Testing

Tests use Node's built-in `tsx --test` runner. Test files follow the `*.test.ts` pattern (e.g., `quartz/util/path.test.ts`, `quartz/util/fileTrie.test.ts`).
