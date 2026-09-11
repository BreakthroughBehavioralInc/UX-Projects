# UX Projects

This repository is a shared **UX Prototype Hub** for interactive prototypes, design explorations, usability-testing concepts, and stakeholder-review experiences.

It supports multiple UX designers, concurrent Patient and Provider projects, multiple prototype concepts per project, searchable discovery, and stable URLs for every prototype.

> **IMPORTANT: Live site access and content rules**
>
> - GitHub Pages visibility is **Private**. Viewers must sign in to GitHub and have access to this repository.
> - Designers must **not** change the site to Public or change repository visibility without repository-owner and organizational approval.
> - Do **not** add confidential, proprietary, production, patient, member, provider, employee, PHI, PII, credentials, API keys, or other sensitive company information without organizational approval.
> - Prototype content must use fictional or properly sanitized data only.
> - Forms must not collect or transmit real information without an approved backend and security review.
> - A custom HTML login page does **not** secure a public static site.

## Designer Quick Start

1. Open the local `UX-Projects` folder in Cursor.
2. Confirm the current branch is `main`.
3. Run `git status`.
4. Pull the latest `origin/main`.
5. Choose `Patient` or `Provider`.
6. Choose or create a project folder.
7. Create a uniquely named prototype folder.
8. Add prototype files and `prototype.json`.
9. Run the validator and catalog builder.
10. Preview the hub and prototype locally.
11. Review `git status` and `git diff`.
12. Commit only intended files.
13. Push `main`.
14. Confirm the GitHub Pages deployment.
15. Open the prototype from the UX Prototype Hub.

**Table of contents**

