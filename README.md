# UX Projects

This repository is a shared workspace for interactive UX prototypes, design explorations, usability-testing concepts, and stakeholder-review experiences.

It is intended to help UX designers store, review, and share prototype work in one place using GitHub, Cursor, and GitHub Pages.

> **IMPORTANT: Live site access and content rules**
>
> - The GitHub Pages site uses the visibility configured under **Settings > Pages** in this repository.
> - As of the current configuration, Pages visibility is **Private**. Viewers must sign in to GitHub and have access to this repository to view the live site.
> - Designers must **not** change the site to Public or change repository visibility without repository-owner and organizational approval.
> - Do **not** add confidential, proprietary, production, patient, member, provider, employee, PHI, PII, credentials, API keys, or other sensitive company information without organizational approval.
> - Prototype content should use fictional or properly sanitized data only.
> - Forms must not collect or transmit real information without an approved backend and security review.
> - A custom HTML login page does **not** secure a public static site.

## Designer Quick Start

1. Get access to the UX-Projects repository.
2. Clone the repository once.
3. Open the local UX-Projects folder in Cursor.
4. Confirm you are on `main`.
5. Check for uncommitted changes.
6. Pull the latest `main` branch.
7. Choose `Patient` or `Provider`.
8. Create or update the prototype inside the correct category.
9. Preview and test the prototype locally.
10. Review all changed files.
11. Commit directly to `main` with a descriptive message.
12. Push `main` to GitHub.
13. Confirm the GitHub Pages deployment.

> **CURRENT DEPLOYMENT LIMITATION**
>
> The current workflow publishes only the **UX Prototype Playground** from `Prototypes/Provider/UX-Prototype-Playground`. Adding another project under `Patient` or `Provider` does **not** automatically make that project live. A repository maintainer must update the deployment workflow before additional prototypes receive their own live URLs.

**Table of contents**

