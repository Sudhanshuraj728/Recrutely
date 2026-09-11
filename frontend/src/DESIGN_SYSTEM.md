# CareerCraft Frontend Design System

## Theme
- Background: near-black layered surfaces using `--color-bg`, `--color-bg-secondary`, and `--color-bg-elevated`
- Accent system: refined blue/indigo (`--color-primary`) with restrained violet (`--color-secondary`)
- Semantic colors: success, warning, danger, info with soft background variants

## Typography
- Primary font: Inter
- Scale tokens: `--text-display`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-body`, `--text-small`, `--text-caption`
- Weights and tracking are tokenized in `src/styles/tokens.css`

## Spacing And Layout
- 4px spacing scale: `--space-1` to `--space-9`
- Container widths: `--container-sm` to `--container-xl`
- Component spacing follows the same token scale to keep rhythm consistent

## Radius And Shadows
- Radius: `--radius-1` to `--radius-5` and `--radius-pill`
- Elevation: `--shadow-subtle`, `--shadow-elevated`, `--shadow-floating`

## Motion
- Durations: `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-enter`
- Easing: `--ease-out`, `--ease-in-out`, `--ease-standard`
- Reduced motion policy is enforced globally in `src/styles/globals.css`

## Breakpoints
- Mobile-first with core checkpoints at 320, 375, 430, 768, 1024, 1280, 1440, and 1920+

## Component Conventions
- Reusable primitives are in `src/components/ui`
- Layout shell is in `src/components/layout` with alias in `src/layouts`
- Feature pages are route-level wrappers in `src/pages`
- API contracts are wrapped in `src/services` without backend schema changes
