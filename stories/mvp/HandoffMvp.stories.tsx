/**
 * 1 · MVP — Sierra Handoff
 *
 * MVP screenpop: no chat. Fixed header (identical to Future Vision) + static
 * content panel with:
 *   1. Call ID
 *   2. Suggested script (replaces "Say to caller")
 *   3. Captured intent
 *   4. Suggested path (action card — Start New Consultation or Patient Search)
 *
 * The Future Vision (folder "2 · Future Vision") extends this with a full
 * Sierra AI chat co-pilot.
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../../src/components/ScenarioBar";
import { RightRailLayoutMvp, LeftRailLayoutMvp } from "../../src/layouts/HandoffLayoutsMvp";

type LayoutKey = "right" | "left";

const LAYOUTS: Record<LayoutKey, string> = {
  right: "Right rail",
  left: "Left rail",
};

function HandoffMvpPlayground({ layoutKey }: { layoutKey: LayoutKey }) {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel={`${LAYOUTS[layoutKey]} · V1`}
      />
      <div className="min-h-0 flex-1">
        {layoutKey === "left" ? (
          <LeftRailLayoutMvp scenario={scenario} activeCall />
        ) : (
          <RightRailLayoutMvp scenario={scenario} />
        )}
      </div>
    </div>
  );
}

const meta = {
  title: "1 · MVP/V1",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**MVP Sierra Handoff** — Static context panel, no chat.",
          "",
          "The fixed header (call status · patient identity · auth/consent chips ·",
          "Crisis Protocol) is identical to the Future Vision. Below it, a static",
          "panel presents the three things an advocate needs at pickup:",
          "",
          "1. **Call ID** — Sierra interaction reference",
          "2. **Suggested script** — scripted opening line to read to the caller",
          "3. **Captured intent** — what the caller is here for + pre-filled action card",
          "",
          "Change scenarios with the bar at the top to see different auth states,",
          "service lines, and emergency scenarios.",
          "",
          "**Future Vision** (folder below) extends this with a full Sierra AI",
          "chat co-pilot after handoff.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const RightRail: Story = {
  name: "Right rail",
  render: () => <HandoffMvpPlayground layoutKey="right" />,
};

export const LeftRail: Story = {
  name: "Left rail",
  render: () => <HandoffMvpPlayground layoutKey="left" />,
};
