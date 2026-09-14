# Manage Prototype — Contributor Input Template

Copy into a **new** Cursor chat when working with an existing prototype. After updating UX-Projects, start a new chat so Cursor discovers the latest skills.

You can also use **Manage** in Prototype Hub to fill one form, review a combined change summary, and copy one prompt. Prototype Hub does not edit repository files directly.

```text
@manage-prototype

Prototype: <prototype name>
Action: Update, Preview, Publish, Archive, Restore, or Diagnose
```

## Combined status and tag update

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

## Add and remove tags in one request

```text
@manage-prototype

Prototype: <prototype name>
Action: Update

Make these changes:

- Add these tags:
  - mobile
- Remove these tags:
  - playground

Preserve all unrelated prototype content and metadata.

Show the proposed changes and updated Prototype Hub card in a local preview before committing or pushing.
```

## Other detail update

```text
@manage-prototype

Prototype: <prototype name>
Action: Update

Make these changes:

- Update other prototype details based on this request:
  Update the description to reflect the latest review feedback.

Preserve all unrelated prototype content and metadata.

Show the proposed changes and updated Prototype Hub card in a local preview before committing or pushing.
```

## Archive (separate request)

Submit Archive alone. Do not combine it with status, tag, or other metadata changes.

```text
@manage-prototype

Prototype: <prototype name>
Action: Archive

Explain what archiving will do, validate the change, and show the updated Prototype Hub preview before committing or pushing.
```

## Restore

```text
@manage-prototype

Prototype: <prototype name>
Action: Restore

Restore this prototype with status Testing.

Help me validate the change and show the updated Prototype Hub preview before committing or pushing.
```

## Diagnose

```text
@manage-prototype

Prototype: <prototype name>
Action: Diagnose

I am experiencing:
The prototype card appears in Prototype Hub, but Open Prototype returns a 404.

Inspect first without changing files. Explain the issue in plain language and show the safest proposed next step.
```

## Other actions

**Preview** — open local previews without publishing.

**Publish** — publish approved local changes after review.

If you are unsure which skill to use, start with `@prototype-help`.
