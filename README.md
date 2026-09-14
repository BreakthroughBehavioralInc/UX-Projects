# UX Projects

---

# Product and Design Contributors

Use this guide if you are a Designer, Product Manager, or other approved Product contributor adding or managing prototypes in **Prototype Hub**.

**New to UX-Projects?** Start with [GETTING-STARTED.md](GETTING-STARTED.md). If you do not have the repository on your computer yet, begin with **Phase 1: First-Time Setup**.

**Three Cursor skills handle routine work:**

| Skill | Use when you want to… |
|-------|------------------------|
| `@add-prototype` | Add an existing prototype or create a new one |
| `@manage-prototype` | Update, preview, publish, archive, restore, or diagnose an existing prototype |
| `@prototype-help` | Figure out what to do when you are unsure |

All three skills are already included in UX-Projects. You do not install them separately.

---

## What Is Prototype Hub?

Prototype Hub is the internal catalog for discovering, reviewing, and opening Patient, Provider, and CSA prototypes. **UX Prototype Playground** is one example prototype in the Hub, not the Hub itself. The Hub uses a wide, responsive card grid so larger catalogs remain scannable on desktop, tablet, and mobile.

This repository is for prototype and concept work. It is not a production application or general file-storage location.

Prototype Hub is hosted as a **Private** GitHub Pages site. Viewing the live site and publishing prototypes require different permissions (see [Before You Start](#before-you-start)).

**Live Prototype Hub:** [bookish-barnacle-2ywmpk2.pages.github.io](https://bookish-barnacle-2ywmpk2.pages.github.io/)

---

## Start Here

1. Open the **complete** UX-Projects folder in Cursor and start a **new** chat.
2. Paste this into chat:

```text
@add-prototype

Category: Patient, Provider, or CSA
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

Use this same skill whether you already have a prototype or want Cursor to create one. Choose the category that represents the prototype's **primary audience**.

**If you already have a prototype:** Cursor finds it, shows the source and destination, and proposes copying it into Prototype Hub without changing your original files.

**If you need a new prototype:** Cursor asks for one short description, then creates an initial prototype for your review.

Owner may be a person or team. A job title is not required. Status defaults to **Draft**.

Contributors do not manually edit `prototype.json`, `Prototypes/generated/catalog.json`, or Prototype Hub cards. Cursor prepares that information automatically.

---

## Before You Start

You need:

- Access to the organization’s GitHub environment
- **Write** access to the UX-Projects repository (viewing Prototype Hub alone is not enough)
- The **complete** UX-Projects repository open in Cursor
- A **new** Cursor chat so the skills are available

After you receive or update to the latest UX-Projects files, start a **new** Cursor chat so Cursor can discover `@add-prototype`, `@manage-prototype`, and `@prototype-help`. An open chat from before the update may not show the latest skills.

You do **not** need to run Git commands manually. The skills check whether the repository is current and safe before making changes, and check again for remote changes before publishing.

First-time setup: see [Phase 1: First-Time Setup](GETTING-STARTED.md#phase-1-first-time-setup) in GETTING-STARTED.md.

### Optional readiness check

If you are unsure whether your local repository is ready, paste this into a new Cursor chat:

```text
Please check whether my local UX-Projects repository is ready to use.

Do not change, delete, commit, or publish anything.

Check for:
1. The complete repository
2. Unexpected local changes
3. The latest approved repository version
4. The Add Prototype, Manage Prototype, and Prototype Help skills

Explain the result in plain language and show me the safest next step.
```

### If a skill does not appear

See [If a skill does not appear](GETTING-STARTED.md#if-a-skill-does-not-appear) in GETTING-STARTED.md (complete Phase 1 first if you are new).

---

## Add a Prototype

Use `@add-prototype` with the four fields shown in [Start Here](#start-here).

**Import an existing prototype**

- Cursor searches open workspace folders for a likely prototype (for example, a folder with `index.html`).
- If more than one match exists, Cursor asks you to choose. It never guesses.
- Cursor shows the source folder and Prototype Hub destination before copying anything.
- Files are **copied**, not moved. Your original folder stays unchanged.
- Nothing is published until you approve the preview.

**Create a new prototype**

- After the four fields, Cursor asks: *Briefly describe what you want the prototype to demonstrate.*
- Cursor creates the initial files, validates them, and shows a local preview.
- Nothing is published until you approve the preview.

---

## What Cursor Will Do

When you use `@add-prototype`, Cursor will:

1. Check that the repository is safe to use (including whether it is current).
2. Determine whether an existing prototype is available in the workspace.
3. Ask for a short description only if a new prototype must be created.
4. Show the proposed source and destination before copying or creating files.
5. Create or copy only the required files.
6. Add the technical information Prototype Hub needs (you do not edit this yourself).
7. Validate the prototype.
8. Start a local preview for the prototype and Prototype Hub.
9. Wait for your approval after you review the preview.
10. Check again for remote changes before publishing.
11. Publish only the approved files, then confirm the live Prototype Hub and prototype links.

The same readiness and safety checks apply at the start of the workflow and again immediately before publishing.

---

## Review and Publish

Before you tell Cursor to publish, confirm:

- Project and prototype names are correct
- **Patient**, **Provider**, or **CSA** is correct
- Owner is correct
- You opened and reviewed the prototype itself
- Important links and interactions work
- Desktop and mobile layouts look acceptable
- Basic accessibility is reasonable (readable text, visible focus, usable controls)
- All information is fictional or properly sanitized
- The Prototype Hub card shows the correct details

When the preview is ready, tell Cursor explicitly that you approve publishing.

After publishing, ask Cursor to confirm your prototype is live and open it from Prototype Hub.

**Contributor responsibilities**

- Work only on the prototype selected in the Cursor plan.
- Do not edit, move, or delete another contributor’s work.
- If Cursor reports an unexpected change or conflict, stop and ask Cursor to explain the issue and recommend the next safe step.

> **Cursor handles the technical checks.** The skills retrieve the latest repository version, check for unexpected changes, validate prototypes, update the catalog, review the files being published, and confirm deployment. You do not need to run Git commands manually.

---

## Manage an Existing Prototype

Use `@manage-prototype` to update, preview, publish, archive, restore, or diagnose a prototype that is already in UX-Projects.

Each prototype card includes **Open Prototype** and **Manage**. **Manage** opens one consolidated form. Review the prototype's current information, select every change you need, review a combined change summary, and copy one Cursor prompt. Prototype Hub prepares the prompt only. It does not edit, commit, push, or publish repository files.

```text
@manage-prototype

Prototype: <prototype name>
Action: Update, Preview, Publish, Archive, Restore, or Diagnose
```

| Action | What it does |
|--------|----------------|
| **Update** | Change the selected prototype. This includes status changes, tag changes, and other approved metadata updates. Cursor shows current and proposed values, updates only that prototype, validates, previews the updated Hub card locally, and waits for your approval before publishing. |
| **Preview** | Open local prototype and Prototype Hub previews without changing content unless you ask. |
| **Publish** | Validate and publish approved local changes after you review the proposed files. |
| **Archive** | Hide the prototype from the default Hub view without deleting it. Requires your approval. |
| **Restore** | Return an archived prototype to an active status. Requires your approval. |
| **Diagnose** | Explain an issue in plain language and recommend the safest next step before making changes. |

### Manage form: one place for all changes

The **Manage** form lets you combine changes in one request:

| Section | What you can do |
|---------|-----------------|
| **Status** | Choose a new active status (`Draft`, `In Review`, `Testing`, `Approved`) or leave **No change**. |
| **Tags** | Current tags appear as removable chips. Add with Enter and remove individual tags before review. |
| **Other changes** | Describe optional updates such as description or owner. |
| **Archive** | For active prototypes, request archiving separately at the bottom of the form. |
| **Restore** | For archived prototypes, request restoration with an active status. |
| **Diagnose a problem** | Switch modes to generate a read-only `Action: Diagnose` prompt. |

### Status

**Active status choices** in the Manage form: `Draft`, `In Review`, `Testing`, `Approved`

**Archived** remains a valid repository status, but it is not selected through the normal status dropdown. Archiving uses the dedicated **Archive prototype** workflow at the bottom of the form.

### Tags

- Existing tags appear as removable chips in **Current tags**.
- Select a tag's remove control to request removal of that tag.
- Type a tag and press **Enter** to request addition.
- Additions and removals can be combined in one Update request.
- Unchanged tags remain preserved.
- Tags are compared against the original catalog state before review.
- The review screen shows only actual additions and removals.
- Contributors do not manually edit `prototype.json`.

### Archive

- Archiving hides the prototype from the default Prototype Hub view.
- Archiving does not delete the prototype or its files.
- Archive is an exclusive request. It cannot be combined with status, tag, or other metadata changes in one Hub request.
- Archive requires explicit confirmation before review.
- Archive counts as exactly one requested change.
- Cursor shows the updated Hub locally before publishing.

### Restore

- Restore applies only to archived prototypes.
- Select an approved active status (`Draft`, `In Review`, `Testing`, or `Approved`).
- Restore cannot be combined with other metadata changes in one Hub request.
- Cursor validates and previews the restored prototype before publication.

### Diagnose

- **Diagnose a problem** inspects first without changing files.
- Diagnose explains the problem in plain language and recommends the safest next step.
- Diagnose does not commit or push unless a later approved workflow requires it.

### Dates

- **Updated** dates display as `MM/DD/YYYY` in Prototype Hub (for example, `09/11/2026`).
- Metadata remains stored as `YYYY-MM-DD` in `prototype.json` and the generated catalog.
- The visible format does not change the underlying value.

### Responsive catalog

The Hub uses a responsive card grid to support a growing prototype catalog. Use search, filters, sort, and grouping to locate prototypes quickly on desktop, tablet, and mobile. The **Category** filter includes **All**, **Patient**, **Provider**, and **CSA**.

**Combined update example**

```text
@manage-prototype

Prototype: <prototype name>
Action: Update

Make these changes:

- Change the status from Testing to In Review.
- Add these tags:
  - accessibility
  - mobile
- Remove these tags:
  - playground

Preserve all unrelated prototype content and metadata.

Show the proposed changes and updated Prototype Hub card in a local preview before committing or pushing.
```

### Contributor workflow

1. Open Prototype Hub and select **Manage** on the prototype card.
2. Use **Make changes** for routine updates, or **Diagnose a problem** for read-only investigation.
3. Select all desired routine changes in one form, then choose **Review Cursor prompt**.
4. Confirm the change summary shows only actual differences, then copy the combined prompt.
5. Paste and run the prompt in a new Cursor chat with the complete UX-Projects repository open.
6. Review the local Hub preview and proposed changes.
7. Approve publishing only when the requested changes are correct.

Cursor locates the prototype safely. If multiple prototypes match, it asks you to choose one. It does not modify unrelated files. Contributors do not edit `prototype.json` or `Prototypes/generated/catalog.json` manually.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| Cannot open live Prototype Hub | Sign in to GitHub with an account that has access to this repository. The site is **Private**. |
| Can view Hub but cannot add a prototype | Confirm **Write** access to UX-Projects. Start a new chat and use `@add-prototype` or `@prototype-help`. |
| Cursor cannot find my prototype | Add the prototype folder and UX-Projects to the same workspace. Tell Cursor which folder to use. |
| Cursor found multiple prototypes | Select the correct source folder before continuing. |
| Prototype does not appear in Hub | Reload Prototype Hub. Confirm status is not **Archived**. Use `@manage-prototype` with action **Diagnose**. |
| Publishing failed | Describe the issue to Cursor. Do not run repository commands manually. |
| Page returns 404 | Use `@manage-prototype` with action **Diagnose** or `@prototype-help`. |
| Not sure what to do | Use `@prototype-help` (see below). |

### When you are unsure

```text
@prototype-help

I am trying to: <describe what you need>
```

`@prototype-help` inspects your workspace without changing files, explains the situation in plain language, tells you whether `@add-prototype` or `@manage-prototype` fits, and gives you the exact next prompt to paste.

---

## Important Data and Security Rules

- GitHub Pages visibility is **Private**. Viewers must sign in to GitHub and have access to this repository.
- Contributors must **not** change the site to Public or change repository visibility without organizational approval.
- Do **not** add confidential, proprietary, production, patient, member, provider, employee, PHI, PII, credentials, API keys, or other sensitive company information without organizational approval.
- Prototype content must use fictional or properly sanitized data only.
- Forms must not collect or transmit real information without an approved backend and security review.
- A custom HTML login page does **not** secure a public static site.
- Prototype Hub is a prototype review environment, not a production application.
- Cursor cannot replace missing repository access. You need **Write** access to publish.

---

## Approved Categories

- **Patient**
- **Provider**
- **CSA**

Every prototype has one primary category. Tags describe a prototype but do not determine its category.

### Category definitions

- **Patient** — primarily patient-facing experiences such as portals, scheduling, billing, collections, communications, and onboarding.
- **Provider** — primarily provider-, clinician-, nurse-, care-team-, or clinical-operations-facing experiences.
- **CSA** — primarily CSA-facing experiences.

### Primary audience

- Choose the category that represents the prototype's primary audience.
- If a prototype spans multiple audiences, note the cross-audience scope in the project or prototype README.
- Do not duplicate a prototype across category folders.
- A `csa` tag does not replace the **CSA** category and does not automatically determine category.

## How Prototypes Are Organized

Every prototype belongs to one category, one project, and one prototype folder:

```
Category → Project → Prototype
```

```
Prototypes/
├── Patient/
│   └── <project-name>/
│       └── <prototype-name>/
├── Provider/
│   └── <project-name>/
│       └── <prototype-name>/
└── CSA/
    └── <project-name>/
        └── <prototype-name>/
```

- **Patient**, **Provider**, and **CSA** are peer category folders. Do not create a separate Product category folder.
- **Project** is the initiative, product, or workstream.
- **Prototype** is one concept, workflow, or variation.
- Cursor generates valid folder names automatically. You do not need to name folders yourself.
- One project may contain multiple prototypes.
- Every prototype must remain self-contained.

Example paths:

- `Prototypes/Provider/clinical-ops-messaging/nurse-workflow/`
- `Prototypes/Provider/ux-prototype-playground/primary-demo/` (**UX Prototype Playground**)
- `Prototypes/CSA/<project-name>/<prototype-name>/`

### Live URLs

Patient prototype:

```
/Patient/<project-name>/<prototype-name>/
```

Provider prototype:

```
/Provider/<project-name>/<prototype-name>/
```

CSA prototype:

```
/CSA/<project-name>/<prototype-name>/
```

### Category changes

Routine **Manage** actions do not change **Category**. Moving between **Patient**, **Provider**, and **CSA** changes the folder path and live URL.

If you are considering a category change, ask Cursor to diagnose and show a safe move plan before anything is moved. Do not manually drag prototype folders between category directories.

```text
@manage-prototype

Prototype: <prototype name>
Action: Diagnose

I am considering changing the category from <current category> to <new category>.

Inspect the current folder, metadata, links, and potential impact. Do not move or change anything. Show a safe migration plan for review.
```

After you approve publishing, Cursor updates Prototype Hub automatically. You do not create catalog cards manually.

---

# Maintainers and Advanced Contributors

Technical reference — repository structure, `prototype.json`, validation commands, catalog generation, Git workflow, deployment, and maintainer working agreements — is in **[MAINTAINERS.md](MAINTAINERS.md)**.

Maintainers and advanced contributors may use the skills above for routine work. Use MAINTAINERS.md when a skill cannot be used or when direct repository maintenance is required.
