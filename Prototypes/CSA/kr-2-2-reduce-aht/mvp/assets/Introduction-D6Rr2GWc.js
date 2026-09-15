import{j as e}from"./jsx-runtime-DiklIkkE.js";import{useMDXComponents as r}from"./index-ChEI-nsM.js";import{M as s}from"./index-Y79_S9MA.js";import"./index-DRjF_FHU.js";import"./iframe-DGfQtBvM.js";import"./index--7AeRQkE.js";import"./index-D-Mha1DF.js";import"./index-Bhqu_tAV.js";function t(i){const n={code:"code",h1:"h1",h2:"h2",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Introduction"}),`
`,e.jsx(n.h1,{id:"sierra-screenpop--csa-handoff-panel-v2",children:"Sierra Screenpop — CSA Handoff Panel v2"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Project:"}),` KR-2-2 Reduce AHT
`,e.jsx(n.strong,{children:"Status:"})," Design review — pending SME sign-off (Taylor / Farra)"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-this-is",children:"What this is"}),`
`,e.jsxs(n.p,{children:[`When Sierra (the IVR AI) transfers a call to a live CSA advocate, it sends a structured
payload describing what it learned about the caller. The `,e.jsx(n.strong,{children:"Handoff Panel"}),` surfaces that
payload as a single actionable card in a right-rail sidebar — so the advocate has full
context the moment the call connects.`]}),`
`,e.jsxs(n.p,{children:["This Storybook contains ",e.jsx(n.strong,{children:"only the final designs"})," for developer handoff:"]}),`
`,e.jsxs(n.p,{children:[`| Story | What it shows |
|---|---|
| `,e.jsx(n.strong,{children:"Handoff Panel — All Scenarios"}),` | All 19 call-flow scenarios with the V2 panel |
| `,e.jsx(n.strong,{children:"Script Templates"}),` | Complete branching logic for the "Suggested script" field |
| `,e.jsx(n.strong,{children:"Introduction"})," (this page) | Layout contract, data sources, open decisions |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"layout-contract",children:"Layout contract"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`┌─────────────────────────────────────────────────────┐
│  [Scenario bar — dev review only, strip before ship] │
├──────────────────────────────────┬──────────────────┤
│                                  │  Sierra Handoff  │
│   Main content                   │                  │
│   (Patient Search / Profile)     │  [card]          │
│                                  │  AI generated ✦  │
│                                  │  Was this help-  │
│                                  │  ful? 👍 👎       │
│                                  │──────────────────│
│                                  │  [Clear]         │
└──────────────────────────────────┴──────────────────┘
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Right rail width:"})," 400 px (fixed)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Rail appears:"})," animated slide-in ~400 ms after payload arrives"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Rail hides:"}),' slide-out on "Clear" (call ended)']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Main content placeholder:"})," shows ",e.jsx(n.code,{children:'"Patient Search"'})," or ",e.jsx(n.code,{children:'"Patient Profile"'}),` label depending on auth state.
The real implementation replaces this with the existing CSA Patient Search / Patient Profile pages.`]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"sierra-payload--panel-mapping",children:"Sierra payload → panel mapping"}),`
`,e.jsxs(n.p,{children:[`| Payload field | Panel use |
|---|---|
| `,e.jsx(n.code,{children:"matchedPatient.firstName"}),` | Header name; script greeting; auth chip |
| `,e.jsx(n.code,{children:"collectedFields.firstName"}),` | Fallback name for script if patient not yet matched |
| `,e.jsx(n.code,{children:"collectedFields.dob"}),` | DOB readback in retention script (MM/DD/YYYY format) |
| `,e.jsx(n.code,{children:"authState"})," | Auth chip; drives ",e.jsx(n.code,{children:"isMemberAuthenticated"}),` |
| `,e.jsx(n.code,{children:"consentStatus"})," | Consent chip; blocks scheduling if ",e.jsx(n.code,{children:"declined"}),` |
| `,e.jsx(n.code,{children:'urgency === "emergency"'}),` | Emergency card variant + "Crisis Protocol" CTA |
| `,e.jsx(n.code,{children:"intent"}),` | Title derivation; script branching |
| `,e.jsx(n.code,{children:"visitReason.callerStatement"}),` | Chief complaint in title + script |
| `,e.jsx(n.code,{children:"visitReason.suggestedServiceLine"}),` | Service line title fallback |
| `,e.jsx(n.code,{children:"intentSummary"}),` | Card body text (AI-generated one-liner) |
| `,e.jsx(n.code,{children:"interactionId"})," / ",e.jsx(n.code,{children:"tfn"})," | Panel sub-header |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"open-decisions",children:"Open decisions"}),`
`,e.jsx(n.p,{children:`| # | Decision | Owner |
|---|---|---|
| D-1 | SME sign-off on all 19 script templates | Taylor / Farra |
| D-2 | Exact copy for "Was this helpful?" submit confirmation | Content |
| D-3 | Crisis Protocol CTA — destination / flow | Clinical + Product |
| D-4 | "Clear" vs "Call ended" label | UX |`}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-the-main-content-placeholder-represents",children:"What the main content placeholder represents"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"[Patient Search]"})," / ",e.jsx(n.code,{children:"[Patient Profile]"}),` text in these stories is a single placeholder
line. In production:`]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Patient Search"})," → the existing Patient Search page (unauthenticated or no payload state)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Patient Profile"})," → the existing Patient Profile page (authenticated member confirmed)"]}),`
`]}),`
`,e.jsx(n.p,{children:`The handoff panel is independent of the main content; it should mount and work without
changes to the existing Patient Search / Profile pages.`})]})}function j(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{j as default};
