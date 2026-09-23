import{j as a}from"./jsx-runtime-DFAAy_2V.js";import{T as s}from"./data-b3gjuFd8.js";import{C as o}from"./CsaLegacyShell-CiRigMBZ.js";import"./index-Bc2G9s8g.js";import"./index-BO6cjGmN.js";const w={title:"CSA/Legacy Shell",component:o,parameters:{layout:"fullscreen",docs:{description:{component:"Faithful reproduction of the current production CSA experience — shown here for contrast with the future-state shell. Dense layouts, clinical forms, inconsistent spacing. Reference: stage-csa.mdlive.com."}}}},e={name:"Home dashboard (current)",render:()=>a.jsx("div",{className:"h-[100dvh] overflow-auto",children:a.jsx(o,{view:"home"})})},p=s.find(m=>m.id==="demo-member-services-auth")??s[0],r={name:"Patient profile (current)",render:()=>a.jsx("div",{className:"h-[100dvh] overflow-auto",children:a.jsx(o,{view:"profile",payload:p.payload})})};var t,n,c;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  name: "Home dashboard (current)",
  render: () => <div className="h-[100dvh] overflow-auto">\r
      <CsaLegacyShell view="home" />\r
    </div>
}`,...(c=(n=e.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var i,d,l;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: "Patient profile (current)",
  render: () => <div className="h-[100dvh] overflow-auto">\r
      <CsaLegacyShell view="profile" payload={authScenario.payload} />\r
    </div>
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const y=["HomeDashboard","PatientProfile"];export{e as HomeDashboard,r as PatientProfile,y as __namedExportsOrder,w as default};
