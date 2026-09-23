# CSA Handoff Prototype (Storybook workspace)

Storybook source for **KR 2.2 – Reduce AHT MVP**.

## Published prototype

Static build and Hub metadata:

```
Prototypes/CSA/kr-2-2-reduce-aht/mvp/
```

## Local development

```bash
cd workspaces/csa-handoff-prototype
npm ci
npm run dev
```

## Build for Hub

After building, copy output into the Prototypes folder without removing `prototype.json`:

```bash
npm run build-storybook -- --output-dir ../../Prototypes/CSA/kr-2-2-reduce-aht/mvp
```

Set `STORYBOOK_BASE_URL=/CSA/kr-2-2-reduce-aht/mvp/` when building for GitHub Pages.
