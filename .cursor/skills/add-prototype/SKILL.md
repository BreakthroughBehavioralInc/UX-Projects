---
name: add-prototype
description: Adds an existing or new Patient or Provider prototype to Prototype Hub, handles technical setup, validates it, previews it, and publishes only after approval.
disable-model-invocation: true
---

# Add Prototype

Adds an existing or new Patient or Provider prototype to **Prototype Hub**. Handles technical setup, validation, preview, and publish-after-approval.

Speak to contributors in plain language. Do not ask them to run scripts, name folders, edit metadata, or run Git commands. Do not begin with a technical questionnaire.

Handle all technical repository checks behind the scenes: branch state, `git status`, pull, validation, catalog rebuild, commit, push, and deployment confirmation. Explain outcomes in plain language.

When something fails or looks unexpected, diagnose the issue, explain what happened, and recommend the next safe step. Never tell contributors to contact the repository owner, administrator, or any named person.

Do **not** hard-code catalog totals. Prototype counts change as contributors publish work.

## When to use

Apply when a Designer, Product Manager, or other approved Product contributor wants to:

- **A. Import an existing prototype**
- **B. Create a new prototype**

Both scenarios use the same invocation: `@add-prototype`.

Do **not** use for unrelated repository work, deployment configuration, or modifying **UX Prototype Playground** or other already published prototypes unless the contributor explicitly selected that prototype.

For updating, archiving, restoring, or diagnosing an existing published prototype, use `@manage-prototype`. For general uncertainty, use `@prototype-help`.

## Required contributor inputs

Ask only for these four fields if they were not already provided:

| Field | Example |
|-------|---------|
| **Category** | `Patient` or `Provider` |
| **Project** | Clinical Ops Messaging |
| **Prototype title** | Nurse Workflow |
| **Owner** | `<your name or team>` |

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

---

## STAGE 1: READINESS CHECK

Run these checks behind the scenes before any file changes. Do not ask the contributor to run them.

1. Confirm the **complete** UX-Projects repository is open (top-level folder is UX-Projects with `README.md`, `Prototypes`, `.cursor`, and `scripts` visible).
2. Confirm the workspace is the **UX-Projects** repository.
3. Confirm the current branch is `main`.
4. Run `git status`.
5. **Stop** if unexpected local changes exist. Explain what changed in plain language and wait for direction.
6. Pull the latest `origin/main` safely. Preserve valid local work.
7. **Stop** if the pull cannot complete cleanly. Never force-push. Explain the issue and recommend the next safe step.
8. Confirm that publishing is possible (Write access can be inferred from successful pull/push history; if publishing later fails, explain plainly).
9. If `@add-prototype` is not visible but skill files exist, recommend starting a **new** Cursor chat after the latest UX-Projects update.

Always pull before starting. Always check `git status`. Stop if `main` changes while the contributor is working.

---

## STAGE 2: DETERMINE THE SCENARIO

After Category, Project, Prototype title, and Owner are known:

- **Import** if a likely existing prototype is found in the workspace (or the contributor points to one).
- **Create** if none is found, or the contributor wants a new prototype.

Search open workspace folders for likely existing prototypes:

- `index.html` and related HTML entry pages
- Existing CSS, JavaScript, images, and assets
- Local static-site folders

Ignore unrelated folders:

- Prototype Hub hub files (`Prototypes/index.html`, hub CSS/JS, generated catalog)
- Already published prototypes under `Prototypes/Patient/` or `Prototypes/Provider/` unless the contributor explicitly selected one
- `node_modules`, `.git`, scripts, unrelated build output, temporary files, and operating-system files

If more than one possible source exists, list options in plain language and ask the contributor to select one. **Never guess.**

If no existing prototype is found, ask only:

> Briefly describe what you want the prototype to demonstrate.

---

## STAGE 3: SHOW A PLAIN-LANGUAGE PLAN

Before modifying files, show:

- Selected **category**, **project**, **prototype title**, and **owner**
- Whether this is an **import** or **new creation**
- **Source folder**, when applicable
- **Proposed destination folder** (`Prototypes/<category>/<project-slug>/<prototype-slug>/`)
- What files will be created or copied
- Confirmation that the existing source will remain unchanged (import)
- Confirmation that nothing will be published until approval

**Stop** if the destination path already exists. Never overwrite another contributor’s prototype.

Wait for contributor approval before copying or creating files.

Example plan:

```text
Category: Provider
Project: Clinical Ops Messaging
Prototype: Nurse Workflow
Owner: <your name or team>

Scenario: Import existing prototype

Source:
<detected folder>

Destination:
Prototypes/Provider/clinical-ops-messaging/nurse-workflow/

Action:
Copy files into Prototype Hub. Original source remains unchanged.
Nothing will be published until you approve the preview.
```

---

## STAGE 4: CREATE OR IMPORT

### Import

