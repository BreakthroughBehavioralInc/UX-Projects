/**
 * 1 · MVP — Fast-Follow
 *
 * Copy of the MVP savepoint. Receives upcoming Fast-Follow changes while
 * "1 · MVP/Scenario review" stays frozen as the pre-Fast-Follow reference.
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

function HandoffFastFollowPlayground({ layoutKey }: { layoutKey: LayoutKey }) {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel={`${LAYOUTS[layoutKey]} · Fast-Follow`}
      />
      <div className="min-h-0 flex-1">
        {layoutKey === "left" ? (
          <LeftRailLayoutMvp scenario={scenario} activeCall fastFollow />
        ) : (
          <RightRailLayoutMvp scenario={scenario} fastFollow />
        )}
      </div>
    </div>
  );
}

const meta = {
  title: "1 · MVP/Fast-Follow",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**Fast-Follow** — iterates on the MVP savepoint.",
          "",
          "The **Scenario review** story in this same folder is the frozen",
          "pre-Fast-Follow reference. Changes are applied here only.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const RightRail: Story = {
  name: "Right rail",
  render: () => <HandoffFastFollowPlayground layoutKey="right" />,
};

export const LeftRail: Story = {
  name: "Left rail",
  render: () => <HandoffFastFollowPlayground layoutKey="left" />,
};
