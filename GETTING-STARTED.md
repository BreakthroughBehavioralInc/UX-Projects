# Getting Started with UX-Projects

This guide helps Product and Design contributors use UX-Projects in Cursor.

The prototype skills (`@add-prototype`, `@manage-prototype`, `@prototype-help`) are included in the repository under `.cursor/skills`. You do not install each skill separately. They become available only after the **complete** UX-Projects repository is on your computer **and** opened in Cursor.

For the full contributor workflow, see [README.md](README.md). For technical and maintainer information, see [MAINTAINERS.md](MAINTAINERS.md).

---

## Which phase are you in?

| If you… | Start here |
|---------|------------|
| Do **not** yet have UX-Projects on your computer | [Phase 1: First-Time Setup](#phase-1-first-time-setup) |
| Already have UX-Projects open in Cursor | [Phase 2: Normal Use in Cursor](#phase-2-normal-use-in-cursor) |

---

## Phase 1: First-Time Setup

Use this phase only if you do **not** yet have UX-Projects on your computer.

The repository skills are **not** available until the complete UX-Projects repository has been copied to your computer and opened in Cursor. You **cannot** use `@prototype-help` (or any other UX-Projects skill) before this setup is complete.

### What you need first

- **Cursor** installed on your computer
- Access to the organization’s **GitHub** environment
- Access to the **UX-Projects** GitHub repository
- **Write** access to UX-Projects only if you will publish prototypes

**Viewing Prototype Hub and contributing to UX-Projects are separate permissions.** You can view the live Hub with read access, but publishing requires **Write** access.

### Get the complete repository on your computer

Use the approved UX-Projects GitHub repository to create a **local copy of the complete repository** on your computer:

[https://github.com/BreakthroughBehavioralInc/UX-Projects](https://github.com/BreakthroughBehavioralInc/UX-Projects)

Use Cursor’s **Clone Repository** option, or the equivalent option presented by your approved Cursor version, to create a local copy. Provide that URL when prompted, choose a location on your computer where the full repository should be saved, then open the cloned folder in Cursor.

A complete local copy includes the shared **Prototype Hub** files, the **Prototypes** folder with existing prototypes, the `.cursor/skills` folder, and all other repository files. You are copying one whole repository — not individual folders.

When setup is complete, the top-level folder in Cursor should be **UX-Projects**. You should be able to see:

- `README.md`
- `GETTING-STARTED.md`
- `MAINTAINERS.md`
- `.cursor`
- `Prototypes`
- `scripts`

Phase 1 uses Cursor and GitHub setup steps only. It does **not** use a repository skill. Do not type `@prototype-help` or any other `@` skill during Phase 1.

### Important first-time rules

- Copy the **complete** repository. Do not download only the three skill folders under `.cursor/skills`.
- Do not download a ZIP file from GitHub as a substitute for the full repository copy.
- Do not copy only part of the repository.
- Do not use forks, branches, pull requests, terminal commands, or sparse checkout for this beginner setup.
- Do not move or manually recreate skill files yourself.

If you are unsure how to clone the repository in Cursor, ask a teammate who already uses UX-Projects or follow your organization’s approved GitHub access steps. Do not skip this phase and try to use `@prototype-help` first — it requires the repository to already be open in Cursor.

When Phase 1 is complete, continue to [Phase 2: Normal Use in Cursor](#phase-2-normal-use-in-cursor).

---

## Phase 2: Normal Use in Cursor

Use this phase after UX-Projects is on your computer and open in Cursor. The skills should now appear when you start a new chat.

You do **not** need to run Git commands manually for the standard skill workflows. The skills check whether the repository is current and safe before making changes, and check again before publishing.

### If your prototype lives outside UX-Projects

Add **both** the existing prototype folder and the complete UX-Projects folder to the same Cursor workspace. Do not move the prototype manually. The skill shows the source and destination before importing anything.

### Start a new Cursor chat

After you receive or update UX-Projects, start a **new** Cursor chat so Cursor can discover the latest repository skills.

Type `@` and search for a skill. If your Cursor version shows repository skills through `/` instead, search for the same skill name there — it is the same step, not a different workflow.

### Choose a skill

| Situation | Skill |
|-----------|--------|
| Add or import a prototype, or create a new one | `@add-prototype` |
| Update, preview, publish, archive, restore, or diagnose a prototype already in UX-Projects | `@manage-prototype` |
| Not sure what to do | `@prototype-help` |

**`@add-prototype`** — imports an existing prototype or creates a new one.

```text
@add-prototype

Category: Patient, Provider, or CSA
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

Choose the category that represents the prototype's **primary audience**. Use **CSA** for primarily CSA-facing experiences. Tags describe a prototype but do not determine its category.

**`@manage-prototype`** — updates, previews, publishes, archives, restores, or diagnoses an existing prototype in UX-Projects.

```text
@manage-prototype

Prototype: <prototype name>
Action: Update, Preview, Publish, Archive, Restore, or Diagnose
```

**`@prototype-help`** — read-only guidance when you are unsure. It does not change, commit, push, or publish anything. Use this only **after** Phase 1 is complete.

```text
@prototype-help

I am trying to: <describe what you need>
```

### Recommended first test (after Phase 1)

Once UX-Projects is open in Cursor, paste this into a **new** chat to confirm the skills are available:

```text
@prototype-help

I am trying to: Confirm that the UX-Projects skills are available and explain which skill I should use to add my first prototype.
```

This test should give you guidance only. It should not change, commit, push, or publish anything.

### Before publishing

Before you approve publishing, confirm:

- The prototype name and project are correct
- **Patient**, **Provider**, or **CSA** is correct
- The owner is correct
- Important screens, links, and interactions work
- Desktop and mobile layouts look acceptable
- The Prototype Hub card is correct
- All information is fictional or properly sanitized

**Cursor must show a local preview and receive your approval before committing or pushing.**

For the complete review workflow, see [Review and Publish](README.md#review-and-publish) in README.md.

### Update an existing prototype

On a prototype card, use **Open Prototype** to view the prototype or **Manage** to request updates.

**Manage** opens one consolidated form. Current tags appear as removable chips. Type a new tag and press **Enter** to add it. Select all routine changes in one form, choose **Review Cursor prompt**, copy the prompt, and paste it into a **new** Cursor chat. Review Cursor's local preview before approving publication.

Use **Diagnose a problem** when something looks wrong. Cursor inspects first without changing files.

Prototype Hub generates prompts only. It does not edit repository files directly.

**Example**

```text
@manage-prototype

Prototype: <prototype name>
Action: Update

Make these changes:

- Change the status to Testing.
- Add these tags:
  - accessibility
```

For the full management workflow, see [Manage an Existing Prototype](README.md#manage-an-existing-prototype) in README.md.

### If a skill does not appear

If you have **not** finished Phase 1, complete [First-Time Setup](#phase-1-first-time-setup) first.

If UX-Projects is already open in Cursor:

1. Confirm the complete **UX-Projects** folder is open.
2. Confirm `.cursor/skills` is present.
3. Start a **new** Cursor chat.
4. Search for the skill again.

If the skill still does not appear, paste this **one-time diagnostic prompt** into chat. This is plain text for Cursor to read — it is **not** a repository skill and does not start with `@`:

```text
The UX-Projects skills are not appearing.

Do not change, delete, reset, overwrite, commit, or publish anything.

Please:
1. Confirm that the complete UX-Projects repository is open.
2. Check for unexpected local changes.
3. Confirm whether the skill files exist under .cursor/skills.
4. Confirm whether my local repository is current.
5. Explain the problem in plain language.
6. Show me the safest next step before making changes.
```

Do not manually recreate missing skill files. If files are missing, ask Cursor to diagnose and recommend the safest next step.

---

## More Information

- [README.md](README.md) — complete contributor workflow, access rules, troubleshooting, and prototype organization
- [MAINTAINERS.md](MAINTAINERS.md) — technical reference, validation, deployment, and maintainer working agreements
