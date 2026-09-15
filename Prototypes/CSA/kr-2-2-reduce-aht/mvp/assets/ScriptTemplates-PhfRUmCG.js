import{j as e}from"./jsx-runtime-DiklIkkE.js";import{useMDXComponents as a}from"./index-ChEI-nsM.js";import{M as o}from"./index-Y79_S9MA.js";import"./index-DRjF_FHU.js";import"./iframe-DGfQtBvM.js";import"./index--7AeRQkE.js";import"./index-D-Mha1DF.js";import"./index-Bhqu_tAV.js";function i(t){const n={code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",strong:"strong",...a(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Script Templates"}),`
`,e.jsx(n.h1,{id:"suggested-script--branching-logic",children:"Suggested Script — Branching Logic"}),`
`,e.jsx(n.p,{children:`The "Suggested script" field in the handoff card is generated from the Sierra payload at
transfer time. This page documents every branch so SMEs can review and update the copy.`}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"See the live panel"})," in the ",e.jsx(n.strong,{children:"Handoff Panel — All Scenarios"})," story for rendered output."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"branch-map",children:"Branch map"}),`
`,e.jsx(n.p,{children:"Branches are evaluated top-to-bottom; first match wins."}),`
`,e.jsxs(n.p,{children:[`| # | Condition | Script template | Card |
|---|---|---|---|
| — | `,e.jsx(n.code,{children:'urgency === "emergency"'})," AND name known | ",e.jsx(n.code,{children:`"[firstName], I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`}),` | Emergency |
| — | `,e.jsx(n.code,{children:'urgency === "emergency"'})," AND name unknown | ",e.jsx(n.code,{children:`"I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?"`}),` | Emergency |
| — | `,e.jsx(n.code,{children:'intent === "retention_attempt"'})," AND intent + name + DOB known | ",e.jsx(n.code,{children:'"Hi [firstName], thanks for staying on the line. I see you were calling about [topic] — I just need to confirm your date of birth as [MM/DD/YYYY], and then I can help you right away."'}),` | Varies |
| — | `,e.jsx(n.code,{children:'intent === "retention_attempt"'})," AND intent + name known | ",e.jsx(n.code,{children:`"Hi [firstName], thanks for staying on the line. I see you were calling about [topic] — I'm a live agent and I'm here to help with that."`}),` | Varies |
| — | `,e.jsx(n.code,{children:'intent === "retention_attempt"'})," AND intent only known | ",e.jsx(n.code,{children:`"Hi, thanks for staying on the line. I see you were calling about [topic] — I'm a live agent and I'm here to help with that. Could I get your name?"`}),` | Varies |
| — | `,e.jsx(n.code,{children:'intent === "retention_attempt"'})," AND nothing known | ",e.jsx(n.code,{children:`"Hi, thanks for staying on the line. I know our automated system wasn't quite what you needed — I'm a live agent and I'm here to help. What's going on today?"`}),` | Varies |
| — | `,e.jsx(n.code,{children:'callerType === "spanish_member"'})," | ",e.jsx(n.code,{children:'"Hola, gracias por llamar. ¿En qué le puedo ayudar hoy?"'}),` | Auth |
| — | `,e.jsx(n.code,{children:'callerType === "pharmacy"'})," AND member authenticated | ",e.jsx(n.code,{children:`"Hi, thanks for holding. I understand you're calling on behalf of [patientName] — how can I help you today?"`}),` | Auth |
| — | `,e.jsx(n.code,{children:'callerType === "pharmacy"'})," AND member not authenticated | ",e.jsx(n.code,{children:`"Hi, thanks for holding. I understand you're calling on behalf of a patient. I'll need to verify the patient's information — I have [fields] — is that correct?"`}),` | Not-auth |
| — | `,e.jsx(n.code,{children:'callerType === "caregiver_proxy"'})," AND chief complaint known | ",e.jsx(n.code,{children:`"Hi, thanks for holding. I understand you're calling on behalf of [patientName] for a [chiefComplaint] — let me help you get that booked."`}),` | Varies |
| — | `,e.jsx(n.code,{children:'callerType === "caregiver_proxy"'})," AND no chief complaint | ",e.jsx(n.code,{children:`"Hi, thanks for holding. I understand you're calling on behalf of [patientName] — how can I help you today?"`}),` | Varies |
| — | Consent declined + scheduling intent | `,e.jsx(n.code,{children:`"Hi [firstName], thanks for holding. I see you're calling about a [chiefComplaint] visit — I do need to let you know that without your consent to our service agreement, I'm unable to book an appointment. Would you like me to walk you through the consent process now?"`}),` | Emergency (blocked) |
| — | `,e.jsx(n.code,{children:'intent === "billing_inquiry"'})," AND authenticated | ",e.jsx(n.code,{children:`"Hi [firstName], thanks for holding. I understand you have a question about your billing — I'm happy to help. What would you like to know?"`}),` | Auth |
| — | Dermatology inquiry AND authenticated | `,e.jsx(n.code,{children:'"Hi [firstName], thanks for holding. I understand you have some questions about dermatology — what would you like to know?"'}),` | Auth |
| — | Behavioral health AND authenticated | `,e.jsx(n.code,{children:`"Hi [firstName], thanks for holding. I understand you're looking to schedule a behavioral health appointment — I'm here to help you get that set up."`}),` | Auth |
| — | Authenticated AND chief complaint known | `,e.jsx(n.code,{children:`"Hi [firstName], thanks for holding. I understand you're calling about needing a visit to take care of your [chiefComplaint] — a call with one of our next available providers could help. Does that sound right?"`}),` | Auth |
| — | Authenticated AND no chief complaint | `,e.jsx(n.code,{children:'"Hi [firstName], thanks for holding. How can I help you today?"'}),` | Auth |
| — | Not authenticated (default verify) | `,e.jsx(n.code,{children:'"Hi [firstName], I see you need help with your [chiefComplaint], I would just need to double check your information, I have [fields] — is this correct?"'})," | Not-auth |"]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"scenario-reference",children:"Scenario reference"}),`
`,e.jsx(n.p,{children:"All 19 test scenarios mapped to their script branch:"}),`
`,e.jsxs(n.p,{children:[`| # | Scenario label | Script branch |
|---|---|---|
| 1 | Schedule visit · authenticated | Authenticated + chief complaint |
| 2 | Schedule visit · not authenticated · name mismatch | Not authenticated (verify fields) |
| 3 | Multiple accounts · not authenticated | Not authenticated (verify fields) |
| 4 | Spanish-speaking member · authenticated | Spanish caller |
| 5 | Caregiver proxy · parent calling for minor child | Caregiver proxy |
| 6 | Consent declined · scheduling blocked | Consent blocked |
| 7 | Consent declined · billing inquiry (not blocked) | Billing inquiry + authenticated |
| 8 | Pharmacy on behalf of patient · authenticated | Pharmacy + authenticated |
| 9 | Pharmacy on behalf of patient · not authenticated | Pharmacy + not authenticated |
| 10 | Dermatology inquiry · authenticated | Dermatology inquiry + authenticated |
| 11 | Dermatology inquiry · not authenticated | Not authenticated (inquiry verify) |
| 12 | Behavioral health scheduling · authenticated | Behavioral health + authenticated |
| 13 | Retention · caller wanted to disconnect · no identity | Retention — nothing known |
| 14 | Mental health crisis · no identity known | Emergency — name unknown |
| 15 | Dropped call · panel starts in idle state | `,e.jsx(n.em,{children:"(no script — panel shows Call ID lookup)"}),` |
| 16 | Retention · intent captured · name/DOB not collected | Retention — intent only |
| 17 | Retention · intent + name captured · DOB not collected | Retention — intent + name |
| 18 | Retention · intent + name + DOB captured | Retention — intent + name + DOB |
| 19 | Mental health crisis · name captured · not authenticated | Emergency — name known |`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"variable-key",children:"Variable key"}),`
`,e.jsxs(n.p,{children:[`| Variable | Source |
|---|---|
| `,e.jsx(n.code,{children:"[firstName]"})," | ",e.jsx(n.code,{children:"matchedPatient.firstName"})," → fallback: ",e.jsx(n.code,{children:"collectedFields.firstName"})," → fallback: ",e.jsx(n.code,{children:'"there"'}),` |
| `,e.jsx(n.code,{children:"[patientName]"})," | ",e.jsx(n.code,{children:"matchedPatient.firstName + lastName"})," → fallback: ",e.jsx(n.code,{children:'"the patient"'})," / ",e.jsx(n.code,{children:'"your child"'}),` |
| `,e.jsx(n.code,{children:"[chiefComplaint]"})," | ",e.jsx(n.code,{children:"visitReason.callerStatement"}),` (lower-cased, period stripped) |
| `,e.jsx(n.code,{children:"[topic]"})," | ",e.jsx(n.code,{children:"chiefComplaint"})," → fallback: ",e.jsx(n.code,{children:"SERVICE_LINE_TITLES[suggestedServiceLine]"}),` |
| `,e.jsx(n.code,{children:"[fields]"})," | Joined list of: name, ",e.jsx(n.code,{children:"DOB as MM/DD/YYYY"}),", ",e.jsx(n.code,{children:"Phone as XXX-XXX-XXXX"}),` |
| `,e.jsx(n.code,{children:"[MM/DD/YYYY]"})," | ",e.jsx(n.code,{children:"collectedFields.dob"})," formatted as month/day/year |"]})]})}function p(t={}){const{wrapper:n}={...a(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{p as default};
