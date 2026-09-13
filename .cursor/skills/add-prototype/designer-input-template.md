# Add Prototype — Contributor Input Template

Copy into a **new** Cursor chat when adding a prototype:

```text
@add-prototype

Category: <Patient or Provider>
Project: <project name>
Prototype title: <prototype title>
Owner: <your name or team>
```

The skill is already included in UX-Projects. Open the complete repository folder in Cursor. After you receive or update to the latest UX-Projects files, start a **new** Cursor chat so Cursor discovers `@add-prototype`, `@manage-prototype`, and `@prototype-help`.

Cursor looks for an existing prototype in the workspace. If it finds one, it copies the approved files into Prototype Hub and leaves the original folder unchanged. If it does not find one, it asks for one short description and creates a new prototype.

Optional details, only if helpful:

```text
Status: <defaults to Draft>
Description: <Cursor can derive this>
```

If `@add-prototype` does not appear, use `@prototype-help` or the diagnostic prompt in [README.md](../../../README.md#if-add-prototype-does-not-appear).
