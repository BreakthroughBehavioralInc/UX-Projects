# Getting Started with UX-Projects

This guide helps Product and Design contributors open UX-Projects in Cursor and use the included prototype skills.

The skills are already included in the UX-Projects repository under `.cursor/skills`. You do not install each skill separately. Open the **complete** UX-Projects folder in Cursor and start a **new** chat to make the skills available.

For the full contributor workflow, see [README.md](README.md). For technical and maintainer information, see [MAINTAINERS.md](MAINTAINERS.md).

---

## 1. Before You Start

You need:

- Access to **Cursor**
- Access to the **UX-Projects** GitHub repository
- **Write** access only if you need to publish prototypes
- The **complete** UX-Projects repository available on your computer and opened in Cursor

**Viewing Prototype Hub and contributing to UX-Projects are separate permissions.** You can open the live Hub with read access, but publishing requires **Write** access to UX-Projects.

You do not need to run Git commands manually for the standard skill workflows.

---

## 2. Open UX-Projects in Cursor

Open the **complete** UX-Projects folder — not an individual prototype folder.

In Cursor, the top-level folder should be **UX-Projects**. You should be able to see:

- `README.md`
- `MAINTAINERS.md`
- `.cursor`
- `Prototypes`
- `scripts`

**If your prototype lives outside UX-Projects:** Add **both** the existing prototype folder and the complete UX-Projects folder to the same Cursor workspace. Do not move the prototype manually. The skill shows the source and destination before importing anything.

---

## 3. Start a New Cursor Chat

After you receive or update UX-Projects, start a **new** Cursor chat so Cursor can discover the latest repository skills.

Type `@` and search for a skill. If your Cursor version shows repository skills through `/` instead, search for the same skill name there — it is the same step, not a different workflow.

---

## 4. Choose a Skill

| Situation | Skill |
|-----------|--------|
| Add or import a prototype, or create a new one | `@add-prototype` |
| Update, preview, publish, archive, restore, or diagnose a prototype already in UX-Projects | `@manage-prototype` |
| Not sure what to do | `@prototype-help` |

**`@add-prototype`** — imports an existing prototype or creates a new one.

```text
@add-prototype

Category: Patient or Provider
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

**`@manage-prototype`** — updates, previews, publishes, archives, restores, or diagnoses an existing prototype in UX-Projects.

```text
@manage-prototype

Prototype: <prototype name>
Action: Update, Preview, Publish, Archive, Restore, or Diagnose
```

**`@prototype-help`** — read-only guidance when you are unsure. It does not change, commit, push, or publish anything.

```text
@prototype-help

I am trying to: <describe what you need>
```

---

## 5. Recommended First Test

Paste this into a **new** Cursor chat to confirm the skills are available:

```text
@prototype-help

I am trying to: Confirm that the UX-Projects skills are available and explain which skill I should use to add my first prototype.
```

This test should give you guidance only. It should not change, commit, push, or publish anything.

---

## 6. Before Publishing

Before you approve publishing, confirm:

- The prototype name and project are correct
- **Patient** or **Provider** is correct
- The owner is correct
- Important screens, links, and interactions work
- Desktop and mobile layouts look acceptable
- The Prototype Hub card is correct
- All information is fictional or properly sanitized

**Cursor must show a local preview and receive your approval before committing or pushing.**

For the complete review workflow, see [Review and Publish](README.md#review-and-publish) in README.md.

---

## 7. If a Skill Does Not Appear

1. Confirm the complete **UX-Projects** folder is open.
2. Confirm `.cursor/skills` is present.
3. Start a **new** Cursor chat.
4. Search for the skill again.

If the skill still does not appear, paste this diagnostic prompt:

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

## 8. More Information

- [README.md](README.md) — complete contributor workflow, access rules, troubleshooting, and prototype organization
- [MAINTAINERS.md](MAINTAINERS.md) — technical reference, validation, deployment, and maintainer working agreements
