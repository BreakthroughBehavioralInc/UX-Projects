---
name: add-prototype
description: Adds an existing or new Patient or Provider prototype to Product Repository, handles the technical setup, validates it, previews it, and publishes only after approval.
disable-model-invocation: true
---

# Add Prototype

Adds an existing or new Patient or Provider prototype to **Product Repository**. Handles technical setup, validation, preview, and publish-after-approval.

Speak to contributors in plain language. Do not ask them to run scripts, name folders, or edit metadata. Do not begin with a technical questionnaire.

Do **not** hard-code catalog totals. Prototype counts change as contributors publish work.

## When to use

Apply when a Designer, Product Manager, or other approved Product contributor wants to:

- **A. Import an existing prototype**
- **B. Create a new prototype**

Both scenarios use the same invocation: `@add-prototype`.

Do **not** use for unrelated repository work, deployment configuration, or modifying **UX Prototype Playground** or other already published prototypes unless the contributor explicitly selected that prototype.

## Required contributor inputs

Ask only for these four fields if they were not already provided:

| Field | Example |
|-------|---------|
| **Category** | `Patient` or `Provider` |
| **Project** | Clinical Ops Messaging |
| **Prototype title** | Nurse Workflow |
| **Owner** | Amanda Buckley |

Do **not** initially require purpose, screens, interactions, source, folder names, paths, metadata, version, tags, entry point, deployment information, or git commands. Do not add any new required fields.

Optional details, only if the contributor offers them or they are needed to recover from a problem:

- Status (otherwise **Draft**)
- Description (otherwise derive)
- Existing prototype location (otherwise detect)

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

Always pull before starting. Always check `git status`. Stop if `main` changes while the contributor is working.

## Choose scenario after the four fields

After Category, Project, Prototype title, and Owner are known, inspect the current Cursor workspace and decide:

- **Import** if a likely existing prototype is found (or the contributor points to one).
- **Create** if none is found, or the contributor wants a new prototype.

Do not require a Source field when detection is reliable.

## A. Import an existing prototype

Inspect for likely entry points:

- `index.html`
- Other HTML entry pages
- Existing CSS, JavaScript, images, and assets
- Existing local static-site folders

Ignore unrelated folders:

- Product Repository hub files (`Prototypes/index.html`, hub CSS/JS, generated catalog)
- Already published prototypes under `Prototypes/Patient/` or `Prototypes/Provider/` unless the contributor explicitly selected one
- `node_modules`, `.git`, scripts, build output unrelated to the selected prototype, temporary files, and operating-system files

### One likely prototype

1. Show the detected source folder.
2. Show the proposed Product Repository destination.
3. State clearly that the default action is **Copy**, not Move.
4. Explain that the original source folder will remain unchanged.
5. Wait for approval before copying anything.

Example plan:

```text
Category: Provider
Project: Clinical Ops Messaging
Prototype: Nurse Workflow
Owner: Amanda Buckley

Existing prototype found:
<source folder>

Product Repository destination:
Prototypes/Provider/clinical-ops-messaging/nurse-workflow/

Action:
Copy the prototype into Product Repository. The original folder will remain unchanged.
```

Then wait for approval.

### Several possible folders

1. Show the likely options in plain language.
2. Include enough of each folder path to distinguish them.
3. Ask the contributor to select one.
4. **Do not guess.**
5. Do not copy or modify anything until the contributor selects the source.

### No existing prototype found

Ask only:

> Briefly describe what you want the prototype to demonstrate.

Then follow **B. Create a new prototype**.

## Safe import requirements

When importing:

1. **Copy** rather than move by default.
2. Preserve the original source folder.
3. Never delete source files.
4. Never alter the source project without explicit approval.
5. Never overwrite an existing Product Repository prototype.
6. **Stop** if the destination path already exists. Report duplicate project or prototype names.
7. Create `Prototypes/<category>/<project-name>/<prototype-name>/`.
8. Keep all imported prototype files inside that folder.
9. Preserve HTML, CSS, JavaScript, images, icons, data, and supported assets.
10. Exclude unnecessary local-development files when appropriate (`node_modules`, `.git`, OS files, unrelated build caches) while preserving files the prototype needs to function.
11. Use relative paths compatible with GitHub Pages.
12. Correct broken absolute local paths only after showing the contributor what must change.
13. Confirm the entry point is `index.html`.
14. If the existing entry point uses a different filename, explain the proposed solution before renaming or creating a compatible `index.html`.
15. Create technical metadata behind the scenes. Contributors never edit `prototype.json`.
16. Create or update the prototype-level README.
17. Create a project-level README **only if one does not already exist**.

## Import validation

After copying into Product Repository, validate:

- Entry point loads
- HTML pages load
- CSS, JavaScript, images, and icons load
- JSON or local data files load
- Navigation works
- Relative paths work
- No `file://` paths remain
- No local computer paths remain
- Filename capitalization is correct
- Keyboard navigation and visible focus states
- Mobile layout is usable
- No browser console errors
- No PHI, PII, credentials, secrets, tokens, API keys, production data, or unapproved confidential information

