# UX Projects

## What is UX Design Sandbox?

**UX Design Sandbox** is the shared home for interactive UX prototypes. It gives designers one searchable place to publish Patient and Provider concepts, review them with stakeholders, and open each prototype from a stable link.

Each prototype lives in its own folder. **UX Prototype Playground** is the included example prototype inside the Sandbox — it is not the Sandbox itself.

The Sandbox supports:

- Multiple UX designers working at the same time
- Patient and Provider projects
- Several prototype concepts under one project
- Search, filters, and stable URLs for every prototype

> **IMPORTANT: Live site access and content rules**
>
> - GitHub Pages visibility is **Private**. Viewers must sign in to GitHub and have access to this repository.
> - Designers must **not** change the site to Public or change repository visibility without repository-owner and organizational approval.
> - Do **not** add confidential, proprietary, production, patient, member, provider, employee, PHI, PII, credentials, API keys, or other sensitive company information without organizational approval.
> - Prototype content must use fictional or properly sanitized data only.
> - Forms must not collect or transmit real information without an approved backend and security review.
> - A custom HTML login page does **not** secure a public static site.

---

## Add a Prototype with Cursor

You do not need to understand JSON, catalog files, Node scripts, GitHub Actions, or deployment settings. **Cursor handles the technical setup for you.**

### How it works

1. Open the local `UX-Projects` repository in Cursor.
2. Paste the standard **Add a Prototype** instruction below.
3. Provide the Patient or Provider category, project name, prototype title, owner, status, and purpose.
4. If the prototype already exists, provide its local folder location.
5. Let Cursor organize the files and perform the technical setup.
6. Review the prototype and **UX Design Sandbox** locally.
7. Tell Cursor to publish only after the preview is approved.
8. After a successful deployment, open **UX Design Sandbox** and find the new prototype card.

### Copy-and-paste instruction

```text
Add a prototype to UX Design Sandbox.

Category: <Patient or Provider>
Project: <project name>
Prototype title: <prototype title>
Owner: <designer name>
Status: <Draft, In Review, Testing, Approved, or Archived>
Purpose: <what the prototype is testing>
Required screens: <screens or pages>
Required interactions: <interactions>
Source folder: <local folder path, or say Create a new prototype>

Handle the repository organization and technical setup for me.

Before changing anything:

1. Confirm this is the UX-Projects repository.
2. Confirm the current branch is main.
3. Check for unexpected local changes.
4. Stop and explain the issue if unexpected changes exist.
5. Pull the latest origin/main safely.

Then:

1. Confirm Category is exactly Patient or Provider.
2. Create or use the correct project folder.
3. Create a unique prototype folder.
4. Keep all prototype files inside that folder.
5. Create and maintain any technical information required by UX Design Sandbox.
6. Do not require me to create or edit metadata manually.
7. Preserve every other project and prototype.
8. Validate the entry point, links, images, JavaScript, accessibility, and responsive layout.
9. Rebuild the Sandbox catalog.
10. Preview the prototype and UX Design Sandbox locally.
11. Confirm the prototype appears as a card in the Sandbox.
12. Show me all changed files.
13. Wait for my approval before committing or pushing.

After I approve:

1. Commit only the intended files directly to main.
2. Push main without force-pushing.
3. Confirm the GitHub Pages deployment succeeds.
4. Confirm the new prototype appears in UX Design Sandbox.
5. Give me the final prototype link.

Never:

- Force-push
- Change GitHub Pages visibility
- Delete or overwrite another designer’s work
- Modify another prototype without approval
- Include PHI, PII, credentials, secrets, tokens, production data, or confidential information
- Modify the deployment workflow without explicit approval
```

---

## What You Need to Provide

When you ask Cursor to add or update a prototype, have this information ready:

| Item | What to provide |
|------|-----------------|
| **Category** | `Patient` or `Provider` — the primary audience |
| **Project** | The initiative or workstream name (for example, `patient-portal-rebrand`) |
| **Prototype title** | The name of this specific concept or variation |
| **Owner** | Your name or design team |
| **Status** | `Draft`, `In Review`, `Testing`, `Approved`, or `Archived` |
| **Purpose** | What the prototype is testing or demonstrating |
| **Required screens** | Pages or flows to include |
| **Required interactions** | Buttons, forms, navigation, or other behavior |
| **Source folder** | Path to existing design files, or say **Create a new prototype** |

Cursor will create folders, technical metadata, and Sandbox catalog entries. **You do not need to edit metadata files yourself.**

---

## Review and Publish

1. **Preview locally** — Ask Cursor to start a local preview. Open your prototype and UX Design Sandbox in the browser.
2. **Check the Sandbox card** — Confirm your prototype appears with the correct name, project, category, owner, and status.
3. **Test the prototype** — Review screens, links, images, interactions, accessibility, and mobile layout.
4. **Approve before publish** — Tell Cursor explicitly when you are ready to commit and push.
5. **Confirm deployment** — After push, ask Cursor to confirm the GitHub Pages deployment succeeded.
6. **Open the live Sandbox** — Find your prototype card and use **Open Prototype** for the live link.

**Direct-to-main workflow:** Changes go to the `main` branch. There are no feature branches or pull requests in the standard designer workflow.

---

## Patient and Provider Organization

Every prototype belongs to one category, one project, and one prototype folder:

```
Category → Project → Prototype
```

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

### I cannot open the live Sandbox

The site is **Private**. Sign in to GitHub with an account that has access to this repository.

### My prototype card does not appear