- [Designer Quick Start](#designer-quick-start)
- [Repository Structure](#repository-structure)
  - [Choosing a Prototype Category](#choosing-a-prototype-category)
- [Before You Begin](#before-you-begin)
- [Recommended Workflow: Use Cursor](#recommended-workflow-use-cursor)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Synchronize Before Starting](#2-synchronize-before-starting)
  - [3. Create the Prototype Folder](#3-create-the-prototype-folder)
  - [4. Preview Locally](#4-preview-locally)
  - [5. Review Changes Before Committing](#5-review-changes-before-committing)
  - [6. Commit and Push](#6-commit-and-push)
  - [7. Deployment](#7-deployment)
  - [8. Find the Live Prototype URL](#8-find-the-live-prototype-url)
  - [9. Update an Existing Prototype](#9-update-an-existing-prototype)
- [Fast Path: Copy-and-Paste Cursor Prompt](#fast-path-copy-and-paste-cursor-prompt)
- [Manual Workflow (Fallback)](#manual-workflow-fallback)
- [Updating From GitHub Without Losing Work](#updating-from-github-without-losing-work)
- [Troubleshooting](#troubleshooting)
- [Governance and Safety](#governance-and-safety)
- [Project-Level README Template](#project-level-readme-template)
- [Working Agreements](#working-agreements)

---

## Repository Structure

Current repository layout:

```
UX-Projects/
├── README.md                          # Repository guide (this file)
├── .gitignore                         # Ignores common local system files
├── .github/
│   └── workflows/
│       └── deploy-pages.yml           # GitHub Pages deployment workflow
└── Prototypes/
    ├── Patient/                       # Patient-facing prototype projects
    │   └── .gitkeep
    └── Provider/                      # Provider-facing prototype projects
        └── UX-Prototype-Playground/   # Example static prototype (currently deployed)
            ├── index.html
            ├── about.html
            ├── projects.html
            ├── contact.html
            ├── css/
            │   └── styles.css
            ├── js/
            │   └── app.js
            ├── assets/
            │   ├── images/
            │   ├── icons/
            │   └── illustrations/
            ├── data/
            │   └── projects.json
            └── README.md
```

### Folder purposes

| Path | Purpose |
|------|---------|
| `Prototypes/Patient/` | Contains patient-facing and patient-experience prototypes. |
| `Prototypes/Provider/` | Contains provider-facing, clinician-facing, and care-team workflow prototypes. |
| `Prototypes/Provider/UX-Prototype-Playground/` | Reference static prototype currently deployed to GitHub Pages. |
| `.github/workflows/` | Contains automation, including the GitHub Pages deployment workflow. |
| `README.md` | Repository-level instructions for designers and reviewers. |

Each individual prototype must remain self-contained inside its category folder.

### Expected structure for a new prototype

Each new prototype should follow this pattern:

```
Prototypes/
└── <category>/
    └── <project-name>/
        ├── index.html
        ├── css/
        │   └── styles.css
        ├── js/
        │   └── app.js
        ├── assets/
        │   ├── images/
        │   └── icons/
        └── README.md
```

The `<category>` folder must be either `Patient` or `Provider`.

Additional HTML pages, data files, or asset subfolders are allowed when needed, as long as they stay inside the prototype folder.

### Choosing a Prototype Category

**Patient**

Use for patient-facing experiences, patient portals, scheduling, billing, collections, patient communications, account management, onboarding, and other experiences primarily used by patients or members.

**Provider**

Use for provider-facing, clinician-facing, nurse-facing, clinical-operations, care-team, administrative-provider, and provider-portal experiences.

If a prototype includes both patient and provider experiences, place it under the category representing the prototype's primary audience and explain the cross-audience scope in the project-level README.

Do not duplicate one project across both category folders.

### Naming and organization rules

- Each prototype must have its own **uniquely named folder** inside `Prototypes/Patient/` or `Prototypes/Provider/`.
- Every deployed prototype must include an `index.html` entry point.
- Keep all project-specific code and assets inside that prototype's folder.
- Do **not** create uncategorized prototype folders directly under `Prototypes/`.
- Do **not** place unrelated files in the repository root.
- Prefer **kebab-case** folder names without spaces.

Examples:

- `Prototypes/Patient/patient-portal-rebrand/`
- `Prototypes/Patient/patient-collections-concept/`
- `Prototypes/Provider/clinical-ops-messaging/`
- `Prototypes/Provider/provider-portal-workflow/`

---

## Before You Begin

Use this checklist before creating or updating a prototype:

- [ ] You have an approved GitHub account
- [ ] You have access to the **UX-Projects** repository
- [ ] You have permission to contribute or push changes
- [ ] Cursor is installed and you are signed in
- [ ] Git is installed on your computer (required for clone, pull, commit, and push)
- [ ] You have chosen a prototype category (`Patient` or `Provider`)
- [ ] You have chosen a unique prototype folder name
- [ ] Your prototype uses fictional or sanitized content only
- [ ] You are **not** including PHI, PII, production data, credentials, secrets, or confidential information
- [ ] You have coordinated with another designer if both of you may edit the same project

> **IMPORTANT**
>
> If you cannot clone, pull, push, or access repository settings, contact the repository owner or your organization's GitHub administrator.

---

## Recommended Workflow: Use Cursor

Cursor is the recommended way to work in this repository. You do not need to memorize every Git command to get started. Use Cursor's built-in source control tools when possible, and use the commands below when you need more control.

### 1. Clone the Repository

A **repository** (or **repo**) is the shared project stored in GitHub.

**Clone** means downloading a copy of that repository to your computer. You only need to clone once.

**In GitHub**

1. Open the **UX-Projects** repository in GitHub.
2. Select **Code**.
3. Copy the HTTPS clone URL shown for your organization.

**In Cursor**

1. Open Cursor.
2. Run **Clone Repository** from the Command Palette or welcome screen.
3. Paste the clone URL.
4. Choose a local folder location.
5. Open the cloned `UX-Projects` folder in Cursor.

**Optional terminal commands**

```bash
git clone https://github.com/BreakthroughBehavioralInc/UX-Projects.git
cd UX-Projects
cursor .
```

After the first clone, open your existing local `UX-Projects` folder in Cursor for future work.

### 2. Synchronize Before Starting

Before creating or editing a prototype, update your local copy so you do not overwrite another designer's recent work.

This repository uses **`main`** directly for all prototype work.

Always check your current state first:

```bash
git status
git checkout main
git pull origin main
```

- If `git status` shows uncommitted changes, stop and review them in Cursor before pulling.
- Do not automatically stash, reset, discard, or overwrite changes.
- If the pull creates a conflict, stop and ask the repository owner for help.
- Never force-push.

### 3. Create the Prototype Folder

Create a new folder at:

```
Prototypes/<category>/<unique-project-name>/
```

The `<category>` must be exactly `Patient` or `Provider`.

You can create this folder manually in Cursor's file explorer, or ask Cursor to generate the prototype for you.

Review the example project at `Prototypes/Provider/UX-Prototype-Playground/` before starting. It shows a working multi-page static prototype with CSS, JavaScript, assets, and a project-level README.

**Copy-and-paste Cursor prompt**

```text
Create a new static UX prototype inside:

Prototypes/<category>/<project-name>/

Category:
Patient or Provider

Project name:
<project-name>

Before creating files, inspect the UX-Projects repository structure and existing prototypes. Do not modify or delete any other prototype. Stop if the category is not exactly Patient or Provider.

Requirements:
- Create index.html as the entry point.
- Keep all project files inside Prototypes/<category>/<project-name>/.
- Use css/, js/, and assets/ subfolders.
- Use only HTML, CSS, and vanilla JavaScript unless I explicitly approve another framework.
- Use relative file paths that work on GitHub Pages.
- Do not use absolute local file paths.
- Do not add secrets, credentials, API keys, PHI, PII, production data, or confidential information.
- Use fictional or sanitized content.
- Make the experience responsive and accessible.
- Include keyboard support, visible focus states, semantic HTML, meaningful alternative text, and sufficient color contrast.
- Add a project-level README.md describing the prototype, how to run it, and its intended audience.
- Do not change the root deployment workflow.
- After generating the project, run a local link and path review and report any broken references.

Project purpose:
<describe the prototype>

Pages or screens:
<list the required pages or screens>

Interactions:
<list the required interactions>

Visual direction:
<describe the visual style>
```

### 4. Preview Locally

A local development server is preferable to opening HTML files directly with a `file://` URL. Some browser features, such as loading JSON with `fetch`, may not work reliably without a server.

This repository does not currently include a shared npm script or Makefile for preview. Use one of the options below.

**Option A: Python local server (recommended example)**

From the prototype folder:

```bash
cd Prototypes/<category>/<project-name>
python3 -m http.server 8000
```

Then open [http://localhost:8000/](http://localhost:8000/)

If you run the server from the repository root instead, open:

```
http://localhost:8000/Prototypes/<category>/<project-name>/
```

**Option B: Cursor or VS Code Live Server**

If your team has approved and installed a Live Server extension, you can use it to preview `index.html`. Confirm the extension is installed before relying on this option.

**Testing checklist**

Before committing, verify:

- [ ] Home page loads
- [ ] Navigation works
- [ ] Images display
- [ ] CSS loads
- [ ] JavaScript interactions work
- [ ] Refreshing a nested page does not break expected navigation
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Mobile layout is usable
- [ ] No console errors appear in the browser developer tools
- [ ] No local computer paths are referenced
- [ ] No sensitive information is present

### 5. Review Changes Before Committing

Check what changed before you commit:

```bash
git status
git diff
```

- `git status` shows which files were added, changed, or deleted.
- `git diff` shows the actual content changes.

Confirm that only your intended prototype folder and any approved documentation files have changed.

In Cursor, you can also use the **Source Control** panel to review changed files visually.

### 6. Commit and Push

A **commit** saves a snapshot of your approved changes. A **push** uploads those changes to GitHub on `main`.

Review your changes first:

```bash
git status
git diff
```

Stage only the files you intend to contribute:

```bash
git add Prototypes/<category>/<project-name>
```

If you also updated the root `README.md` or other approved documentation intentionally:

```bash
git add README.md
```

Commit with a clear message:

```bash
git commit -m "<clear description of the prototype change>"
```

Push directly to `main`:

```bash
git push origin main
```

In Cursor, you can stage, commit, and push from the **Source Control** panel instead of using terminal commands.

> **IMPORTANT**
>
> Avoid these unsafe actions:
>
> - Running broad commands such as `git add .` without reviewing `git status`
> - Force-pushing
> - Deleting another designer's prototype folder
> - Committing the entire repository without review

### 7. Deployment

**Deployment** is the process that publishes approved changes to the live GitHub Pages site.

Deployment is handled by the GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

**Current deployment behavior**

| Setting | Current value |
|---------|---------------|
| Workflow name | Deploy GitHub Pages |
| Trigger | Push to `main`, or manual **Run workflow** |
| Branch that triggers deployment | `main` |
| Published folder | `Prototypes/Provider/UX-Prototype-Playground` |
| Deployment method | GitHub Actions uploads that folder as the Pages site artifact |

**What this means for designers**

- Pushing to `main` can trigger an automatic redeployment.
- The workflow currently publishes **one prototype folder only**: `Prototypes/Provider/UX-Prototype-Playground`.
- The existing live URL remains the same, but the Playground now lives under the Provider category in the repository.
- Adding a new project under `Patient` or `Provider` does **not** automatically publish that new prototype.
- To publish a different prototype, a repository maintainer must update `.github/workflows/deploy-pages.yml` and coordinate that change through the normal review process.

**How to monitor deployment**

1. Open the repository in GitHub.
2. Go to **Actions**.
3. Select **Deploy GitHub Pages**.
4. Open the most recent workflow run.

**How to read the result**

- A green check means the deployment workflow completed successfully.
- A red X means the deployment failed. Open the failed run, expand the failed step, and read the error message.

> **TROUBLESHOOTING**
>
> Do not repeatedly change `.github/workflows/deploy-pages.yml` to fix a project-specific HTML, CSS, image, or path issue. Fix the prototype files first. Ask a repository maintainer for help if the workflow itself appears broken.

### Recommended Future Deployment Structure

The intended shared model for this repository is to publish the entire `Prototypes/` directory so each prototype can have its own path:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/<category>/<project-name>/
```

This future URL pattern is **not active yet**.

Enabling that model would require:

1. A landing page at `Prototypes/index.html`
2. Updating `deploy-pages.yml` to publish `Prototypes/`
3. Testing existing relative paths
4. Confirming repository-owner approval before changing the workflow

Do not make these changes without maintainer coordination.

### 8. Find the Live Prototype URL

The current live site is:

[Open the current UX Prototype Playground](https://bookish-barnacle-2ywmpk2.pages.github.io/)

Because the workflow publishes the **contents** of `Prototypes/Provider/UX-Prototype-Playground` as the site root, that link serves `index.html` from the Playground's Provider category folder.

**Important limitations**

- Other projects under `Patient` or `Provider` are stored in the repository but are **not** currently published to GitHub Pages.
- If the workflow is later changed to publish a different single prototype folder, the base URL will stay the same but the live content will change.
- If the workflow is later changed to publish the entire `Prototypes/` directory, project URLs would follow this pattern:

```
https://bookish-barnacle-2ywmpk2.pages.github.io/<category>/<project-name>/
```

That pattern is **not** active today unless the deployment workflow is updated.

**GitHub Pages access rules**

- With **Private** visibility, viewers must sign in to GitHub and have access to this repository.
- With **Public** visibility, anyone on the internet could view the site.
- Designers must not change visibility without repository-owner and organizational approval.
- A custom HTML login page does **not** secure a public static site.

You can confirm the current Pages URL and visibility in GitHub under **Settings > Pages**.

### 9. Update an Existing Prototype

Use this safe update flow:

```bash
git status
git checkout main
git pull origin main
```

If `git status` shows uncommitted changes, stop and use Cursor to review them before pulling, stashing, committing, or discarding anything.

Then:

1. Edit only the intended prototype folder under `Prototypes/Patient/` or `Prototypes/Provider/`.
2. Preview locally.
3. Run `git status` and `git diff`.
4. Commit with a descriptive message.
5. Push `main` to GitHub.
6. Confirm the deployment in **Actions** if your change affects the currently published prototype.

Example commit message:

```bash
git commit -m "Update patient-portal navigation and mobile layout"
```

---

## Fast Path: Copy-and-Paste Cursor Prompt

Use this prompt when you already have the repository cloned locally:

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

Project name:
<project-name>

Task:
Create or update only this prototype folder:
Prototypes/<category>/<project-name>/

Requirements:
- Stop if the category is not exactly Patient or Provider.
- Preserve all other projects and do not delete or overwrite another designer's work.
- Use index.html as the entry point.
- Keep all files inside Prototypes/<category>/<project-name>/.
- Use relative paths compatible with GitHub Pages.
- Use only HTML, CSS, and vanilla JavaScript unless I explicitly approve another framework.
- Preview and validate the prototype locally.
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

Prototype purpose:
<prototype-purpose>

Required pages:
<required-pages>

Required interactions:
<required-interactions>
```

---

## Manual Workflow (Fallback)

Use this shorter path only if you prefer Git commands directly in the terminal.

```bash
git clone https://github.com/BreakthroughBehavioralInc/UX-Projects.git
cd UX-Projects
git status
git checkout main
git pull origin main
```

After making and testing changes:

```bash
git status
git diff
git add Prototypes/<category>/<project-name>
git commit -m "<clear description>"
git push origin main
```

Stop and ask for help if:

- There are unexpected uncommitted changes
- `main` cannot be pulled cleanly
- A merge conflict appears
- Another designer changed the same project
- Unexpected files appear in `git status`

---

## Updating From GitHub Without Losing Work

- Do not run `git pull` when Cursor shows uncommitted changes until you understand what will happen.
- If uncommitted changes exist, stop and use Cursor to review them before stashing, committing, or discarding anything.
- Never overwrite another designer's folder.
- Coordinate when two designers are editing the same prototype.
- Resolve merge conflicts carefully.
- Ask a repository maintainer for help rather than force-pushing.

Safe pattern when your working tree is clean:

```bash
git status
git checkout main
git pull origin main
```

If you are unsure, stop and ask for help before using destructive commands.

---

## Troubleshooting

### Permission denied

You may lack one or more of the following:

- Access to the repository
- Write permission
- Proper GitHub authentication
- Required organization authorization

Contact the repository owner or GitHub administrator.

### Push rejected

Possible causes:

- Someone else pushed newer changes to `main` that you do not have locally
- You are not on `main`
- You lack write permission

If your working tree is clean, update from `main` and try again:

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
4. Expand the failed step and read the error message
5. Fix the underlying issue or ask a maintainer for help

### Page returns 404

Check:

- `index.html` exists in the published prototype folder
- The workflow published the folder you expect
- File and folder names use the correct capitalization
- Relative links point to files that exist
- The latest deployment workflow completed successfully
- The prototype you expect is actually included in the workflow's published path

### CSS, JavaScript, or images are missing

Use relative paths inside the prototype folder.

Correct examples:

```html
<link rel="stylesheet" href="./css/styles.css">
<script src="./js/app.js"></script>
<img src="./assets/images/example.svg" alt="Example illustration">
```

Avoid:

- `C:\Users\...`
- `/Users/...`
- `file://...`
- Paths that begin at your computer's root

GitHub Pages paths and filenames are **case-sensitive**.

### Site asks for GitHub login

The Pages site is currently configured with **Private** visibility. Only people with repository access can view it after signing in to GitHub.

### Another designer's work appears missing

Stop and do not force-push or run destructive git commands.

1. Check your current branch with `git branch`
2. Run `git status`
3. If your working tree is clean, update safely:

```bash
git checkout main
git pull origin main
```

4. Contact the repository maintainer if files still appear missing

---

## Governance and Safety

> **SECURITY**

- Use fictional or sanitized information only.
- Never include PHI, PII, credentials, secrets, tokens, production exports, or unapproved proprietary content.
- Do not change repository visibility.
- Do not change deployment workflows casually.
- Do not overwrite another designer's project.
- Do not commit large source-design files or unnecessary binaries without approval.
- Give prototypes clear ownership, status, and purpose.
- Treat the live site as a review environment, not a production application.
- Static prototypes must not pretend to securely authenticate users or securely store submitted information.
- Forms must not collect or transmit real information without an approved backend and security review.
- A custom HTML login page does **not** secure a public static site.

---

## Project-Level README Template

Place this file at `Prototypes/<category>/<project-name>/README.md`:

```markdown
# <Prototype Name>

## Purpose
<What is being tested or demonstrated?>

## Owner
<Designer or team>

## Category
Patient / Provider

## Status
Draft / In Review / Approved / Archived

## Audience
<Who should review it?>

## Primary Audience
<Patients, providers, nurses, care teams, administrators, or another audience>

## Entry Point
index.html

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
2. Work only inside the intended Patient or Provider project folder.
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
