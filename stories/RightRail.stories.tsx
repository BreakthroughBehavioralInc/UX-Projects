import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../src/components/ScenarioBar";
import { RightRailLayout } from "../src/layouts/HandoffLayouts";

function RightRailPlayground() {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel="Persistent right rail"
      />
      <div className="min-h-0 flex-1">
        <RightRailLayout scenario={scenario} />
      </div>
    </div>
  );
}

const meta = {
  title: "Layouts/Right Rail",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sierra handoff docked in a persistent right rail inside CSA. Full patient card, reason, verify fields, and visit context stay visible while the advocate uses Patient Search and appointments.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <RightRailPlayground />,
};
