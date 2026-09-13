# UX Projects

---

# Product and Design Contributors

Use this guide if you are a Designer, Product Manager, or other approved Product contributor adding or managing prototypes in **Prototype Hub**.

**Three Cursor skills handle routine work:**

| Skill | Use when you want to… |
|-------|------------------------|
| `@add-prototype` | Add an existing prototype or create a new one |
| `@manage-prototype` | Update, preview, publish, archive, restore, or diagnose an existing prototype |
| `@prototype-help` | Figure out what to do when you are unsure |

All three skills are already included in UX-Projects. You do not install them separately.

---

## What Is Prototype Hub?

Prototype Hub is the internal catalog for discovering, reviewing, and opening Patient and Provider prototypes. **UX Prototype Playground** is one example prototype in the Hub, not the Hub itself.

This repository is for prototype and concept work. It is not a production application or general file-storage location.

Prototype Hub is hosted as a **Private** GitHub Pages site. Viewing the live site and publishing prototypes require different permissions (see [Before You Start](#before-you-start)).

**Live Prototype Hub:** [bookish-barnacle-2ywmpk2.pages.github.io](https://bookish-barnacle-2ywmpk2.pages.github.io/)

---

## Start Here

1. Open the **complete** UX-Projects folder in Cursor and start a **new** chat.
2. Paste this into chat:

```text
@add-prototype

Category: Patient or Provider
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

Use this same skill whether you already have a prototype or want Cursor to create one.

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

### Confirm the complete repository is open

In Cursor, the top-level folder should be **UX-Projects**. You should be able to see `README.md`, `Prototypes`, `.cursor`, and `scripts` in the file area.

### If your existing prototype lives outside UX-Projects

Add **both** the existing prototype folder and the complete UX-Projects repository to the same Cursor workspace. Do not manually move the prototype first. The skill shows the identified source and proposed destination before importing anything.

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

### If `@add-prototype` does not appear

1. Confirm the complete `UX-Projects` folder is open — not only an individual prototype folder.
2. Start a new Cursor chat.
3. Type `@` and search for **Add Prototype**.
4. If the skill still does not appear, use `@prototype-help` or paste this diagnostic prompt:

```text
The Add Prototype skill is not appearing.

Please follow the instructions in:
.cursor/skills/add-prototype/SKILL.md

Do not change, delete, reset, overwrite, commit, or publish anything yet.

First:
1. Confirm that the complete UX-Projects repository is open.
2. Check whether my local repository has unexpected changes.
3. Confirm whether the Add Prototype skill files are present.
4. Confirm whether my local repository is current.
5. Explain the problem in plain language.
6. Show me the safest proposed solution before making changes.
```

If `SKILL.md` is also unavailable, Cursor must stop after diagnosis. It must not recreate the workflow from assumptions or publish anything.

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
- **Patient** or **Provider** is correct
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

```text
@manage-prototype

Prototype: <prototype name>
Action: Update, Preview, Publish, Archive, Restore, or Diagnose
```

| Action | What it does |
|--------|----------------|
| **Update** | Change the selected prototype. Cursor asks what to change, updates only that prototype, validates, and previews before publishing. |
| **Preview** | Open local prototype and Prototype Hub previews without changing content unless you ask. |
| **Publish** | Validate and publish approved local changes after you review the proposed files. |
| **Archive** | Hide the prototype from the default Hub view without deleting it. Requires your approval. |
| **Restore** | Return an archived prototype to an active status. Requires your approval. |
| **Diagnose** | Explain an issue in plain language and recommend the safest next step before making changes. |

Cursor locates the prototype safely. If multiple prototypes match, it asks you to choose one. It does not modify unrelated files.

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
└── Provider/
    └── <project-name>/
        └── <prototype-name>/
```

- **Patient** or **Provider** is the primary audience. Do not create a separate Product category folder.
- **Project** is the initiative, product, or workstream.
- **Prototype** is one concept, workflow, or variation.
- Cursor generates valid folder names automatically. You do not need to name folders yourself.
- One project may contain multiple prototypes.
- Every prototype must remain self-contained.

**Patient** — patient-facing experiences such as portals, scheduling, billing, collections, communications, and onboarding.

**Provider** — provider-facing, clinician-facing, nurse-facing, clinical-operations, and care-team experiences.

If a prototype serves both audiences, choose the **primary audience** and note the cross-audience scope in the project README.

Example paths:

- `Prototypes/Provider/clinical-ops-messaging/nurse-workflow/`
- `Prototypes/Provider/ux-prototype-playground/primary-demo/` (**UX Prototype Playground**)

After you approve publishing, Cursor updates Prototype Hub automatically. You do not create catalog cards manually.

---

# Maintainers and Advanced Contributors

Technical reference — repository structure, `prototype.json`, validation commands, catalog generation, Git workflow, deployment, and maintainer working agreements — is in **[MAINTAINERS.md](MAINTAINERS.md)**.

Maintainers and advanced contributors may use the skills above for routine work. Use MAINTAINERS.md when a skill cannot be used or when direct repository maintenance is required.
