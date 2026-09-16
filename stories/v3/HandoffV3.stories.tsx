/**
 * MVP Master Flow v3 — Future / Sierra Chat
 *
 * "Future / Ideal" iteration for item 10: post-handoff Sierra AI co-pilot.
 *
 * Concept:
 *   After Sierra transfers the call, it doesn't disappear. The panel gains a
 *   second tab — "Ask Sierra" — where the advocate can query the AI about the
 *   call in natural language. Sierra answers from the IVR context it captured.
 *
 *   This is the IDEAL end state. The implementation gap (real-time Sierra API
 *   post-handoff) is noted below. Everything else is production-ready DS code.
 *
 * What's new in V3:
 *   ● Dual-tab panel header: "Handoff" (V2 content) | "Ask Sierra" (chat)
 *   ● Chat tab: DS MessageList + ChatMessage + Composer
 *   ● Sierra = `ai` ChatMessage (solid-brand sparkle, reserved identity)
 *   ● Advocate = `role="user"` ChatMessage (right-aligned brand bubble)
 *   ● Context lines = `role="system"` (centered muted)
 *   ● Pre-loaded opening from Sierra based on IVR payload
 *   ● Keyword-matched mock responses (simulates Sierra API answers)
 *   ● Simulated 1.2s streaming → full response
 *
 * How to demo:
 *   1. Select Scenario 1 (authenticated, headache) — default
 *   2. Check the "Handoff" tab — same V2 content, full context
 *   3. Switch to "Ask Sierra"
 *   4. Sierra opens: "Alfredo's on the line about scheduling a primary care
 *      visit for a headache. Identity confirmed…"
 *   5. Type questions: "What did he say exactly?" / "Confirm his identity" /
 *      "Which service line?" / "Does he have prior visits?"
 *   6. Change scenarios — chat resets to that scenario's context
 *
 * Figma reference (CSA-Intake-Redesign J4sA1dsKVZoZK5juEJ1d0T):
 *   The redesigned workspace shows the pattern V3 bridges: patient profile
 *   sidebar + tabbed content area for service/provider selection. The Sierra
 *   chat panel is the AI layer that connects the IVR context to those flows.
 *   The "Select a Service" and provider-picker screens (4322:42698, 4339:59694)
 *   are what the main workspace shows WHILE the advocate chats with Sierra in
 *   the rail.
 *
 * Implementation gap (real → future):
 *   - Currently: mock keyword-matched responses (HandoffPanelV3.tsx:MOCK_RULES)
 *   - Future: POST /sierra/post-handoff-query with interactionId + message
 *     → streamed SSE response using Composer's `isStreaming` + `onStop`
 *   - DS components: MessageList + ChatMessage + Composer are production-ready;
 *     only the API wiring remains
 *
 * DS gap flags (same as V2, carried forward):
 *   🚩 ChatBubble, StepTimeline, AIBrief — still inline in HandoffPanelV2.tsx
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../../src/components/ScenarioBar";
import { RightRailLayoutV3, LeftRailLayoutV3 } from "../../src/layouts/HandoffLayoutsV3";

type LayoutKey = "right" | "left";

const LAYOUTS: Record<LayoutKey, string> = {
  right: "Right rail",
  left: "Left rail",
};

function HandoffV3Playground({ layoutKey }: { layoutKey: LayoutKey }) {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel={`${LAYOUTS[layoutKey]} · v3 Future`}
      />
      <div className="min-h-0 flex-1">
        {layoutKey === "left" ? (
          <LeftRailLayoutV3 scenario={scenario} activeCall />
        ) : (
          <RightRailLayoutV3 scenario={scenario} />
        )}
      </div>
    </div>
  );
}

const meta = {
  title: "2 · Future Vision/Scenario review",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**V3 Future / Ideal** — Sierra stays as an AI co-pilot after handoff.",
          "",
          "**New in V3:** dual-tab panel (Handoff | Ask Sierra). The chat tab",
          "uses DS `MessageList` + `ChatMessage` + `Composer` — production-ready",
          "components. Only the Sierra post-handoff API wiring is a future step.",
          "",
          "**Demo flow:**",
          "1. Open Scenario 1 (authenticated · headache · primary care)",
          "2. Check the **Handoff** tab — same V2 context",
          "3. Switch to **Ask Sierra**",
          "4. Try: *\"What did he say?\"*, *\"Confirm identity\"*, *\"Which service line?\"*",
          "5. Change scenarios — chat resets to the new scenario's context",
          "",
          "**Figma reference:** CSA-Intake-Redesign (J4sA1dsKVZoZK5juEJ1d0T)",
          "Service selection (4322:42698) + provider picker (4339:59694) show the",
          "main workspace flows that run alongside this rail.",
          "",
          "**Gap:** mock responses (keyword-matched). Production = POST to Sierra",
          "post-handoff API with `interactionId` + advocate message.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const RightRail: Story = {
  name: "Right rail",
  render: () => <HandoffV3Playground layoutKey="right" />,
};

export const LeftRail: Story = {
  name: "Left rail",
  render: () => <HandoffV3Playground layoutKey="left" />,
};
