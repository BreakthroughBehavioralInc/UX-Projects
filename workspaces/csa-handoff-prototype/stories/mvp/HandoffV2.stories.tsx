/**
 * 1 · MVP — v2
 *
 * Copy of the Fast-Follow savepoint. Receives upcoming v2 changes while
 * "1 · MVP/Fast-Follow" stays frozen as the pre-v2 reference.
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

function HandoffV2Playground({ layoutKey }: { layoutKey: LayoutKey }) {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel={`${LAYOUTS[layoutKey]} · v2`}
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
  title: "1 · MVP/v2",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**v2** — iterates on the Fast-Follow savepoint.",
          "",
          "The **Fast-Follow** story in this same folder is the frozen",
          "pre-v2 reference. Changes are applied here only.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const RightRail: Story = {
  name: "Right rail",
  render: () => <HandoffV2Playground layoutKey="right" />,
};

export const LeftRail: Story = {
  name: "Left rail",
  render: () => <HandoffV2Playground layoutKey="left" />,
};
