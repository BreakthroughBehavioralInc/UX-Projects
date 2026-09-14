---
name: prototype-help
description: Inspects the UX-Projects workspace without changing files, explains the situation in plain language, and recommends whether to use @add-prototype or @manage-prototype with an exact next prompt.
disable-model-invocation: true
---

# Prototype Help

Beginner safety net for Product and Design contributors who are unsure what to do next.

This skill **never** commits, pushes, deletes, resets, overwrites, or publishes anything. It inspects the workspace and repository read-only, then explains the situation in plain language.

Speak without technical jargon, or explain jargon immediately when unavoidable.

Never tell contributors to contact the repository owner, administrator, or any named person.

## When to use

Apply when a contributor:

- Does not know whether to add or manage a prototype
- Cannot find `@add-prototype` or `@manage-prototype`
- Is unsure whether the repository is ready
- Encounters an error message they do not understand
- Wants to know the safest next step before changing anything

## Required contributor input

Ask only for this if not already provided:

```text
I am trying to: <describe what you need>
```

## Workflow

### 1. Inspect without changing files

Read-only checks:

1. Confirm whether the complete UX-Projects repository appears open (`README.md`, `Prototypes`, `.cursor`, `scripts`).
2. Run `git status` (read-only inspection). Report unexpected local changes in plain language.
3. Check whether `.cursor/skills/add-prototype/SKILL.md`, `.cursor/skills/manage-prototype/SKILL.md`, and `.cursor/skills/prototype-help/SKILL.md` exist.
4. If skills are missing from the chat menu but the files exist, recommend starting a **new** Cursor chat after the latest UX-Projects update.
5. Note whether the contributor’s goal involves a **new** prototype, an **existing** prototype in UX-Projects, or **repository readiness** only.
6. If relevant, list published prototypes found under `Prototypes/Patient/`, `Prototypes/Provider/`, and `Prototypes/CSA/` (names only).
7. When a contributor is unsure whether a prototype is **Patient**, **Provider**, or **CSA**, explain the primary-audience rule in plain language. Tags do not determine category. Ask for the primary audience only when necessary.

Do **not** pull, commit, push, modify files, or run destructive commands.

### 2. Explain in plain language

Summarize:

- What you found
- What the contributor was trying to do
- Whether the repository looks ready or needs attention first

### 3. Recommend the right skill

| Situation | Recommend |
|-----------|-----------|
| Add or import a prototype, or create a new one | `@add-prototype` |
| Change, preview, publish, archive, restore, or diagnose an existing prototype in UX-Projects | `@manage-prototype` |
| Skill not appearing, repo not current, or unclear readiness | Diagnostic steps from README **If `@add-prototype` Does Not Appear** — still no file changes without approval |

### 4. Provide the exact next prompt

Give the contributor a complete copy-and-paste block for the recommended skill, using placeholders they can fill in.

Example for add:

```text
@add-prototype

Category: Patient, Provider, or CSA
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

Example for manage:

```text
@manage-prototype

Prototype: <prototype name>
Action: Diagnose
```

Example for readiness (no changes):

```text
Please check whether my local UX-Projects repository is ready to use.

Do not change, delete, commit, or publish anything.

Check for:
1. The complete repository
2. Unexpected local changes
3. The latest approved repository version
4. The Add Prototype skill

Explain the result in plain language and show me the safest next step.
```

### 5. Stop safely

If `SKILL.md` files are missing and the repository appears incomplete:

- Explain the problem plainly
- Recommend syncing or reopening the complete UX-Projects folder
- Do **not** recreate skills from assumptions
- Do **not** publish anything

## Never

- Commit, push, delete, reset, overwrite, or publish
- Run `git pull` or modify the working tree without explicit separate approval for a different skill
- Ask contributors to run Git commands manually
- Present `@add-prototype` as a fix when the skill is not installed or visible (use diagnosis instead)
- Modify prototypes, hub files, deployment settings, or permissions

## Contributor input template

[contributor-input-template.md](contributor-input-template.md)