- [Designer Quick Start](#designer-quick-start)
- [Repository Structure](#repository-structure)
- [Choosing Patient or Provider](#choosing-patient-or-provider)
- [Project and Prototype Naming](#project-and-prototype-naming)
- [Before You Begin](#before-you-begin)
- [Recommended Workflow: Use Cursor](#recommended-workflow-use-cursor)
- [Creating a New Project](#creating-a-new-project)
- [Adding Multiple Prototypes to a Project](#adding-multiple-prototypes-to-a-project)
- [prototype.json Metadata](#prototypejson-metadata)
- [Local Preview](#local-preview)
- [Validation](#validation)
- [Commit and Push](#commit-and-push)
- [Deployment](#deployment)
- [Prototype URLs](#prototype-urls)
- [Updating a Prototype](#updating-a-prototype)
- [Archiving a Prototype](#archiving-a-prototype)
- [Fast Path: Copy-and-Paste Cursor Prompt](#fast-path-copy-and-paste-cursor-prompt)
- [Manual Workflow (Fallback)](#manual-workflow-fallback)
- [Updating From GitHub Without Losing Work](#updating-from-github-without-losing-work)
- [Troubleshooting](#troubleshooting)
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
    ├── index.html                 # UX Prototype Hub landing page
    ├── css/
    │   └── hub.css
    ├── js/
    │   └── hub.js
    ├── generated/
    │   └── catalog.json           # Built by scripts/build-prototype-catalog.js
    ├── Patient/
    │   └── <project-name>/
    │       └── <prototype-name>/
    │           ├── index.html
    │           ├── prototype.json
    │           ├── README.md
    │           ├── css/
    │           ├── js/
    │           └── assets/
    └── Provider/
        └── <project-name>/
            └── <prototype-name>/
                ├── index.html
                ├── prototype.json
                ├── README.md
                ├── css/
                ├── js/
                └── assets/
```

### Hierarchy

**Category → Project → Prototype**

- **Category** identifies the primary audience (`Patient` or `Provider`).
- **Project** identifies the initiative or workstream.
- **Prototype** identifies one testable concept, workflow, or variation.

A project may contain multiple prototypes. One designer may own multiple projects. Multiple designers may contribute separate projects.

Rules:

- Folder names must be unique within their parent folder.
- Do not duplicate prototypes across categories.
- Do not create prototype folders directly beneath `Patient` or `Provider` without a project folder.
- Every prototype must remain self-contained.

---

## Choosing Patient or Provider

**Patient**

Use for patient-facing experiences, patient portals, scheduling, billing, collections, patient communications, account management, onboarding, and other experiences primarily used by patients or members.

**Provider**

Use for provider-facing, clinician-facing, nurse-facing, clinical-operations, care-team, administrative-provider, and provider-portal experiences.

If a prototype includes both patient and provider experiences, place it under the category representing the **primary audience** and explain the cross-audience scope in the project-level README.

Do not duplicate one project across both category folders.

---

## Project and Prototype Naming

Use lowercase kebab-case for both project and prototype folder names.

Examples:

- `Prototypes/Patient/patient-portal-rebrand/navigation-concept/`
- `Prototypes/Patient/patient-portal-rebrand/mobile-dashboard/`
- `Prototypes/Patient/patient-collections/guest-pay/`
- `Prototypes/Provider/clinical-ops-messaging/nurse-workflow/`
- `Prototypes/Provider/clinical-ops-messaging/provider-inbox/`
- `Prototypes/Provider/ux-prototype-playground/primary-demo/`

---

## Before You Begin

- [ ] Approved GitHub account with repository access
- [ ] Cursor installed and signed in
- [ ] Git installed locally
- [ ] Chosen category (`Patient` or `Provider`)
- [ ] Chosen project name and prototype name
- [ ] Fictional or sanitized content only
- [ ] No PHI, PII, production data, credentials, secrets, or confidential information
- [ ] Coordinated with other designers if editing the same prototype

---

## Recommended Workflow: Use Cursor

Cursor is the recommended way to work in this repository. Use Cursor Source Control when possible, and use terminal commands when you need more control.

### 1. Clone the Repository (first time only)

```bash
git clone https://github.com/BreakthroughBehavioralInc/UX-Projects.git
cd UX-Projects
cursor .
```

### 2. Synchronize Before Starting

```bash
git status
git checkout main
git pull origin main
```

- If `git status` shows uncommitted changes, stop and review them before pulling.
- Do not automatically stash, reset, discard, or overwrite changes.
- If the pull creates a conflict, stop and ask the repository owner for help.
- Never force-push.

---

## Creating a New Project

Create a new project folder under the correct category:

```
Prototypes/<category>/<project-name>/
```

Then create the first prototype folder inside it:

```
Prototypes/<category>/<project-name>/<prototype-name>/
```

Every prototype folder must include:

- `index.html`
- `prototype.json`
- `README.md`
- Supporting `css/`, `js/`, and `assets/` folders as needed

---

## Adding Multiple Prototypes to a Project

Add additional prototype folders under the same project:

```
Prototypes/Provider/clinical-ops-messaging/nurse-workflow/
Prototypes/Provider/clinical-ops-messaging/provider-inbox/
```

Each prototype must have its own:

- Uniquely named folder
- `prototype.json`
- `index.html` entry point
- Self-contained assets

After adding prototypes, rebuild the catalog so the hub can discover them.

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
- `name`, `project`, `owner`, `description`, `version`, and `lastUpdated` are required
- `tags` must be an array
- Folder names must use lowercase kebab-case
- Duplicate category/project/prototype paths are not allowed
- Duplicate live URLs are not allowed

---

## Local Preview

Run validation and build the catalog first:

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
```

Start a local server from the `Prototypes/` directory:

```bash
cd Prototypes
python3 -m http.server 8000
```

Open the hub:

```
http://localhost:8000/
```

Open a specific prototype from the repository root:

```
http://localhost:8000/Prototypes/<category>/<project-name>/<prototype-name>/
```

Or from inside `Prototypes/`:

```
http://localhost:8000/<category>/<project-name>/<prototype-name>/
```

Playground example:

```
http://localhost:8000/Provider/ux-prototype-playground/primary-demo/
```

---

## Validation

Before committing, run:

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
```

The validator checks:

- Required `prototype.json` fields
- Supported category and status values
- Valid `entryPoint`
- Unique prototype paths and URLs
- No obvious local file paths such as `C:\Users\`, `/Users/`, or `file://`
- No obvious credential patterns
- No empty project or prototype folders

The build script generates `Prototypes/generated/catalog.json` for the hub.

---

## Commit and Push

Review changes:

```bash
git status
git diff
```

Stage only intended files:

```bash
git add Prototypes/<category>/<project-name>/<prototype-name>
git add Prototypes/generated/catalog.json
```

If documentation was intentionally updated:

```bash
git add README.md
```

Commit and push directly to `main`:

```bash
git commit -m "<clear description of the prototype change>"
git push origin main
```

---

## Deployment

Deployment is handled by `.github/workflows/deploy-pages.yml`.

**Current deployment behavior**

| Setting | Current value |
|---------|---------------|
| Trigger | Push to `main`, or manual **Run workflow** |
| Published folder | Entire `Prototypes/` directory |
| Pre-deploy steps | `validate-prototypes.js`, then `build-prototype-catalog.js` |
| Pages visibility | **Private** |

**What this means**

- Pushing to `main` can trigger an automatic redeployment.
- The base URL now opens the **UX Prototype Hub**.
- Each prototype receives a stable URL based on its category, project, and prototype folder names.
- Archived prototypes remain accessible by direct URL but are hidden from the default hub view.

Monitor deployment under **Actions > Deploy GitHub Pages**.

---

## Prototype URLs

Hub:

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

Playground:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/Provider/ux-prototype-playground/primary-demo/
```

---

## Updating a Prototype

```bash
git status
git checkout main
git pull origin main
```

Then:

1. Edit only the intended prototype folder.
2. Update `prototype.json`, especially `lastUpdated` and `version` when appropriate.
3. Run validation and rebuild the catalog.
4. Preview the hub and prototype locally.
5. Review `git status` and `git diff`.
6. Commit and push `main`.
7. Confirm deployment in **Actions** if the change affects the published prototype.

---

## Archiving a Prototype

To archive a prototype:

1. Set `"status": "Archived"` in `prototype.json`.
2. Update `lastUpdated`.
3. Rebuild the catalog.
4. Commit and push.

Archived prototypes:

- Remain accessible through their direct URL
- Are excluded from the default hub view
- Appear when the user selects **Archived** or **All statuses**
- Display an Archived status indicator on the hub card

---

## Fast Path: Copy-and-Paste Cursor Prompt

```text
I am working in the UX-Projects repository.

Before making changes:
1. Confirm the repository is UX-Projects.
2. Confirm the current branch is main.
3. Run git status.
4. Stop if uncommitted changes exist.
5. Pull the latest origin/main.

Category:
Patient or Provider

Project:
<project-name>

Prototype:
<prototype-name>

Owner:
<designer-name>

Status:
Draft / In Review / Testing / Approved / Archived

Purpose:
<prototype-purpose>

Required pages:
<required-pages>

Required interactions:
<required-interactions>

Requirements:
- Stop if the category is not exactly Patient or Provider.
- Verify unique project and prototype folder names.
- Create or update only: Prototypes/<category>/<project-name>/<prototype-name>/
- Create or update prototype.json with required metadata.
- Preserve all other prototypes.
- Use index.html as the entry point.
- Use relative paths compatible with GitHub Pages.
- Use only HTML, CSS, and vanilla JavaScript unless I explicitly approve another framework.
- Run node scripts/validate-prototypes.js
- Run node scripts/build-prototype-catalog.js
- Preview the hub and prototype locally.
- Check links, images, JavaScript, accessibility, and console errors.
- Show me all changed files.
- Wait for my approval before committing.
- Commit directly to main only after I explicitly approve.
- Push main to GitHub after committing.
- Confirm deployment status after pushing.
- Never force-push.
- Never change GitHub Pages visibility.
- Never modify deploy-pages.yml without explicit approval.
- Never add PHI, PII, credentials, secrets, production data, or confidential information.
```

---

## Manual Workflow (Fallback)

```bash
git clone https://github.com/BreakthroughBehavioralInc/UX-Projects.git
cd UX-Projects
git status
git checkout main
git pull origin main
```

After making and testing changes:

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

Stop and ask for help if:

- There are unexpected uncommitted changes
- `main` cannot be pulled cleanly
- A merge conflict appears
- Another designer changed the same prototype
- Unexpected files appear in `git status`

---

## Updating From GitHub Without Losing Work

- Do not run `git pull` when uncommitted changes exist until you understand what will happen.
- Stop and review unexpected changes in Cursor before stashing, committing, or discarding anything.
- Never overwrite another designer's work.
- Coordinate when two designers edit the same prototype.
- Ask a repository maintainer for help rather than force-pushing.

Safe pattern when your working tree is clean:

```bash
git status
git checkout main
git pull origin main
```

---

## Troubleshooting

### Permission denied

You may lack repository access, write permission, or required organization authorization.

### Push rejected

Someone else may have pushed newer changes to `main`.

```bash
git status
git checkout main
git pull origin main
git push origin main
```

If the pull creates a conflict, stop and ask a maintainer for help. Do not force-push.

### GitHub Pages deployment failed

1. Open **Actions**
2. Select **Deploy GitHub Pages**
3. Open the failed run
4. Read the failed step

Common causes:

- Invalid `prototype.json`
- Missing entry point
- Duplicate prototype path or URL
- Catalog build failure

### Catalog could not be loaded locally

Run:

```bash
node scripts/build-prototype-catalog.js
```

Then reload the hub.

### Page returns 404

Check:

- `index.html` exists in the prototype folder
- Folder names use the correct capitalization
- Relative links are correct
- The latest deployment workflow completed successfully

### Site asks for GitHub login

The Pages site is **Private**. Only people with repository access can view it after signing in.

---

## Governance and Safety

> **SECURITY**

- GitHub Pages remains **Private**
- Viewers require GitHub authentication and repository access
- Use fictional or sanitized information only
- Never include PHI, PII, credentials, secrets, tokens, production exports, or unapproved proprietary content
- Do not change repository visibility or deployment settings without approval
- Do not overwrite another designer's project
- Treat the live site as a review environment, not a production application
- Forms must not transmit real data
- A custom HTML login page does **not** secure a public static site

---

## Project-Level README Template

Place this file at `Prototypes/<category>/<project-name>/<prototype-name>/README.md`:

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
- <flow>

## Testing Notes
- <note>
- <note>

## Data Notice
This prototype uses fictional or sanitized data and is not a production application.
```

---

## Working Agreements

1. Pull the latest `main` branch before starting.
2. Work only inside the intended Patient or Provider project prototype folder.
3. Keep every prototype self-contained.
4. Do not create uncategorized projects directly under `Prototypes/`.
5. Do not duplicate a prototype across Patient and Provider.
6. Coordinate before editing another designer's project.
7. Preview and test before committing.
8. Review `git status` and `git diff` before committing.
9. Use a clear commit message.
10. Commit only intended files.
11. Push directly to `main`.
12. Never force-push.
13. Never overwrite or delete another designer's work.
14. Do not change deployment configuration or Pages visibility without approval.
15. Never include PHI, PII, credentials, secrets, production data, or confidential information.
16. Confirm deployment after pushing changes that affect the published prototype.
