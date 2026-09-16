import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../src/components/ScenarioBar";
import { StickyTopBandLayout } from "../src/layouts/HandoffLayouts";

function StickyTopBandPlayground() {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel="Sticky top context band"
      />
      <div className="min-h-0 flex-1">
        <StickyTopBandLayout scenario={scenario} />
      </div>
    </div>
  );
}

const meta = {
  title: "Layouts/Sticky Top Band",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Compact status band pinned under the CSA chrome. Reason stays editable at a glance; expand for full patient card, verify fields, and visit context. Degraded auth states auto-expand.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => <StickyTopBandPlayground />,
};
