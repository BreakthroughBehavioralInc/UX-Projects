# KR 2.2 – Reduce AHT V1

## Project
KR 2.2 – Reduce AHT

## Category
Provider

## Owner
AlfredoCMDL

## Status
In Review

## Purpose
Prototype exploring how a Sierra AI handoff panel surfaced inside a Cisco Finesse-like agent desktop can reduce Average Handle Time (AHT) for CSA agents. The panel appears automatically when a call transfer arrives and presents verified caller identity, suggested service routing, AI-generated context cards, and a structured intake wizard — eliminating the need for agents to manually look up patient records or re-ask questions the IVR already collected.

## Primary Audience
Customer Service Agents (CSA) — call-center representatives who receive transferred calls from Sierra AI

## Entry Point
index.html

## Live Path
/Provider/kr-2.2-reduce-aht/v1/

## Key Flows
- **Demo flow**: Simulated Cisco Finesse desktop transitions through Ready → Reserved → Talking states; the CSA handoff panel auto-opens on Reserved
- **V2 panel (right-rail)**: AI-generated context cards, status chips, consent status, suggested actions
- **V2 panel (left-rail)**: Same panel in an alternate layout
- **Legacy CSA shell**: Full MDLive CSA admin shell with the V2 handoff panel injected into the patient profile view
- **Five scenarios**: Authenticated primary care, urgent care, mental health, dermatology, unauthenticated

## Testing Notes
- Open the **Demo** story first for the most realistic end-to-end walkthrough
- Use the Storybook sidebar to navigate individual scenarios and layout variants
- The panel is toggled open/closed via the handoff button in the legacy shell header

## Data Notice
This prototype uses fictional or sanitized data and is not a production application.
