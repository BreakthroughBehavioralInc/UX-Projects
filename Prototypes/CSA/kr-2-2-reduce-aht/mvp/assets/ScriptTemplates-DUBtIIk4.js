import{j as e}from"./jsx-runtime-DiklIkkE.js";import{useMDXComponents as i}from"./index-ChEI-nsM.js";import{M as a}from"./index-Cxmf17kN.js";import"./index-DRjF_FHU.js";import"./iframe-D0y8tgpt.js";import"./index--7AeRQkE.js";import"./index-D-Mha1DF.js";import"./index-Bhqu_tAV.js";function o(t){const n={code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",p:"p",strong:"strong",...i(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Script Templates"}),`
`,e.jsx(n.h1,{id:"script-templates",children:"Script Templates"}),`
`,e.jsxs(n.p,{children:[`The "Suggested script" field is generated from the Sierra payload at transfer time.
Branches are evaluated top-to-bottom; `,e.jsx(n.strong,{children:"first match wins."})]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"SME review:"})," Taylor / Farra — confirm copy is accurate before developer implementation."]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"branch-map",children:"Branch map"}),`
`,e.jsxs(n.p,{children:[`| # | Condition | Suggested script |
|---|---|---|
| 1 | Emergency — name known | "`,e.jsx(n.strong,{children:"[firstName]"}),`, I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?" |
| 2 | Emergency — name unknown | "I understand this may be an emergency — I'm here with you right now. Can you tell me what's happening?" |
| 3 | Retention — intent + name + DOB known | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),", thanks for staying on the line. I see you were calling about ",e.jsx(n.strong,{children:"[topic]"})," — I just need to confirm your date of birth as ",e.jsx(n.strong,{children:"[MM/DD/YYYY]"}),`, and then I can help you right away." |
| 4 | Retention — intent + name known | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),", thanks for staying on the line. I see you were calling about ",e.jsx(n.strong,{children:"[topic]"}),` — I'm a live agent and I'm here to help with that." |
| 5 | Retention — intent only known | "Hi, thanks for staying on the line. I see you were calling about `,e.jsx(n.strong,{children:"[topic]"}),` — I'm a live agent and I'm here to help with that. Could I get your name?" |
| 6 | Retention — nothing known | "Hi, thanks for staying on the line. I know our automated system wasn't quite what you needed — I'm a live agent and I'm here to help. What's going on today?" |
| 7 | Spanish-speaking caller | "Hola, gracias por llamar. ¿En qué le puedo ayudar hoy?" |
| 8 | Pharmacy — member authenticated | "Hi, thanks for holding. I understand you're calling on behalf of `,e.jsx(n.strong,{children:"[patientName]"}),` — how can I help you today?" |
| 9 | Pharmacy — member not authenticated | "Hi, thanks for holding. I understand you're calling on behalf of a patient. I'll need to verify the patient's information — I have `,e.jsx(n.strong,{children:"[fields]"}),` — is that correct?" |
| 10 | Caregiver proxy — chief complaint known | "Hi, thanks for holding. I understand you're calling on behalf of `,e.jsx(n.strong,{children:"[patientName]"})," for a ",e.jsx(n.strong,{children:"[chiefComplaint]"}),` — let me help you get that booked." |
| 11 | Caregiver proxy — no chief complaint | "Hi, thanks for holding. I understand you're calling on behalf of `,e.jsx(n.strong,{children:"[patientName]"}),` — how can I help you today?" |
| 12 | Consent declined — scheduling intent | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),", thanks for holding. I see you're calling about a ",e.jsx(n.strong,{children:"[chiefComplaint]"}),` visit — I do need to let you know that without your consent to our service agreement, I'm unable to book an appointment. Would you like me to walk you through the consent process now?" |
| 13 | Billing inquiry — authenticated | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),`, thanks for holding. I understand you have a question about your billing — I'm happy to help. What would you like to know?" |
| 14 | Dermatology inquiry — authenticated | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),`, thanks for holding. I understand you have some questions about dermatology — what would you like to know?" |
| 15 | Behavioral health — authenticated | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),`, thanks for holding. I understand you're looking to schedule a behavioral health appointment — I'm here to help you get that set up." |
| 16 | Authenticated — chief complaint known | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),", thanks for holding. I understand you're calling about needing a visit to take care of your ",e.jsx(n.strong,{children:"[chiefComplaint]"}),` — a call with one of our next available providers could help. Does that sound right?" |
| 17 | Authenticated — no chief complaint | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),`, thanks for holding. How can I help you today?" |
| 18 | Not authenticated (default) | "Hi `,e.jsx(n.strong,{children:"[firstName]"}),", I see you need help with your ",e.jsx(n.strong,{children:"[chiefComplaint]"})," — I just need to double-check your information. I have ",e.jsx(n.strong,{children:"[fields]"}),' — is this correct?" |']}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"scenario--branch-reference",children:"Scenario → branch reference"}),`
`,e.jsxs(n.p,{children:[`| Scenario | Label | Branch |
|---|---|---|
| 1 | Schedule visit — authenticated | 16 · Authenticated + chief complaint |
| 2 | Schedule visit — not authenticated (name mismatch) | 18 · Not authenticated |
| 3 | Multiple accounts — not authenticated | 18 · Not authenticated |
| 4 | Spanish-speaking — authenticated | 7 · Spanish caller |
| 5 | Caregiver proxy — minor child | 10 · Caregiver proxy + complaint |
| 6 | Consent declined — scheduling blocked | 12 · Consent blocked |
| 7 | Consent declined — billing inquiry | 13 · Billing inquiry |
| 8 | Pharmacy — authenticated | 8 · Pharmacy + authenticated |
| 9 | Pharmacy — not authenticated | 9 · Pharmacy + not authenticated |
| 10 | Dermatology inquiry — authenticated | 14 · Dermatology |
| 11 | Dermatology inquiry — not authenticated | 18 · Not authenticated |
| 12 | Behavioral health — authenticated | 15 · Behavioral health |
| 13 | Retention — caller wanted to disconnect, no identity | 6 · Retention, nothing known |
| 14 | Mental health crisis — no identity known | 2 · Emergency, name unknown |
| 15 | Dropped call — Call ID lookup | `,e.jsx(n.em,{children:"(no script — panel shows Call ID lookup state)"}),` |
| 16 | Retention — intent captured, name/DOB not collected | 5 · Retention, intent only |
| 17 | Retention — intent + name, DOB not collected | 4 · Retention, intent + name |
| 18 | Retention — intent + name + DOB captured | 3 · Retention, intent + name + DOB |
| 19 | Mental health crisis — name captured, not authenticated | 1 · Emergency, name known |`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h2,{id:"variable-key",children:"Variable key"}),`
`,e.jsxs(n.p,{children:[`| Variable | Source |
|---|---|
| `,e.jsx(n.code,{children:"[firstName]"})," | ",e.jsx(n.code,{children:"matchedPatient.firstName"})," → ",e.jsx(n.code,{children:"collectedFields.firstName"})," → ",e.jsx(n.code,{children:'"there"'}),` |
| `,e.jsx(n.code,{children:"[patientName]"})," | ",e.jsx(n.code,{children:"matchedPatient.firstName + lastName"})," → ",e.jsx(n.code,{children:'"the patient"'})," / ",e.jsx(n.code,{children:'"your child"'}),` |
| `,e.jsx(n.code,{children:"[chiefComplaint]"})," | ",e.jsx(n.code,{children:"visitReason.callerStatement"}),` (lower-cased, period stripped) |
| `,e.jsx(n.code,{children:"[topic]"})," | ",e.jsx(n.code,{children:"chiefComplaint"})," → ",e.jsx(n.code,{children:"SERVICE_LINE_TITLES[suggestedServiceLine]"}),` |
| `,e.jsx(n.code,{children:"[fields]"}),` | Joined list of: name · DOB as MM/DD/YYYY · Phone as XXX-XXX-XXXX |
| `,e.jsx(n.code,{children:"[MM/DD/YYYY]"})," | ",e.jsx(n.code,{children:"collectedFields.dob"})," formatted as month/day/year |"]})]})}function p(t={}){const{wrapper:n}={...i(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(o,{...t})}):o(t)}export{p as default};
