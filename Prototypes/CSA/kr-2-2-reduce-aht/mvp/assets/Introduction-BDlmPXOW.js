import{j as e}from"./jsx-runtime-DiklIkkE.js";import{useMDXComponents as r}from"./index-ChEI-nsM.js";import{M as s}from"./index-3R_Pq1Gc.js";import"./index-DRjF_FHU.js";import"./iframe-BRcY4Yfm.js";import"./index--7AeRQkE.js";import"./index-D-Mha1DF.js";import"./index-Bhqu_tAV.js";function t(i){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Introduction"}),`
`,e.jsx(n.h1,{id:"sierra--csa-handoff-panel-mvp",children:"Sierra — CSA Handoff Panel MVP"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Project:"})," KR-2-2 Reduce AHT  ·  ",e.jsx(n.strong,{children:"Script templates:"})," Pending SME sign-off (Taylor / Farra)"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-this-is",children:"What this is"}),`
`,e.jsxs(n.p,{children:[`When Sierra (the IVR AI) transfers a call to a live CSA advocate, it sends a structured
payload describing what it learned about the caller. The `,e.jsx(n.strong,{children:"Handoff Panel"}),` surfaces that
payload as a single actionable card in a right-rail sidebar — so the advocate has full
context the moment the call connects.`]}),`
`,e.jsxs(n.p,{children:["This Storybook contains ",e.jsx(n.strong,{children:"only the final designs"})," for developer handoff:"]}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Story"}),e.jsx("th",{children:"What it shows"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:"Handoff Panel"})," (S 01 – S 19)"]}),e.jsx("td",{children:"All 19 call-flow scenarios with the MVP panel"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("strong",{children:"Script Templates"})}),e.jsx("td",{children:'Complete branching logic for the "Suggested script" field'})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("strong",{children:"Introduction"})," (this page)"]}),e.jsx("td",{children:"Layout contract, data sources, implementation requirements"})]})]})]}),`
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
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Main content placeholder:"})," shows ",e.jsx(n.code,{children:'"Patient Search"'})," or ",e.jsx(n.code,{children:'"Patient Profile"'}),` depending on auth state.
The real implementation replaces this with the existing CSA Patient Search / Patient Profile pages.`]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"sierra-payload--panel-mapping",children:"Sierra payload → panel mapping"}),`
`,e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{width:"16rem"},children:"Payload field"}),e.jsx("th",{children:"Panel use"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"matchedPatient.firstName"})}),e.jsx("td",{children:"Header name; script greeting; auth chip"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"collectedFields.firstName"})}),e.jsx("td",{children:"Fallback name for script if patient not yet matched"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"collectedFields.dob"})}),e.jsx("td",{children:"DOB readback in retention script (MM/DD/YYYY format)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"authState"})}),e.jsxs("td",{children:["Auth chip; drives ",e.jsx("code",{children:"isMemberAuthenticated"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"consentStatus"})}),e.jsxs("td",{children:["Consent chip; blocks scheduling if ",e.jsx("code",{children:"declined"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'urgency === "emergency"'})}),e.jsx("td",{children:'Emergency card variant + "Crisis Protocol" CTA'})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"intent"})}),e.jsx("td",{children:"Title derivation; script branching"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visitReason.callerStatement"})}),e.jsx("td",{children:"Chief complaint in title + script"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"visitReason.suggestedServiceLine"})}),e.jsx("td",{children:"Service line title fallback"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"intentSummary"})}),e.jsx("td",{children:"Card body text (AI-generated one-liner)"})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:"interactionId"})," / ",e.jsx("code",{children:"tfn"})]}),e.jsx("td",{children:"Panel sub-header"})]})]})]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"implementation-requirements",children:"Implementation requirements"}),`
`,e.jsxs(n.h3,{id:"1-trigger--data-contract-informational--dev-requirement",children:["1. Trigger & Data Contract ",e.jsx(n.em,{children:"(informational — dev requirement)"})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Panel is populated by Sierra's handoff payload at call transfer time"}),`
`,e.jsx(n.li,{children:"All display strings (summary, script) arrive pre-populated — the panel renders, never derives"}),`
`,e.jsx(n.li,{children:"Payload schema and delivery SLA to be defined by Engineering / Sierra team"}),`
`]}),`
`,e.jsx(n.h3,{id:"2-caller-identity",children:"2. Caller Identity"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'Display patient name when matched; collected fields when partially captured; "Unknown caller" when neither'}),`
`,e.jsx(n.li,{children:"Caregiver proxy: patient shown is the dependent — summary must make clear the caller is the parent/guardian, not the patient"}),`
`,e.jsx(n.li,{children:"Always show: TFN, Call ID"}),`
`]}),`
`,e.jsx(n.h3,{id:"3-authentication-status",children:"3. Authentication Status"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Two states only: ",e.jsx(n.strong,{children:"Authenticated"})," · ",e.jsx(n.strong,{children:"Not authenticated"})]}),`
`,e.jsx(n.li,{children:"Spanish-speaking callers are classified as Not authenticated (language-routed, no IVR auth)"}),`
`,e.jsx(n.li,{children:"Spanish context is conveyed through the handoff card content, not a separate chip"}),`
`]}),`
`,e.jsx(n.h3,{id:"4-consent-status",children:"4. Consent Status"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Three states: ",e.jsx(n.strong,{children:"Accepted"})," · ",e.jsx(n.strong,{children:"Declined"})," · ",e.jsx(n.strong,{children:"Not Read"})]}),`
`,e.jsx(n.li,{children:"Not Read covers cases where Sierra did not present consent (pharmacy, Spanish-routed, retention callers)"}),`
`]}),`
`,e.jsx(n.h3,{id:"5-handoff-card--visual-severity",children:"5. Handoff Card — Visual Severity"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Emergency:"})," emergency urgency signal or mental health crisis intent"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error:"})," Consent Declined + scheduling intent (booking is blocked)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Warning:"})," Not authenticated, or Consent Declined + non-scheduling intent"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Neutral:"})," Authenticated + Consent Accepted, or consent Not Read on a non-blocking caller type"]}),`
`,e.jsx(n.li,{children:"Worst state between auth and consent wins"}),`
`]}),`
`,e.jsx(n.h3,{id:"6-handoff-card--summary",children:"6. Handoff Card — Summary"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"1–2 sentences describing why the caller is calling, in plain language"}),`
`,e.jsx(n.li,{children:"Generated and populated by Sierra before handoff — rendered as-is, read-only, not editable by the agent for MVP"}),`
`,e.jsx(n.li,{children:"Should include: intent, chief complaint or key context, service line if confident"}),`
`,e.jsx(n.li,{children:"Fallback when Sierra cannot generate: generic label from intent type"}),`
`]}),`
`,e.jsx(n.h3,{id:"7-suggested-script--templates",children:"7. Suggested Script & Templates"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"First line the agent reads aloud when they pick up"}),`
`,e.jsx(n.li,{children:"Sierra selects the template and populates variables — deterministic, not LLM-generated per call"}),`
`,e.jsxs(n.li,{children:["Variables drawn from payload: ",e.jsx(n.code,{children:"{firstName}"}),", ",e.jsx(n.code,{children:"{patientName}"}),", ",e.jsx(n.code,{children:"{chiefComplaint}"}),", ",e.jsx(n.code,{children:"{serviceLine}"}),", etc."]}),`
`,e.jsx(n.li,{children:"Template library proposed by this team (WIP), refined and approved with Taylor and Farra"}),`
`,e.jsxs(n.li,{children:["One template per scenario type — caller type, intent, auth state, consent state, and service line all influence template selection:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Behavioral health:"})," warm, non-clinical tone — distinct from standard booking script"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Consent declined + scheduling:"})," acknowledges the block, does not offer to book"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Billing inquiry:"})," references the billing question specifically"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Caregiver proxy:"})," addresses the parent, references child by name"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Spanish-speaking:"})," script delivered in Spanish"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Retention / caller requested live agent:"})," acknowledges they wanted a person, not the IVR"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Emergency / crisis:"})," immediate, grounding language"]}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:"If Sierra sends no script: script block is omitted — no fallback fabrication"}),`
`,e.jsx(n.li,{children:'Clearly labeled "Suggested script" so the agent knows it is AI-assisted'}),`
`]}),`
`,e.jsx(n.h3,{id:"8-caller-types",children:"8. Caller Types"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Member — standard flow"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Member — prescription / refill:"})," member calling for their own medication refill; no caregiver involvement; script references the medication or refill request if captured in the payload"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Member — prescription inquiry:"})," member with general questions about prescriptions, coverage, or pharmacy access; non-booking intent; consent Not Read"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Caregiver proxy:"})," parent/guardian calling for a minor; script addresses the parent, patient shown is the child"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Pharmacy / provider:"})," calling on behalf of a patient; consent Not Read; script references patient by name"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Spanish-speaking:"})," language-routed, no auth or consent captured; script in Spanish"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Unknown / live agent request:"})," no identity, no auth; agent asked to speak to a person"]}),`
`]}),`
`,e.jsx(n.h3,{id:"9-intent-types",children:"9. Intent Types"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Schedule care"})," — primary care, urgent care, behavioral health, wellness"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Billing inquiry"})," — non-scheduling; Consent Declined is non-blocking"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Dermatology inquiry"})," — informational, not a booking request"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Prescription / refill"})," — non-scheduling; member calling for their own medication"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Caller requested live agent"})," — bypassed or exited the IVR to reach a person; no visit reason, no auth collected"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Emergency / mental health crisis"})," — overrides all other states; Crisis Protocol always visible"]}),`
`]}),`
`,e.jsx(n.h3,{id:"10-agent-landing-state",children:"10. Agent Landing State"}),`
`,e.jsx(n.p,{children:"Defines where the agent is navigated in the CSA platform based on handoff context — the panel informs this but does not control it:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Authenticated"})," → lands on Patient Profile"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Not authenticated"})," → lands on Patient Search with IVR-collected fields pre-populated and search already run; agent selects the correct match manually"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Multi-account"})," → lands on Patient Search; agent selects the correct affiliation manually"]}),`
`,e.jsx(n.li,{children:"Existing platform operations (intake, consent process, crisis protocol) are not in scope — the panel informs status only"}),`
`]}),`
`,e.jsx(n.h3,{id:"11-panel-dismissal--persistence",children:"11. Panel Dismissal & Persistence"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Right rail only"}),`
`,e.jsx(n.li,{children:"Can be collapsed and reopened by the agent at any time"}),`
`,e.jsx(n.li,{children:"Persistent across navigation — available regardless of where the agent is in the CSA platform during an active call"}),`
`,e.jsx(n.li,{children:"Clear button removes the patient context from the panel and navigates the agent to the default home state — it does not end the call"}),`
`]}),`
`,e.jsx(n.h3,{id:"12-empty--dropped-call-state",children:"12. Empty / Dropped Call State"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Panel starts empty when the call dropped before Sierra completed handoff"}),`
`,e.jsx(n.li,{children:"Agent enters a Call ID manually to restore the session"}),`
`,e.jsx(n.li,{children:"Restored session displays the same panel as a normal handoff"}),`
`]}),`
`,e.jsx(n.h3,{id:"13-helpfulness-rating",children:"13. Helpfulness Rating"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"Was this helpful?" thumbs up / thumbs down control appears below the handoff card once a payload is loaded'}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Thumbs up:"}),' closes the rating UI and shows a brief "Thanks for your feedback!" confirmation']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Thumbs down:"}),' reveals an optional free-text field ("What could go better?") with a Submit button']}),`
`,e.jsx(n.li,{children:"Rating resets when the panel is cleared (new call / new interaction ID)"}),`
`,e.jsx(n.li,{children:"Rating and feedback are submitted per interaction, keyed to the interaction ID"}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"⚠️ Backend endpoint not yet defined — requires engineering ticket (Camille)"})}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"what-the-main-content-placeholder-represents",children:"What the main content placeholder represents"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"[Patient Search]"})," / ",e.jsx(n.code,{children:"[Patient Profile]"}),` text in these stories is a single placeholder
line. In production:`]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Patient Search"})," → the existing Patient Search page (unauthenticated or no payload state)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Patient Profile"})," → the existing Patient Profile page (authenticated member confirmed)"]}),`
`]}),`
`,e.jsx(n.p,{children:`The handoff panel is independent of the main content; it should mount and work without
changes to the existing Patient Search / Profile pages.`})]})}function p(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{p as default};
