# Designer Input Template

Copy into Cursor chat when invoking **Add Prototype**:

```text
@add-prototype

Category: <Patient or Provider>
Project: <project name>
Prototype title: <prototype title>
Owner: <person or team>
```

Cursor looks for an existing prototype in the workspace. If it finds one, it copies the approved files into Product Repository and leaves the original folder unchanged. If it does not find one, it asks for one short description and creates a new prototype.

Optional details, only if helpful:

```text
Status: <defaults to Draft>
Description: <Cursor can derive this>
Existing prototype location: <Cursor will try to detect this automatically>
```
