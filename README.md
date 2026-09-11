# UX Projects

## What is Prototype Hub?

**Prototype Hub** is a shared internal workspace for Patient and Provider prototypes, product concepts, workflow explorations, and stakeholder-review experiences.

It supports approved contributions from Designers, Product Managers, and Product teams.

Prototype Hub is intended for prototype and concept work. It is not a production application repository or a general-purpose file-storage location.

**Prototype Hub** is the central catalog of Patient and Provider prototype work — a compact internal enterprise dashboard for discovering, reviewing, and opening prototypes. **UX Prototype Playground** is the included example prototype inside Prototype Hub — it is not Prototype Hub itself.

Prototype Hub supports:

- Designers, Product Managers, and other approved Product contributors working at the same time
- Patient and Provider projects
- Several prototype concepts under one project
- Search, filters, and stable URLs for every prototype

> **IMPORTANT: Live site access and content rules**
>
> - GitHub Pages visibility is **Private**. Viewers must sign in to GitHub and have access to this repository.
> - Contributors must **not** change the site to Public or change repository visibility without repository-owner and organizational approval.
> - Do **not** add confidential, proprietary, production, patient, member, provider, employee, PHI, PII, credentials, API keys, or other sensitive company information without organizational approval.
> - Prototype content must use fictional or properly sanitized data only.
> - Forms must not collect or transmit real information without an approved backend and security review.
> - A custom HTML login page does **not** secure a public static site.
> - Prototype Hub is a prototype review environment, not a production application.

---

## Access Requirements

Prototype Hub is hosted through a **Private** GitHub Pages site. Viewers must sign in to GitHub and have authorized access.

Viewing Prototype Hub and contributing to **UX-Projects** are separate permissions. Being able to open the live site does **not** automatically allow someone to add or publish prototypes.

Contributors who add or publish prototypes must have **Write** access to the **UX-Projects** repository.

Contributors do **not** need Maintain or Admin access for the standard Add Prototype workflow.

When repository access is granted, contributors should use their exact GitHub username. If a contributor cannot be found when selecting **Add people**, confirm the contributor’s exact GitHub username and organization access before trying again.

If access or publishing fails, tell Cursor what happened and ask it to diagnose the issue and recommend the next safe step.

### Before using `@add-prototype`

- [ ] You can sign in to the organization’s GitHub environment
- [ ] You can open the UX-Projects repository
- [ ] You have Write access to UX-Projects
- [ ] You opened UX-Projects in Cursor
- [ ] You started a new Cursor chat so `@add-prototype` is available

---

## Add a Prototype

Use the same skill for both situations: you already have a prototype, or you need Cursor to create one.

```text
@add-prototype

Category: Patient or Provider
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

Owner may be a Designer, a Product Manager, or a Product or Design team. A job title is not required. Status defaults to **Draft**.

Contributors do not manually edit `prototype.json` or `generated/catalog.json`. Contributors do not manually create Prototype Hub cards.

### I already have a prototype

Already have a prototype? Open the existing project and UX-Projects in Cursor, start a new Cursor chat, and run `@add-prototype`. Cursor will locate the existing prototype, show the source and destination folders, copy the approved files into Prototype Hub, add the information needed for indexing, validate the prototype, and show a local preview. The original project folder remains unchanged.

```text
@add-prototype

Category: <Patient or Provider>
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

- Cursor attempts to find the existing prototype automatically.
- If Cursor finds multiple possible prototypes, the contributor selects the correct one.
- Cursor copies files by default and leaves the original folder unchanged.
- Cursor does not publish until the contributor approves the preview.
- The contributor does not manually create metadata or a Prototype Hub card.

### I need Cursor to create a prototype

If no existing prototype is available, use the same `@add-prototype` skill. After the four initial details, Cursor asks for one short description of what the prototype should demonstrate. Cursor then creates the initial prototype, validates it, and shows a local preview before publishing.

```text
@add-prototype

Category: Provider
Project: Clinical Ops Messaging
Prototype title: Nurse Workflow
Owner: <your name or team>
```

### Add a Prototype (Fallback)

If the Cursor skill is unavailable, paste the instruction from [.cursor/skills/add-prototype/designer-input-template.md](.cursor/skills/add-prototype/designer-input-template.md) into chat.

---

## Review and Publish

1. **Preview locally** — Ask Cursor to start a local preview. Open your prototype and Prototype Hub in the browser.
2. **Check the Prototype Hub card** — Confirm your prototype appears with the correct name, project, category, owner, and status.
3. **Test the prototype** — Review screens, links, images, interactions, accessibility, and mobile layout.
4. **Approve before publish** — Tell Cursor when you are ready to publish.
5. **Confirm the live link** — Ask Cursor to confirm your prototype is live, then open it from Prototype Hub.

---

## Patient and Provider Organization

Every prototype belongs to one category, one project, and one prototype folder:

```
Category → Project → Prototype
```

```
Prototypes/
├── Patient/
│   └── <project-name>/
│       └── <prototype-name>/
└── Provider/
    └── <project-name>/
        └── <prototype-name>/
```