Report any necessary corrections **before** making substantial changes to the imported prototype.

## B. Create a new prototype

If the contributor does not already have a prototype, ask only:

> Briefly describe what you want the prototype to demonstrate.

Accept a conversational answer such as:

> I need a messaging workflow where a nurse can contact a provider and escalate an urgent message.

From that response, derive initial description, suggested screens, basic interactions, appropriate tags, folder structure, and initial files. Use HTML, CSS, and vanilla JavaScript unless the contributor explicitly approves another stack.

Show a short plan (category, project, title, owner, destination, one-sentence action) and **wait for approval** before creating files.

Do not require the contributor to separately define purpose, screens, interactions, source, tags, version, or metadata.

## Technical paths (behind the scenes)

1. Verify **Category** is exactly `Patient` or `Provider`.
2. Convert **Project** to lowercase kebab-case (`Clinical Ops Messaging` → `clinical-ops-messaging`).
3. Convert **Prototype title** to lowercase kebab-case (`Nurse Workflow` → `nurse-workflow`).
4. Destination: `Prototypes/<category>/<project-slug>/<prototype-slug>/`
5. **Stop** if that path already exists. Never overwrite another contributor’s prototype.

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

Keep prototype files inside that folder. Preserve other projects and prototypes. Use fictional or sanitized content only.

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

## Automatic indexing (both scenarios)

Contributors must not manually create Product Repository cards or edit `Prototypes/generated/catalog.json`.

1. Create and maintain the technical information required by Product Repository.
2. Run `node scripts/validate-prototypes.js`.
3. Run `node scripts/build-prototype-catalog.js`.
4. Confirm the new or imported prototype appears **exactly once** in the generated catalog.
5. Start a local server from `Prototypes/`:

   ```bash
   cd Prototypes
   python3 -m http.server 8000
   ```

6. Confirm the prototype appears as a card in Product Repository (`http://localhost:8000/`).
7. Confirm search finds it.
8. Confirm the correct Patient or Provider filter finds it.
9. Confirm the project and owner filters include it.
10. Confirm **Open Prototype** loads the expected entry point.
11. Confirm the card shows title, project, category, owner, status, description, version, last-updated date, and tags (unless status is Archived and the default filter is Active only).

Do not assume a fixed catalog total. Other published prototypes must remain listed unchanged.

## Review and publish gate

Before publishing, show:

- Whether the prototype was **imported** or **newly created**
- Original source folder, if imported
- Product Repository destination
- Product Repository local preview
- Prototype local preview
- Files copied
- Files created
- Files changed
- Files excluded from import
- Validation result
- Catalog result
- Expected live path: `https://bookish-barnacle-2ywmpk2.pages.github.io/<Category>/<project-slug>/<prototype-slug>/`

**Wait for explicit publish approval.** Do not commit or push before that.

## Publication (only after explicit approval)

1. Pull the latest `origin/main` safely.
2. **Stop** if remote changes create a conflict. Do not manually resolve a conflict by deleting another contributor’s work. Ask the repository owner for help if the same catalog or project file was changed by someone else.
3. Re-run `node scripts/validate-prototypes.js` and `node scripts/build-prototype-catalog.js`.
4. Run `git status`, `git diff`, and `git diff --check`.
5. Confirm no unrelated files changed.
6. Stage only the intended prototype folder, new project README if created, `prototype.json`, and `Prototypes/generated/catalog.json`.
7. Commit directly to `main` with a clear message describing the prototype.
8. Push `main` to origin without force-pushing.
9. Monitor **Deploy GitHub Pages**.
10. If deployment fails, report the exact failed step. **Do not** modify files automatically.
11. After success, confirm Product Repository loads, the card appears, and the prototype path loads.
12. Return the final live prototype link.

## Never

- Force-push, reset shared work, or discard unexpected changes
- Delete or overwrite another contributor's work without explicit approval
- Move or delete the contributor’s original source folder by default
- Change GitHub Pages visibility or make Pages Public
- Modify `.github/workflows/deploy-pages.yml` without explicit approval
- Ask the contributor to manually edit `prototype.json` or `Prototypes/generated/catalog.json`
- Add PHI, PII, credentials, secrets, tokens, API keys, production data, or confidential information
- Present a static HTML login as secure
- Submit or transmit real form data without an approved backend and security review
- Introduce a pull-request workflow
- Create a separate Product category folder
- Modify **UX Prototype Playground**, **KR 2.2 – Reduce AHT V1**, or other published prototypes unless the contributor explicitly selected that exact prototype to update

## Preserve Product Repository behavior

Do not change approved Product Repository implementation unless explicitly requested:

- Catalog loading, lazy DOM binding, normalization
- Loading, error, and empty states
- Summary counters, search, filters, sorting, grouping
- **UX Prototype Playground** name, path, and content
- Other published prototype paths and content
- GitHub Pages workflow and Private visibility
- Product Repository title, **Patient & Provider Prototype Review** subtitle, and UX header badge

## Fallback

If this skill is unavailable, use [.cursor/skills/add-prototype/designer-input-template.md](designer-input-template.md).
