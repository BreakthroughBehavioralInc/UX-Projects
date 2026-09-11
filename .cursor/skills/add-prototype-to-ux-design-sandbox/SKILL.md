---
name: add-prototype-to-ux-design-sandbox
description: Organizes, validates, previews, catalogs, and publishes a Patient or Provider UX prototype in the shared UX Design Sandbox. Use when a designer asks to add, import, update, or publish a prototype in UX Design Sandbox, UX-Projects, or the Patient/Provider prototype catalog.
disable-model-invocation: true
---

# Add Prototype to UX Design Sandbox

Organizes, validates, previews, catalogs, and publishes a Patient or Provider UX prototype in the shared **UX Design Sandbox**.

## When to use

Apply this skill when the designer wants to:

- Add a new prototype to UX Design Sandbox
- Import an existing local prototype folder
- Update and republish an approved prototype
- Publish after local preview approval

Do **not** use for unrelated repository work, deployment configuration changes, or modifying **UX Prototype Playground** unless explicitly requested.

## Designer inputs (ask only for these)

Collect in plain language:

| Field | Example |
|-------|---------|
| **Category** | `Patient` or `Provider` |
| **Project** | Clinical Ops Messaging |
| **Prototype title** | Nurse Workflow |
| **Owner** | Eddie De La Torre |
| **Status** | Draft, In Review, Testing, Approved, or Archived |
| **Purpose** | What the prototype is testing or demonstrating |
| **Required screens** | Pages, screens, or flows needed |
| **Required interactions** | Interactions or behaviors needed |
| **Source** | Existing local folder path, or **Create a new prototype** |

Do **not** ask the designer for folder slugs, JSON fields, catalog paths, deployment settings, build commands, git commands, or GitHub Pages URLs. Derive those yourself.

## Preflight (stop on failure)

1. Confirm the workspace is the **UX-Projects** repository.
2. Confirm the current branch is `main`.
3. Run `git status`.
4. **Stop** if unexpected local changes exist. Explain what changed and wait for direction.
5. Pull the latest `origin/main` safely.
6. **Stop** if the pull cannot complete cleanly. Never force-push.

## Derive technical paths

1. Verify **Category** is exactly `Patient` or `Provider`.
2. Convert **Project** to lowercase kebab-case folder slug (for example, `Clinical Ops Messaging` → `clinical-ops-messaging`).
3. Convert **Prototype title** to lowercase kebab-case folder slug (for example, `Nurse Workflow` → `nurse-workflow`).
4. Show the designer the destination path before creating files:

   `Prototypes/<category>/<project-slug>/<prototype-slug>/`

5. Check whether that project or prototype path already exists.
6. **Stop before overwriting** an existing prototype unless the designer explicitly approves updating that exact prototype.

## Create or import the prototype

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

Rules:

- Keep all prototype-specific files inside that folder.
- If **Source** is an existing folder, copy or move contents into the destination without altering other prototypes.
- If creating new, add `index.html` and supporting assets using HTML, CSS, and vanilla JavaScript only unless the designer explicitly approves another stack.
- Preserve an existing `index.html` when importing.
- Use fictional or sanitized content only.
- Preserve every other project and prototype.

## Technical metadata (agent-owned)

Create and maintain `prototype.json` without asking the designer to edit it manually.

Required fields:

```json
{
  "name": "<Prototype title>",
  "project": "<Project>",
  "category": "Patient or Provider",
  "owner": "<Owner>",
  "status": "<Status>",
  "description": "<Purpose>",
  "version": "1.0",
  "lastUpdated": "YYYY-MM-DD",
  "entryPoint": "index.html",
  "tags": ["derived-from-purpose-and-project"]
}
```

Also create or update the project-level `README.md` using the template in the root README **Technical Reference for Maintainers** section.

Derive tags from purpose, project, and category. Use today's date for `lastUpdated` on new prototypes.

## Validate and preview

Run:

```bash
node scripts/validate-prototypes.js
node scripts/build-prototype-catalog.js
```

Then start a local server from `Prototypes/`:

```bash
cd Prototypes
python3 -m http.server 8000
```

Validate:

- Entry point exists and loads
- Internal links, images, CSS, and JavaScript work
- Relative paths are GitHub Pages compatible
- Keyboard navigation and visible focus states
- Color contrast and mobile layout (spot-check)
- No browser console errors on the prototype or Sandbox home page

Confirm in **UX Design Sandbox** (`http://localhost:8000/`):

- The prototype appears as a card (unless status is `Archived` and default filter is Active only)
- Card shows: title, project, category, owner, status, purpose/description, version, last updated, tags
- **Open Prototype** navigates to the correct path

## Report before publish

Show the designer:

- Sandbox preview address
- Prototype preview address
- Destination folder
- Files created and modified
- Validator and catalog builder results
- Expected live URL pattern:

  `https://bookish-barnacle-2ywmpk2.pages.github.io/<Category>/<project-slug>/<prototype-slug>/`

**Wait for explicit approval** before committing or pushing.

## Publication (only after explicit approval)

1. Run `git status`, `git diff`, and `git diff --check`.
2. Run `node scripts/validate-prototypes.js` and `node scripts/build-prototype-catalog.js` again.
3. Confirm no unrelated files changed.
4. Stage only:
   - The intended prototype folder
   - `Prototypes/generated/catalog.json`
   - Approved documentation updates (if any)
5. Commit directly to `main` with a clear message describing the prototype.
6. Push `main` to origin without force-pushing.
7. Monitor **Deploy GitHub Pages** workflow.
8. If deployment fails, report the exact failed step. **Do not** modify files automatically.
9. After successful deployment, confirm:
   - UX Design Sandbox loads
   - The new card appears
   - The prototype direct path loads
10. Return the final live prototype link.

## Never

- Force-push, reset shared work, or discard unexpected changes
- Delete or overwrite another designer's work without explicit approval
- Change GitHub Pages visibility or make Pages Public
- Modify `.github/workflows/deploy-pages.yml` without explicit approval
- Ask the designer to manually edit `prototype.json` or `Prototypes/generated/catalog.json`
- Add PHI, PII, credentials, secrets, tokens, API keys, production data, or confidential information
- Present a fake login as secure
- Submit or transmit real form data without an approved backend and security review

## Preserve Sandbox behavior

Do not change approved UX Design Sandbox implementation unless explicitly requested:

- Catalog loading, lazy DOM binding, normalization
- Loading, error, and empty states
- Summary counters, search, filters, sorting, grouping
- **UX Prototype Playground** name, path, and content

## Fallback

If this skill is unavailable, use the copy-and-paste instruction in the root README section **Add a Prototype (Fallback)**.
