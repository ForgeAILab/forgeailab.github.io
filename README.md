# forge-site

Promotional website for [Forge](https://github.com/mai1015/forge) — the local-first workflow engine for coding agents.

## Stack

Vite + React 18 + TypeScript + Tailwind CSS v4.

## Dev

```bash
pnpm install      # or: npm install
pnpm dev          # http://localhost:5173
pnpm build        # production build -> dist/
pnpm preview      # preview the production build
```

## Structure

```
src/
  App.tsx          # page composition
  components/
    Nav.tsx
    Hero.tsx
    Features.tsx
    Lifecycle.tsx  # animated task-lifecycle visualization
    Quickstart.tsx
    Footer.tsx
public/
  logo.png
  forge-wordmark.png
  demo.mp4
  favicon.png
```

Brand assets are mirrored from the main [forge](https://github.com/mai1015/forge) repo's `assets/` directory.
