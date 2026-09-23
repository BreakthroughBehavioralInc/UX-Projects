---
name: manage-prototype
description: Updates, previews, publishes, archives, restores, or diagnoses an existing Patient, Provider, or CSA prototype in Prototype Hub without modifying unrelated work.
disable-model-invocation: true
---

# Manage Prototype

Locates and manages an **existing** prototype already in UX-Projects. Supports update, preview, publish, archive, restore, and diagnose actions.

Speak to contributors in plain language. Do not ask them to run Git commands, edit `prototype.json` manually, or edit `Prototypes/generated/catalog.json`.

Handle technical repository checks behind the scenes. Explain outcomes in plain language. Never tell contributors to contact the repository owner, administrator, or any named person.

For adding a new prototype or creating one from scratch, use `@add-prototype`. For general uncertainty, use `@prototype-help`.

## Required contributor inputs

Ask only for these fields if not already provided:

| Field | Example |
|-------|---------|
| **Prototype** | Nurse Workflow |
| **Action** | `Update`, `Preview`, `Publish`, `Archive`, `Restore`, or `Diagnose` |

Optional follow-up details depend on the action (for example, a short description of requested changes for **Update**).

## Defaults (agent-owned)

- Locate prototypes by matching name against `prototype.json` `name` field and folder paths under `Prototypes/Patient/`, `Prototypes/Provider/`, and `Prototypes/CSA/`.
- If multiple prototypes match, list them in plain language and ask the contributor to select one. **Never guess.**
- Never modify unrelated prototypes or hub files unless explicitly required and approved.

---

## STAGE 1: READINESS CHECK

Same rules as `@add-prototype` Stage 1:

1. Confirm the complete UX-Projects repository is open.
2. Confirm branch `main`, run `git status`, pull `origin/main` safely.
3. Stop on unexpected local changes or unsafe pull results.
4. Never force-push.

For **Diagnose** and **Preview** with no content changes, still perform a read-only readiness check before explaining results.

---

## STAGE 2: LOCATE THE PROTOTYPE

1. Search `Prototypes/Patient/`, `Prototypes/Provider/`, and `Prototypes/CSA/` for matches to the provided prototype name.
2. If one match: show the selected prototype path and current `prototype.json` summary (name, project, category, owner, status, version, lastUpdated).
3. If multiple matches: ask the contributor to choose.
4. If no match: explain plainly and suggest `@add-prototype` if they need to add a new prototype.

---

## STAGE 3: SHOW A PLAIN-LANGUAGE PLAN

Before modifying files, show:

- Selected prototype name and folder path
- Requested **action**
- What will change (files, status, version, lastUpdated)
- Confirmation that unrelated prototypes will not be modified
- Confirmation that nothing will be published until approval (except **Preview** and **Diagnose** when no publish is requested)

Wait for approval before making changes (except **Diagnose**, which makes no changes initially).

---

## Action behavior

### UPDATE

`Action: Update` supports changing prototype metadata and other approved prototype details without touching unrelated fields.

**Supported update types**

| Request type | How to interpret |
|--------------|------------------|
| **Change status** | Set `status` to one of the approved active values: `Draft`, `In Review`, `Testing`, or `Approved`. Show current and proposed status. Do not set `Archived` through `Action: Update` — use `Action: Archive` instead. Preserve tags unless the contributor explicitly requests tag changes in the same prompt. |
| **Add tags** | Keep existing tags and append only the listed new tags. Do not rename or remove tags unless explicitly requested. |
| **Remove tags** | Keep existing tags except remove only the listed tags. |
| **Other metadata** | Update only the fields the contributor named (for example, description, owner, project notes). Preserve all unrelated prototype content and metadata. |

Prototype Hub generates differential tag add/remove prompts only. It does not generate full tag-replacement requests.

**Tag rules**

- `tags` must remain a JSON array in `prototype.json`.
- Compare requested tag changes against the current catalog/`prototype.json` state.
- Trim accidental spaces from contributor-supplied tags.
- Do not silently rename existing tags.
- Preserve unchanged tags unless explicitly removed.
- Avoid duplicate tags.
- The repository validator requires an array only; it does not enforce additional tag format rules. Do not invent new tag naming rules.

**Combined Update requests**

Contributors may send one `Action: Update` prompt that includes multiple changes in a `Make these changes:` list (status, tags, and other details). When a combined prompt arrives:

1. Parse each bullet independently.
2. Show current and proposed values for every field that will change.
3. Apply all requested changes in one pass while preserving unrelated metadata.
4. Do not combine `Action: Update` with `Action: Archive` or `Action: Restore` in the same implementation pass. If a contributor requests both archive/restore and other metadata changes, stop, explain the conflict, and ask them to submit separate prompts.

**Category changes**

Category changes are path changes and are **not** part of routine `Action: Update`. Do not change `prototype.json` category or move folders during status, tag, detail, Archive, Restore, or Diagnose actions unless a separate approved migration plan exists.

If a contributor requests a category change, stop and show a separate move plan before changing a prototype between **Patient**, **Provider**, and **CSA**.

**Update workflow**

1. Locate the selected prototype and show current values for the fields that will change.
2. If the contributor prompt is ambiguous, ask one clarifying question. Never guess.
3. Modify only the selected prototype folder and directly required metadata.
4. Use only approved status values.
5. Update `version` and `lastUpdated` in `prototype.json` according to existing repository rules.
6. Proceed to **Validate and Preview** (Stage 4).
7. Show the updated Prototype Hub card in the local Hub preview.
8. Require approval before publish (Stages 5–6).

### PREVIEW

1. Make no content changes unless the contributor explicitly requests them.
2. Run validation and catalog build if needed for an accurate Hub preview.
3. Start or explain local prototype and Prototype Hub previews.
4. Report validation results.
5. Do not commit or push unless the contributor changes action to **Publish**.

### PUBLISH

1. Validate current approved local changes.
2. Show the exact files proposed for publication.
3. Proceed to **Approval Gate** and **Safe Publish**.

### ARCHIVE

Treat Archive as a separate request. Prototype Hub enforces archive exclusivity and generates `Action: Archive` only when archive is the sole requested change.

1. If the prompt mixes Archive with routine metadata changes (status, tags, or other details), stop and ask the contributor to submit Archive separately.
2. Explain that archiving hides the prototype from the default Prototype Hub view but does not delete it. Direct URLs remain accessible.
3. Set `"status": "Archived"` in `prototype.json` and update `lastUpdated`.
4. Proceed to **Validate and Preview**, show the updated Hub behavior, then require approval before publish.

### RESTORE

1. Apply only to prototypes whose current status is `Archived`.
2. If the prompt mixes Restore with other metadata changes, stop and ask the contributor to submit Restore separately.
3. Set status to the approved active value from the prompt (`Draft`, `In Review`, `Testing`, or `Approved`). Ask if it cannot be determined safely from context.
4. Update `prototype.json` status and `lastUpdated`.
5. Proceed to **Validate and Preview**, then require approval before publish.

### DIAGNOSE

1. Make no file changes during the initial diagnostic action.
2. Inspect the prototype folder, validation output, catalog entry, and any reported symptoms.
3. Explain the issue in plain language.
4. Recommend the safest next action (`Update`, `Publish`, `@add-prototype`, or wait).
5. Do not commit or push during the initial diagnostic action.
6. Show all proposed changes before implementation.

---

## STAGE 4: VALIDATE AND PREVIEW

When the action requires file or metadata changes:

1. Run `node scripts/check-repo-layout.cjs`.
2. Run `node scripts/validate-prototypes.cjs`.
3. Run `node scripts/build-prototype-catalog.cjs`.
3. Confirm the prototype appears correctly in the generated catalog.
4. Start local previews for the prototype and Prototype Hub when useful.
5. Show validation results and the contributor review checklist.

---

## STAGE 5: APPROVAL GATE

**Wait for explicit publish approval** after the contributor sees the final local preview and proposed file changes for any action that will commit or push.

---

## STAGE 6: SAFE PUBLISH

Same rules as `@add-prototype` Stage 7:

1. Pull latest `origin/main` again.
2. Stop on conflicts. Never delete another contributor’s work.
3. Re-validate and rebuild catalog.
4. Review `git status` and `git diff`.
5. Stage only intended files (prototype folder, `prototype.json`, `Prototypes/generated/catalog.json`, and directly required docs).
6. Commit to `main`, push without force-push.
7. Monitor deployment and return live links.
8. If deployment fails, explain and recommend the safest next step without destructive actions.

---

## Never

- Modify **UX Prototype Playground**, **KR 2.2 – Reduce AHT V1**, or other prototypes unless the contributor explicitly selected that prototype
- Delete prototype files or folders without explicit approval
- Force-push, reset, or discard unexpected changes
- Change GitHub Pages visibility or `deploy-pages.yml`
- Ask contributors to run Git commands manually
- Resolve conflicts by deleting another contributor’s work

## Contributor input template

[contributor-input-template.md](contributor-input-template.md)