1. Confirm the deployment succeeded in **Actions > Deploy GitHub Pages**.
2. Ask Cursor to validate the prototype.
3. Confirm the status is not `Archived` (archived prototypes are hidden by default).
4. Confirm the prototype has a working `index.html` entry point.
5. Review any visible error message in UX Design Sandbox.
6. Contact the repository owner if the issue remains.

### UX Design Sandbox shows zero prototypes

1. Open browser developer tools.
2. Check the **Console** for catalog-loading errors.
3. Check the **Network** request for `generated/catalog.json`.
4. Confirm the response is HTTP 200 and contains a `prototypes` array.
5. Ask Cursor to validate the prototype and rebuild the Sandbox catalog.
6. Reload UX Design Sandbox.

### Push rejected or permission denied

Someone else may have pushed newer changes, or you may lack write access. Ask Cursor to pull the latest `main` safely and try again. Do not force-push.

### Page returns 404

Check folder names, capitalization, and that the latest deployment completed successfully.

---

## How the Automation Works

Designers do not manually create cards in **UX Design Sandbox**. Cursor organizes the prototype and creates the technical information required by the Sandbox.

After approved changes are pushed to `main`, the deployment workflow validates the prototypes, rebuilds the catalog, and publishes the updated Sandbox. A valid new prototype then appears automatically as a searchable and filterable card.

If a prototype does not appear:

1. Confirm the deployment succeeded.
2. Ask Cursor to validate the prototype.
3. Confirm the prototype is not `Archived`.
4. Confirm the prototype has a working `index.html` entry point.
5. Review any visible Sandbox error message.
6. Contact the repository owner if the issue remains.

**Do not manually edit `Prototypes/generated/catalog.json`.** Cursor or the deployment workflow rebuilds it automatically.

---

## Live URLs

UX Design Sandbox:

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

# Technical Reference (Maintainers)

The sections below are for maintainers and advanced contributors. UX designers can rely on Cursor and the workflow above without reading these details.

**Table of contents**

- [Repository Structure](#repository-structure)
- [Designer Quick Start (Technical)](#designer-quick-start-technical)
- [prototype.json Metadata](#prototypejson-metadata)
- [Local Preview and Validation](#local-preview-and-validation)
- [Commit and Push](#commit-and-push)
- [Deployment](#deployment)
- [Updating and Archiving Prototypes](#updating-and-archiving-prototypes)
- [Manual Workflow (Fallback)](#manual-workflow-fallback)
- [Governance and Safety](#governance-and-safety)
- [Project-Level README Template](#project-level-readme-template)
- [Working Agreements](#working-agreements)

---

## Repository Structure

```
UX-Projects/
├── README.md
├── .gitignore
├── scripts/
│   ├── build-prototype-catalog.js
│   └── validate-prototypes.js
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
└── Prototypes/
    ├── index.html                 # UX Design Sandbox landing page
    ├── css/
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

## Designer Quick Start (Technical)

1. Open the local `UX-Projects` folder in Cursor.
2. Confirm the current branch is `main`.
3. Run `git status`.
4. Pull the latest `origin/main`.
5. Choose `Patient` or `Provider`.
6. Choose or create a project folder.
7. Create a uniquely named prototype folder.
8. Add prototype files and `prototype.json`.
9. Run the validator and catalog builder.
10. Preview UX Design Sandbox and the prototype locally.
11. Review `git status` and `git diff`.
12. Commit only intended files.
13. Push `main`.
14. Confirm the GitHub Pages deployment.
15. Open the prototype from UX Design Sandbox.

---

## prototype.json Metadata

Every prototype must include `prototype.json` with these required fields:

```json
{
  "name": "<human-readable prototype name>",
  "project": "<human-readable project name>",
  "category": "Patient or Provider",
  "owner": "<designer or team>",
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

Open UX Design Sandbox:

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

The base URL opens **UX Design Sandbox**. Archived prototypes remain accessible by direct URL but are hidden from the default Sandbox view.

Monitor deployment under **Actions > Deploy GitHub Pages**.

---

## Updating and Archiving Prototypes

To update a prototype, edit only the intended folder, update `prototype.json` (especially `lastUpdated` and `version`), rebuild the catalog, preview, commit, and push.

To archive:

1. Set `"status": "Archived"` in `prototype.json`.
2. Update `lastUpdated`.
3. Rebuild the catalog, commit, and push.

Archived prototypes remain accessible by direct URL, are excluded from the default Sandbox view, and appear when **Archived** or **All statuses** is selected.

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

Stop and ask for help if there are unexpected changes, merge conflicts, or another designer edited the same prototype.

---

## Governance and Safety

- GitHub Pages remains **Private**
- Viewers require GitHub authentication and repository access
- Use fictional or sanitized information only
- Never include PHI, PII, credentials, secrets, tokens, or production exports
- Do not change repository visibility or deployment settings without approval
- Treat the live site as a review environment, not a production application

---

## Project-Level README Template

```markdown
# <Prototype Name>

## Project
<Project Name>

## Category
Patient / Provider

## Owner
<Designer or team>

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

## Working Agreements

1. Pull the latest `main` branch before starting.
2. Work only inside the intended prototype folder.
3. Keep every prototype self-contained.
4. Coordinate before editing another designer's project.
5. Preview and test before committing.
6. Commit only intended files and push directly to `main`.
7. Never force-push or overwrite another designer's work.
8. Do not change deployment configuration or Pages visibility without approval.
9. Never include PHI, PII, credentials, secrets, or confidential information.
10. Confirm deployment after pushing changes that affect the published prototype.