- **Patient** or **Provider** identifies the primary audience.
- **Project** identifies the initiative, product, or workstream.
- **Prototype** identifies one concept, workflow, or variation.
- One project may contain multiple prototypes.
- Designers and Product Managers may own or contribute prototype work.
- Every prototype must remain self-contained.
- Contributors should use `@add-prototype` instead of manually creating incomplete folder structures.

Do not create a separate Product folder. Patient and Provider remain the only category folders.

**Patient** — patient-facing experiences such as portals, scheduling, billing, collections, communications, and onboarding.

**Provider** — provider-facing, clinician-facing, nurse-facing, clinical-operations, and care-team experiences.

If a prototype serves both audiences, choose the **primary audience** and explain the cross-audience scope in the project README.

**Naming:** Use lowercase kebab-case for folder names.

Examples:

- `Prototypes/Patient/patient-portal-rebrand/navigation-concept/`
- `Prototypes/Provider/clinical-ops-messaging/nurse-workflow/`
- `Prototypes/Provider/ux-prototype-playground/primary-demo/` (example: **UX Prototype Playground**)

Rules:

- Do not create prototype folders directly under `Patient` or `Provider` without a project folder.
- Do not duplicate the same prototype in both categories.
- Keep each prototype self-contained in its own folder.

---

## Troubleshooting

### I cannot open the live Prototype Hub

The site is **Private**. Sign in to GitHub with an account that has access to this repository.

### I can view Prototype Hub but cannot add a prototype

1. Viewing Prototype Hub and contributing to UX-Projects are separate permissions.
2. Confirm your repository role is **Write**.
3. Confirm you are signed into the correct GitHub account.
4. Open a new Cursor chat and invoke `@add-prototype`.
5. Tell Cursor what happened and ask it to diagnose the issue and recommend the next safe step.

### Cursor cannot find my existing prototype

1. Confirm the existing prototype folder is open in the same Cursor workspace.
2. Confirm the prototype contains an identifiable entry page such as `index.html`.
3. Tell Cursor which open folder contains the prototype if detection is ambiguous.
4. Do not manually copy files into random Prototype Hub folders.
5. Ask Cursor to show the source and destination before importing.

### Cursor found multiple prototypes

1. Review the folder options Cursor lists.
2. Select the correct source folder.
3. Confirm the proposed Prototype Hub destination.
4. Do not continue until the correct source is selected.

### My imported prototype does not appear in Prototype Hub

1. Confirm the prototype is not **Archived**.
2. Reload Prototype Hub.
3. Describe the issue to Cursor and ask it to validate the prototype and recommend the next safe step.

### My prototype card does not appear

1. Confirm the status is not **Archived** (archived prototypes are hidden by default).
2. Review any visible error message in Prototype Hub.
3. Describe the issue to Cursor and ask it to diagnose the problem and recommend the next safe step.

### Prototype Hub shows zero prototypes

1. Reload Prototype Hub.
2. Describe the issue to Cursor and ask it to diagnose catalog loading and recommend the next safe step.

### Publishing failed or permission was denied

Tell Cursor what happened and ask it to diagnose the issue and recommend the next safe step. Do not run repository commands manually.

### Page returns 404

Describe the issue to Cursor and ask it to check the prototype path and live link.

---

## How Automatic Indexing Works

Contributors do not manually create cards in **Prototype Hub**. After you approve publishing, Cursor organizes the prototype, creates the technical information Prototype Hub needs, and updates the catalog for you.

A valid prototype then appears automatically as a searchable and filterable card. Catalog totals change as prototypes are added; do not treat any count as a fixed requirement.

If a prototype does not appear, describe the issue to Cursor and ask it to diagnose the problem and recommend the next safe step.

**Do not manually edit `Prototypes/generated/catalog.json`.** Cursor handles catalog updates during the `@add-prototype` workflow.

---

## Before You Publish

1. Use `@add-prototype` to add an existing prototype or create a new one.
2. Work only on the prototype selected in the Cursor plan.
3. Review the local prototype and Prototype Hub previews before publishing.
4. Do not edit, move, or delete another contributor’s work.
5. Never include patient information, personal information, passwords, credentials, secrets, production data, or confidential information.
6. If Cursor reports an unexpected change or conflict, stop the publishing process and ask Cursor to explain the issue and recommend the next safe step.

> **Cursor handles the technical checks.** The `@add-prototype` skill retrieves the latest repository version, checks for unexpected changes, validates the prototype, updates the catalog, reviews the files being published, and confirms deployment. Contributors do not need to run Git commands manually.

---

# Technical Reference for Maintainers

The sections below are for maintainers and advanced contributors. Product and Design contributors can rely on the **Add Prototype** skill (`@add-prototype`) without reading these details.

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
├── .gitignore
├── .cursor/
│   └── skills/
│       └── add-prototype/
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

Contributors should use `@add-prototype` rather than this checklist. The steps below are for maintainers when the skill cannot be used.

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

Stop and ask for help if there are unexpected changes, merge conflicts, or another contributor edited the same prototype.

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
