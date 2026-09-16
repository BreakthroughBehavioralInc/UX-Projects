import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{T as t}from"./data-O4QkyLWN.js";import{C as n}from"./CsaShell-D4E8uYRc.js";import"./index-Bc2G9s8g.js";import"./index-BO6cjGmN.js";import"./HandoffPanel-C75jtJd1.js";const b={title:"CSA/Shell",component:n,parameters:{layout:"fullscreen",docs:{description:{component:"CSA shells rebuilt with everkit only — home dashboard (patient search + upcoming appointments) and patient profile (post-authentication destination)."}}}},a={name:"Home dashboard",render:()=>e.jsx("div",{className:"h-[100dvh] overflow-hidden",children:e.jsx(n,{})})},f=t.find(s=>s.id==="demo-member-services-auth")??t[0],r={name:"Patient profile (authenticated)",render:()=>e.jsx("div",{className:"h-[100dvh] overflow-hidden",children:e.jsx(n,{view:"profile",payload:f.payload})})},S=t.find(s=>s.id==="demo-member-services-not-auth")??t[1],o={name:"Patient Search (not authenticated call)",render:()=>e.jsx("div",{className:"h-[100dvh] overflow-hidden",children:e.jsx(n,{view:"patient-search",payload:S.payload})})};var d,i,c;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  name: "Home dashboard",
  render: () => <div className="h-[100dvh] overflow-hidden">\r
      <CsaShell />\r
    </div>
}`,...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,h,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: "Patient profile (authenticated)",
  render: () => <div className="h-[100dvh] overflow-hidden">\r
      <CsaShell view="profile" payload={authenticatedScenario.payload} />\r
    </div>
}`,...(m=(h=r.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};var p,v,u;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: "Patient Search (not authenticated call)",
  render: () => <div className="h-[100dvh] overflow-hidden">\r
      <CsaShell view="patient-search" payload={notAuthScenario.payload} />\r
    </div>
}`,...(u=(v=o.parameters)==null?void 0:v.docs)==null?void 0:u.source}}};const j=["HomeDashboard","PatientProfile","PatientSearchHandoff"];export{a as HomeDashboard,r as PatientProfile,o as PatientSearchHandoff,j as __namedExportsOrder,b as default};
