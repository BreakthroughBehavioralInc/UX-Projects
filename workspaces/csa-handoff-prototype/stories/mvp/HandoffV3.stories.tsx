/**
 * 1 · MVP — v3
 *
 * V2 panel with complete scenario coverage (scenarios 1–15).
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../../src/components/ScenarioBar";
import { RightRailLayoutV2, LeftRailLayoutV2 } from "../../src/layouts/HandoffLayoutsMvp";

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
        layoutLabel={`${LAYOUTS[layoutKey]} · v3`}
      />
      <div className="min-h-0 flex-1">
        {layoutKey === "left" ? (
          <LeftRailLayoutV2 scenario={scenario} activeCall />
        ) : (
          <RightRailLayoutV2 scenario={scenario} />
        )}
      </div>
    </div>
  );
}

const meta = {
  title: "1 · MVP/v3",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**v3** — V2 panel with complete scenario coverage (scenarios 1–15).",
          "",
          "Adds Spanish-speaking caller, caregiver proxy (minor child), consent",
          "declined (non-blocking), behavioral health scheduling, and live agent",
          "retention to the existing 10 scenarios.",
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
