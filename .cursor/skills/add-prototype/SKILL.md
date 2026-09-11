---
name: add-prototype
description: Adds an existing or new Patient or Provider prototype to Product Repository, handles the technical setup, validates it, previews it, and publishes only after approval.
disable-model-invocation: true
---

# Add Prototype

Adds an existing or new Patient or Provider prototype to **Product Repository**. Handles technical setup, validation, preview, and publish-after-approval.

Speak to contributors in plain language. Do not ask them to run scripts, name folders, or edit metadata.

## When to use

Apply when a Designer, Product Manager, or other approved Product contributor wants to add, import, update, or publish a prototype in Product Repository.

Do **not** use for unrelated repository work, deployment configuration, or modifying **UX Prototype Playground** unless explicitly requested.

## Required contributor inputs

Ask only for these four fields if they were not already provided:

| Field | Example |
|-------|---------|
| **Category** | `Patient` or `Provider` |
| **Project** | Clinical Ops Messaging |
| **Prototype title** | Nurse Workflow |
| **Owner** | Eddie De La Torre |

Do **not** initially require purpose, screens, interactions, source, folder names, paths, metadata, version, tags, entry point, deployment information, or git commands.

Optional details, only if the contributor offers them or they are needed to recover from a problem:

- Status (otherwise **Draft**)
- Description (otherwise derive)
- Existing prototype location (otherwise detect)

Do not present a technical questionnaire unless critical information is genuinely missing.

## Defaults (agent-owned)

| Field | Default |
|-------|---------|
| Status | `Draft` |
| Version | `1.0` |
| lastUpdated | Current date (`YYYY-MM-DD`) when created or imported |
| entryPoint | `index.html` |
| description | Derive from existing prototype README/content when possible |
| tags | Derive conservatively from category, project, and prototype title |

Do not ask contributors to create or edit `prototype.json`. Do not expose generated technical fields unless the contributor requests them or validation failed.

## Preflight (stop on failure)

1. Confirm the workspace is the **UX-Projects** repository.
2. Confirm the current branch is `main`.
3. Run `git status`.
4. **Stop** if unexpected local changes exist. Explain what changed and wait for direction.
5. Pull the latest `origin/main` safely.
6. **Stop** if the pull cannot complete cleanly. Never force-push.

## Detect the prototype source

Inspect the current Cursor workspace and repository **before** asking for a source path.

Treat a folder as a likely prototype if it contains an `index.html` (or a clearly self-contained HTML/CSS/JS prototype) and is **not**:

- Product Repository itself (`Prototypes/index.html`, hub CSS/JS)
- **UX Prototype Playground** unless the contributor explicitly asked to update it
- `node_modules`, `.git`, scripts, or generated catalog files

If one existing prototype is clearly present:

1. Identify the likely folder.
2. Inspect files, pages, screens, navigation, and interactions.
3. Show the contributor that folder in plain language.
4. Ask for approval before copying or moving files.

If several folders are plausible, list them in plain language and ask the contributor to choose. **Do not guess.**

Do not require a Source field when detection is reliable.

## New prototypes

If no existing prototype is available and the contributor wants Cursor to create one, ask only:

> Briefly describe what you want the prototype to demonstrate.

Accept a conversational answer such as:

> I need a messaging workflow where a nurse can contact a provider and escalate an urgent message.

From that response, derive screens, basic interactions, initial description, suggested tags, and folder structure. Use HTML, CSS, and vanilla JavaScript unless the contributor explicitly approves another stack.

## Simple plan (wait for approval)

Before creating or moving files, show the contributor only:

- Category
- Project
- Prototype title
- Owner
- Destination folder
- Whether an existing prototype was found or a new one will be created
- One sentence describing what Cursor will do

Example:

```text
Category: Provider
Project: Clinical Ops Messaging
Prototype: Nurse Workflow
Owner: Eddie De La Torre
Destination: Prototypes/Provider/clinical-ops-messaging/nurse-workflow/

I found an existing prototype in the current workspace. I will organize it in the destination above, create the Product Repository information, validate it, and show you a local preview before publishing.
```

Then wait for approval.

## Technical paths (behind the scenes)

