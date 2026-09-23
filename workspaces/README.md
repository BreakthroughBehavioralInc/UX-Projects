# Development Workspaces

Node.js, Storybook, Vite, and other **build-time** projects live here — not at the repository root.

## Why

The Prototype Hub deploy workflow runs Node scripts from `scripts/` at the repository root. A root-level `package.json` (especially with `"type": "module"`) breaks those scripts and can take down GitHub Pages.

Published prototype output still belongs under `Prototypes/<Category>/<project>/<version>/`.

## Adding a workspace

1. Create `workspaces/<project-slug>/` with its own `package.json`, source, and Storybook/Vite config.
2. Build static output into the matching folder under `Prototypes/`.
3. Keep `prototype.json` in the Prototypes folder — do not let build tools delete it.
4. Do **not** add `package.json` at the repository root.
5. Do **not** add a second GitHub Pages workflow. Hub deploy uses `.github/workflows/deploy-pages.yml` only.

## Example

```
workspaces/csa-handoff-prototype/   ← Storybook source (dev)
Prototypes/CSA/kr-2-2-reduce-aht/mvp/   ← published static build + prototype.json
```
