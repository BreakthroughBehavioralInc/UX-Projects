# UX Projects — Maintainers and Advanced Contributors

This document is for maintainers and advanced contributors. Product and Design contributors should use the skills documented in [README.md](README.md) (`@add-prototype`, `@manage-prototype`, `@prototype-help`) and do not need to read this file for routine work.

The Prototype Hub interface uses EverKit design-system tokens and patterns where they are available in the repository. Contributors should not introduce unrelated visual frameworks or hard-coded styles into the Hub.

**Table of contents**

- [Live URLs](#live-urls)
- [Repository Structure](#repository-structure)
- [Contributor Quick Start (Technical)](#contributor-quick-start-technical)
- [prototype.json Metadata](#prototypejson-metadata)
- [Local Preview and Validation](#local-preview-and-validation)
- [Commit and Push](#commit-and-push)
- [Deployment](#deployment)
- [Updating and Archiving Prototypes](#updating-and-archiving-prototypes)
- [Manual Workflow (Fallback)](#manual-workflow-fallback)
- [Governance and Safety](#governance-and-safety)
- [Project-Level README Template](#project-level-readme-template)
- [Maintainer Working Agreements](#maintainer-working-agreements)

---

## Live URLs

Prototype Hub:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/
```

Patient prototype:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/Patient/<project-name>/<prototype-name>/
```

Provider prototype:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/Provider/<project-name>/<prototype-name>/
```

UX Prototype Playground (example):

```
https://bookish-barnacle-2ywmpk2.pages.github.io/Provider/ux-prototype-playground/primary-demo/
```

---

## Repository Structure

```
UX-Projects/
├── README.md
├── GETTING-STARTED.md
├── MAINTAINERS.md
├── .gitignore
├── .cursor/
│   └── skills/
│       ├── add-prototype/
│       ├── manage-prototype/
│       └── prototype-help/
├── scripts/
│   ├── build-prototype-catalog.js
│   └── validate-prototypes.js
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
└── Prototypes/
    ├── index.html                 # Prototype Hub landing page
    ├── css/
    │   ├── everkit-tokens.css
    │   └── hub.css
    ├── js/
    │   └── hub.js
    ├── generated/
    │   └── catalog.json           # Built by scripts/build-prototype-catalog.js
    ├── Patient/
    │   └── <project-name>/
    │       └── <prototype-name>/
    └── Provider/
        └── <project-name>/
            └── <prototype-name>/
```

Each prototype folder contains:

- `index.html`
- `prototype.json`
- `README.md`
- `css/`, `js/`, and `assets/` as needed

---

## Contributor Quick Start (Technical)

Contributors should use `@add-prototype` or `@manage-prototype` rather than this checklist. The steps below are for maintainers when a skill cannot be used.

1. Open the local `UX-Projects` folder in Cursor.
2. Confirm the current branch is `main`.
3. Run `git status`.
4. Pull the latest `origin/main`.
5. Choose `Patient` or `Provider`.
6. Choose or create a project folder.
7. Create a uniquely named prototype folder.
8. Add prototype files and `prototype.json`.
9. Run the validator and catalog builder.
10. Preview Prototype Hub and the prototype locally.
11. Review `git status` and `git diff`.
12. Commit only intended files.
13. Push `main`.
14. Confirm the GitHub Pages deployment.
15. Open the prototype from Prototype Hub.

---

## prototype.json Metadata

Every prototype must include `prototype.json` with these required fields:

```json
{
  "name": "<human-readable prototype name>",
  "project": "<human-readable project name>",
  "category": "Patient or Provider",
  "owner": "<person or team>",
  "status": "Draft, In Review, Testing, Approved, or Archived",
  "description": "<short description>",
  "version": "<version>",
  "lastUpdated": "YYYY-MM-DD",
  "entryPoint": "index.html",
  "tags": ["tag-one", "tag-two"]
}
```

Validation rules:

- `category` must be `Patient` or `Provider`
- `status` must be `Draft`, `In Review`, `Testing`, `Approved`, or `Archived`
- `entryPoint` must exist
- Folder names must use lowercase kebab-case
- Duplicate category/project/prototype paths and URLs are not allowed

Contributors do not manually edit `prototype.json` or `Prototypes/generated/catalog.json` during the standard skill workflows.

---

## Local Preview and Validation

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
cd Prototypes
python3 -m http.server 8000
```

Open Prototype Hub:

```
http://localhost:8000/
```

Playground example:

```
http://localhost:8000/Provider/ux-prototype-playground/primary-demo/
```

---

## Commit and Push

```bash
git status
git diff
git add Prototypes/<category>/<project-name>/<prototype-name>
git add Prototypes/generated/catalog.json
git commit -m "<clear description>"
git push origin main
```

Never force-push.

Approved workflow publishes directly to `main` after validation and contributor approval. There is no pull-request requirement in the standard contributor workflow.

---

## Deployment

Deployment is handled by `.github/workflows/deploy-pages.yml`.

| Setting | Value |
|---------|-------|
| Trigger | Push to `main`, or manual **Run workflow** |
| Published folder | Entire `Prototypes/` directory |
| Pre-deploy steps | `validate-prototypes.js`, then `build-prototype-catalog.js` |
| Pages visibility | **Private** |

The base URL opens **Prototype Hub**. Archived prototypes remain accessible by direct URL but are hidden from the default Prototype Hub view.

Monitor deployment under **Actions > Deploy GitHub Pages**.

---

## Updating and Archiving Prototypes

To update a prototype, edit only the intended folder, update `prototype.json` (especially `lastUpdated` and `version`), rebuild the catalog, preview, commit, and push.

To archive:

1. Set `"status": "Archived"` in `prototype.json`.
2. Update `lastUpdated`.
3. Rebuild the catalog, commit, and push.

Archived prototypes remain accessible by direct URL, are excluded from the default Prototype Hub view, and appear when **Archived** or **All statuses** is selected.

Contributors should use `@manage-prototype` with action **Archive** or **Restore** rather than editing metadata manually.

---

## Manual Workflow (Fallback)

```bash
git clone https://github.com/BreakthroughBehavioralInc/UX-Projects.git
cd UX-Projects
git checkout main
git pull origin main
```

After changes:

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
git status
git diff
git add Prototypes/<category>/<project-name>/<prototype-name>
git add Prototypes/generated/catalog.json
git commit -m "<clear description>"
git push origin main
```

Stop and diagnose safely if there are unexpected changes, merge conflicts, or another contributor edited the same prototype.

---

## Governance and Safety

- GitHub Pages remains **Private**
- Viewers require GitHub authentication and repository access
- Use fictional or sanitized information only
- Never include PHI, PII, credentials, secrets, tokens, or production exports
- Do not change repository visibility or deployment settings without approval
- Treat Prototype Hub as a prototype review environment, not a production application

---

## Project-Level README Template

```markdown
# <Prototype Name>

## Project
<Project Name>

## Category
Patient / Provider

## Owner
<Designer, Product Manager, or team>

## Status
Draft / In Review / Testing / Approved / Archived

## Purpose
<Purpose>

## Primary Audience
<Audience>

## Entry Point
index.html

## Live Path
/<category>/<project-name>/<prototype-name>/

## Key Flows
- <flow>

## Testing Notes
- <note>

## Data Notice
This prototype uses fictional or sanitized data and is not a production application.
```

---

## Maintainer Working Agreements

1. Pull the latest `main` branch before starting (`git pull origin main`).
2. Run `git status` before and after changes.
3. Work only inside the intended prototype folder.
4. Keep every prototype self-contained.
5. Coordinate before editing another contributor's project.
6. Preview and test before committing.
7. Commit only intended files and push directly to `main`.
8. Never force-push or overwrite another contributor's work.
9. Do not change deployment configuration or Pages visibility without approval.
10. Never include PHI, PII, credentials, secrets, or confidential information.
11. Pull the latest `origin/main` again before publishing.
12. Stop if remote changes conflict. Do not delete another contributor’s work to resolve a conflict.
13. If the same catalog or project file was changed by someone else, stop and diagnose safely before continuing.
14. Run `node scripts/validate-prototypes.js` and `node scripts/build-prototype-catalog.js` before publishing.
15. Confirm deployment under **Actions > Deploy GitHub Pages** after pushing changes that affect the published prototype.