1. Verify **Category** is exactly `Patient` or `Provider`.
2. Convert **Project** to lowercase kebab-case (`Clinical Ops Messaging` → `clinical-ops-messaging`).
3. Convert **Prototype title** to lowercase kebab-case (`Nurse Workflow` → `nurse-workflow`).
4. Destination: `Prototypes/<category>/<project-slug>/<prototype-slug>/`
5. **Stop before overwriting** an existing prototype unless the contributor explicitly approves updating that exact prototype.

Target structure:

```
Prototypes/<category>/<project-name>/<prototype-name>/
├── index.html
├── prototype.json
├── README.md
├── css/
├── js/
└── assets/
```

Keep prototype files inside that folder. Preserve other projects and prototypes. Use fictional or sanitized content only. Preserve an existing `index.html` when importing.

## Technical metadata (agent-owned)

Create and maintain `prototype.json`. Contributors never edit it.

```json
{
  "name": "<Prototype title>",
  "project": "<Project>",
  "category": "Patient or Provider",
  "owner": "<Owner>",
  "status": "Draft",
  "description": "<derived description>",
  "version": "1.0",
  "lastUpdated": "YYYY-MM-DD",
  "entryPoint": "index.html",
  "tags": ["conservative-derived-tags"]
}
```

Create or update the project-level `README.md` using the template in the root README **Technical Reference for Maintainers** section.

## After plan approval (behind the scenes)

Handle without asking the contributor to run commands:

1. Folder-name conversion
2. Duplicate-path checks
3. Folder creation
4. Import or new prototype creation
5. `index.html` verification
6. `prototype.json` creation
7. Project and prototype README creation
8. Relative-path validation (GitHub Pages compatible)
9. Link, image, CSS, and JavaScript validation
10. Keyboard, focus, contrast, and mobile-layout spot-checks
11. Catalog rebuild
12. Local Product Repository preview
13. Local prototype preview
14. Confirmation the Product Repository card appears (unless status is Archived and the default filter is Active only)
15. Changed-file summary

Run:

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
```

Start a local server from `Prototypes/`:

```bash
cd Prototypes
python3 -m http.server 8000
```

## Approval gate (before publish)

Stop after local validation and show:

- Product Repository preview: `http://localhost:8000/`
- Prototype preview: `http://localhost:8000/<Category>/<project-slug>/<prototype-slug>/`
- Destination folder
- Files added or changed
- Validation result
- Expected live path: `https://bookish-barnacle-2ywmpk2.pages.github.io/<Category>/<project-slug>/<prototype-slug>/`

**Wait for explicit publish approval.** Do not commit or push before that.

## Publication (only after explicit approval)

1. Run `git status`, `git diff`, and `git diff --check`.
2. Run `node scripts/validate-prototypes.js` and `node scripts/build-prototype-catalog.js` again.
3. Confirm no unrelated files changed.
4. Stage only the intended prototype folder, `Prototypes/generated/catalog.json`, and approved documentation updates.
5. Commit directly to `main` with a clear message describing the prototype.
6. Push `main` to origin without force-pushing.
7. Monitor **Deploy GitHub Pages**.
8. If deployment fails, report the exact failed step. **Do not** modify files automatically.
9. After success, confirm Product Repository loads, the card appears, and the prototype path loads.
10. Return the final live prototype link.

## Never

- Force-push, reset shared work, or discard unexpected changes
- Delete or overwrite another contributor's work without explicit approval
- Change GitHub Pages visibility or make Pages Public
- Modify `.github/workflows/deploy-pages.yml` without explicit approval
- Ask the contributor to manually edit `prototype.json` or `Prototypes/generated/catalog.json`
- Add PHI, PII, credentials, secrets, tokens, API keys, production data, or confidential information
- Present a static HTML login as secure
- Submit or transmit real form data without an approved backend and security review

## Preserve Product Repository behavior

Do not change approved Product Repository implementation unless explicitly requested:

- Catalog loading, lazy DOM binding, normalization
- Loading, error, and empty states
- Summary counters, search, filters, sorting, grouping
- **UX Prototype Playground** name, path, and content
- GitHub Pages workflow and Private visibility

## Fallback

If this skill is unavailable, use [.cursor/skills/add-prototype/designer-input-template.md](designer-input-template.md).
