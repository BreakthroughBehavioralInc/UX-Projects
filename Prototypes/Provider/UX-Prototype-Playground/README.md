# UX Prototype Playground

**The UX Avengers** — A static prototype showcase for testing GitHub repository sharing, UX prototype hosting, stakeholder reviews, navigation, JavaScript functionality, responsive design, and project organization.

> Making forms less terrible since 2026.

---

## Purpose

This project serves as a **reference implementation** and **playground** for the UX team's prototype hosting workflow. It demonstrates how interactive UX prototypes can be organized, shared via GitHub, and presented to stakeholders in a polished, accessible format — without requiring frameworks, build tools, or external dependencies.

Use it to:

- Test GitHub Pages deployment and repository sharing
- Showcase UX prototypes to stakeholders
- Validate navigation patterns and responsive layouts
- Demonstrate JavaScript interactivity (modals, search, forms, dark mode)
- Establish a scalable folder structure for future prototypes

---

## Folder Structure

```
UX-Prototype-Playground/
├── index.html              # Home page — hero, stats, UX generator
├── about.html              # Team profiles — The UX Avengers
├── projects.html           # Project showcase with search and modals
├── contact.html            # Stakeholder request form
│
├── css/
│   └── styles.css          # All styles including dark mode
│
├── js/
│   └── app.js              # Theme, counters, generator, projects, forms
│
├── assets/
│   ├── images/             # Project thumbnails and team avatars (SVG)
│   ├── icons/              # Logo, theme toggle icons (SVG)
│   └── illustrations/      # Hero illustration (SVG)
│
├── data/
│   └── projects.json       # Project metadata (single source of truth)
│
└── README.md
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Responsive design** | Optimized for desktop, tablet, and mobile |
| **Dark mode** | Toggle with preference saved to `localStorage` |
| **Animated counters** | Statistics count up when scrolled into view |
| **UX Generator** | Random "Fix The User Experience" messages |
| **Project showcase** | Cards loaded from `projects.json` with status pills and tags |
| **Project search** | Filter projects by name, tag, or status |
| **Project modals** | Detailed view on "View Prototype" click |
| **Contact form** | Validated mock form with inline success message |
| **SVG assets** | All images are self-contained SVGs — no external URLs |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigation |

---

## How To Run Locally

Because this is a static site with no build step, you can open it directly — but **Projects page requires a local server** (due to `fetch` loading `projects.json`).

### Option 1: Python (recommended)

```bash
cd Prototypes/Provider/UX-Prototype-Playground
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

### Option 2: Node.js

```bash
npx serve Prototypes/Provider/UX-Prototype-Playground
```

### Option 3: VS Code / Cursor

Use the **Live Server** extension and open `index.html`.

---

## Future GitHub Deployment Instructions

### GitHub Pages (Project Site)

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select your branch (e.g. `main`)
4. Set the folder to `/Prototypes/Provider/UX-Prototype-Playground` (or move the project to root)
5. Save — your site will be available at:
   `https://<org>.github.io/<repo>/Prototypes/Provider/UX-Prototype-Playground/`

### GitHub Pages (Root Site)

If you want the playground at the repo root URL:

1. Move contents of `UX-Prototype-Playground/` to the repository root, **or**
2. Configure Pages to serve from `/docs` and copy the project there

### Custom Domain (optional)

Add a `CNAME` file and configure DNS per [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## How To Add New Prototypes

### 1. Add project data

Edit `data/projects.json` and add a new entry:

```json
{
  "id": "my-new-project",
  "title": "My New Project",
  "description": "Short card description.",
  "longDescription": "Full description for the modal.",
  "tags": ["Tag One", "Tag Two"],
  "status": "In Progress",
  "statusClass": "status-progress",
  "image": "assets/images/project-my-new.svg",
  "stakeholders": ["Team A", "Team B"],
  "timeline": "Q1 2027",
  "impact": "Expected impact statement."
}
```

**Status classes:** `status-review`, `status-progress`, `status-discovery`, `status-shipped`

### 2. Add a thumbnail image

Create an SVG placeholder at `assets/images/project-my-new.svg` (copy an existing project SVG as a template).

### 3. (Optional) Add a dedicated prototype folder

For interactive prototypes with multiple pages:

```
UX-Prototype-Playground/
└── prototypes/
    └── my-new-project/
        ├── index.html
        ├── css/
        └── js/
```

Link to it from the modal or add a `prototypeUrl` field in `projects.json` and update `app.js` to render a link.

### 4. Update the contact form

Add the new project to the **Project** dropdown in `contact.html`.

### 5. Test locally

Run a local server and verify the new card appears, search works, and the modal displays correctly.

---

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks or dependencies
- **System fonts** — No external font or asset dependencies

---

## License

Internal UX team use. © 2026 The UX Avengers.
