# VitePress Theme Curve - Agent Guide

## Project Overview
A VitePress blog theme with custom components, Pinia state management, and SCSS styling.

## Quick Commands
- **Dev server**: `pnpm dev` (runs on port 9877)
- **Build**: `pnpm build` (output: `.vitepress/dist`)
- **Preview**: `pnpm preview`
- **Format**: `pnpm format` (Prettier)
- **Lint**: `pnpm lint` (ESLint)

## Architecture
- **Entry point**: `.vitepress/theme/index.mjs` - registers Vue app, Pinia, and plugins
- **Main layout**: `.vitepress/theme/App.vue`
- **Theme config**: `.vitepress/theme/assets/themeConfig.mjs` (default) → override with root `themeConfig.mjs`
- **Content**: `posts/` for blog posts, `pages/` for static pages
- **Components**: `.vitepress/theme/components/` (auto-imported)
- **Styles**: `.vitepress/theme/style/` (SCSS)

## Key Customizations
1. **Override config**: Create `themeConfig.mjs` in project root (do NOT modify default config)
2. **Site metadata**: title, description, author, social links
3. **Navigation**: `nav` and `navMore` arrays in config
4. **Features**: Toggle comment, music, search, PWA, weather in config

## Development Notes
- **Port**: Dev server hardcoded to 9877 in `.vitepress/config.mjs`
- **Registry**: Uses npmmirror registry (configured in `.npmrc`)
- **Auto-imports**: Vue and VitePress APIs auto-imported (see `.vitepress/auto-imports.d.ts`)
- **Components**: Auto-registered from `.vitepress/theme/components/` and `views/`
- **Path alias**: `@` maps to `.vitepress/theme/`

## Build & Deploy
- **CI**: GitHub Actions workflow in `.github/workflows/deploy.yml`
- **Output**: Static files in `.vitepress/dist`
- **Node**: Requires Node.js ≥20, pnpm ≥10

## Common Pitfalls
- Don't rename or delete default `themeConfig.mjs` - only override in root
- Config uses `defu` for deep merge - partial overrides work correctly
- Comments system supports Twikoo or Artalk (configure in `themeConfig.mjs`)
- Weather API requires Amap key or falls back to public API

## File Structure
```
├── .vitepress/
│   ├── config.mjs          # VitePress config
│   ├── theme/
│   │   ├── index.mjs       # Theme entry
│   │   ├── App.vue         # Root component
│   │   ├── assets/         # Default config
│   │   ├── components/     # Auto-imported components
│   │   ├── style/          # SCSS styles
│   │   └── utils/          # Utility functions
├── posts/                  # Blog posts (markdown)
├── pages/                  # Static pages
├── public/                 # Static assets
└── themeConfig.mjs         # User config override (create this)
```