1. **Copy** rather than move by default.
2. Preserve the original source folder.
3. Never delete source files.
4. Never alter the source project without explicit approval.
5. Create `Prototypes/<category>/<project-name>/<prototype-name>/`.
6. Keep all imported prototype files inside that folder.
7. Preserve HTML, CSS, JavaScript, images, icons, data, and supported assets.
8. Exclude unnecessary local-development files when appropriate while preserving files the prototype needs.
9. Use relative paths compatible with GitHub Pages.
10. Correct broken absolute local paths only after showing the contributor what must change.
11. Confirm the entry point is `index.html`.
12. Create `prototype.json`, prototype README, and project README (only if missing) behind the scenes.

### Create

Derive description, screens, interactions, tags, folder structure, and initial files from the contributor’s short description. Use HTML, CSS, and vanilla JavaScript unless the contributor explicitly approves another stack.

Keep every prototype self-contained. Do not modify unrelated prototypes. Use fictional or sanitized content only.

### Technical paths (behind the scenes)

1. Verify **Category** is exactly `Patient` or `Provider`.
2. Convert **Project** and **Prototype title** to lowercase kebab-case folder names.
3. **Stop** if destination path already exists.

---

## STAGE 5: VALIDATE AND PREVIEW

1. Run `node scripts/validate-prototypes.js`.
2. Run `node scripts/build-prototype-catalog.js`.
3. Confirm the prototype appears **exactly once** in the generated catalog.
4. Confirm entry point, asset paths, and required files are present.
5. Start a local server from `Prototypes/` and verify:
   - Prototype entry point loads
   - Prototype Hub card appears at `http://localhost:8000/`
   - Search and filters find the prototype
   - **Open Prototype** loads the expected entry point
6. Show the contributor:
   - Prototype local preview URL
   - Prototype Hub local preview URL
   - Validation result
   - Catalog result
   - Expected live path: `https://bookish-barnacle-2ywmpk2.pages.github.io/<Category>/<project-slug>/<prototype-slug>/`
7. Show the short contributor review checklist from README **Review and Publish**.

Do not assume a fixed catalog total. Other published prototypes must remain listed unchanged.

---

## STAGE 6: APPROVAL GATE

**Wait for explicit publish approval after the contributor has seen the final local preview and proposed file changes.**

Do not commit or push based on an earlier general instruction.

Before publishing, show:

- Whether the prototype was **imported** or **newly created**
- Original source folder, if imported
- Prototype Hub destination
- Files copied, created, changed, or excluded
- Validation and catalog results

---

## STAGE 7: SAFE PUBLISH

Only after explicit approval:

1. Pull the latest `origin/main` safely again.
2. **Stop** if remote changes create a conflict. Do not delete another contributor’s work to resolve a conflict. Explain in plain language and recommend the next safe step.
3. Re-run `node scripts/validate-prototypes.js` and `node scripts/build-prototype-catalog.js`.
4. Run `git status`, `git diff`, and `git diff --check`.
5. Confirm no unrelated files changed.
6. Stage only the intended prototype folder, new project README if created, `prototype.json`, and `Prototypes/generated/catalog.json`.
7. Commit directly to `main` with a clear message.
8. Push `main` to origin without force-pushing.
9. Monitor **Deploy GitHub Pages**.
10. If deployment fails, report the exact failed step. **Do not** modify files automatically. Recommend the safest next step.
11. After success, confirm Prototype Hub loads, the card appears, and the prototype path loads.
12. Return the live Prototype Hub link and direct prototype link.

---

## Never

- Ask contributors to run Git commands, validation scripts, or catalog builders manually
- Tell contributors to contact the repository owner, administrator, or any named person
- Present `@add-prototype` as a fallback when the skill is not appearing (use diagnostic flow or `@prototype-help` instead)
- Force-push, reset shared work, or discard unexpected changes
- Delete or overwrite another contributor's work without explicit approval
- Move or delete the contributor’s original source folder by default
- Change GitHub Pages visibility or make Pages Public
- Modify `.github/workflows/deploy-pages.yml` without explicit approval
- Ask the contributor to manually edit `prototype.json` or `Prototypes/generated/catalog.json`
- Add PHI, PII, credentials, secrets, tokens, API keys, production data, or confidential information
- Introduce a pull-request workflow
- Create a separate Product category folder
- Modify **UX Prototype Playground**, **KR 2.2 – Reduce AHT V1**, or other published prototypes unless the contributor explicitly selected that exact prototype to update

## Preserve Prototype Hub behavior

Do not change approved Prototype Hub implementation unless explicitly requested:

- Catalog loading, lazy DOM binding, normalization
- Loading, error, and empty states
- Summary counters, search, filters, sorting, grouping
- **UX Prototype Playground** name, path, and content
- Other published prototype paths and content
- GitHub Pages workflow and Private visibility
- Prototype Hub title, **Patient & Provider Prototype Review** subtitle, and UX header badge

## If this skill is unavailable

Do not ask the contributor to paste `@add-prototype` again if the skill is not appearing.

1. Follow the diagnostic instructions in this file or route the contributor to `@prototype-help`.
2. If `SKILL.md` is unavailable, stop after diagnosis. Do not recreate the workflow from assumptions or publish anything.

Contributor input template: [designer-input-template.md](designer-input-template.md)
