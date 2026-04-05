# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (hot reload)
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Start production server (after build)
```

There are no tests configured.

## Architecture

**Next.js 14 App Router** with a single interactive lesson about SHA-256. The primary route is `/[locale]/lessons/sha256-irreversibility`.

### Internationalization

All user-facing strings live in [messages/en.json](messages/en.json) and [messages/th.json](messages/th.json). Components use `useTranslations(namespace)` from `next-intl`. The middleware in [src/middleware.ts](src/middleware.ts) handles locale detection and routing. Supported locales: `th` (default), `en`.

### Content Model

There is no CMS or MDX — lesson content is **hardcoded JSX** in the page component ([src/app/[locale]/lessons/sha256-irreversibility/page.tsx](src/app/[locale]/lessons/sha256-irreversibility/page.tsx)). Adding a new lesson means creating a new route under `[locale]/lessons/` and adding translation keys to both JSON files.

### Component Layers

- **`src/components/layout/`** — SiteHeader, LessonLayout (scroll progress + nav), Footer, LanguageSwitcher
- **`src/components/lesson/`** — LessonHeader, ConceptSection, StepExplainer (numbered timeline)
- **`src/components/crypto/`** — All interactive demos (HashSandbox, AvalancheDemo, ReverseChallenge, OperationsDemo, RoundSteps)
- **`src/components/ui/`** — Reusable primitives: Badge, ProgressBar, CodeBlock, Callout

Most components are client components (`"use client"`). Only the root and locale layouts are server components.

### Crypto Utilities

SHA-256 is implemented using the browser's **WebCrypto API** (`window.crypto.subtle`) — no external crypto library. The wrapper is at [src/lib/crypto/sha256.ts](src/lib/crypto/sha256.ts). Hash diffing (character-by-character comparison for the AvalancheDemo) is in [src/lib/crypto/hashDiff.ts](src/lib/crypto/hashDiff.ts).

### Styling

Tailwind CSS with CSS custom properties for theming defined in [src/app/globals.css](src/app/globals.css). Key custom tokens: `--color-bg`, `--color-orange`, etc. Custom Tailwind config adds `maxWidth.lesson` (72ch) and a `gradient-text` utility. No dark mode currently.

Use `cn()` from `src/lib/utils/cn.ts` (clsx wrapper) for conditional class composition. Component variants use `class-variance-authority`.
