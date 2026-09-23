import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScenarioBar, useScenarioState } from "../src/components/ScenarioBar";
import { LeftRailLayout } from "../src/layouts/HandoffLayouts";

function LeftRailPlayground({ initialActiveCall = false }: { initialActiveCall?: boolean }) {
  const { scenarioId, setScenarioId, scenario } = useScenarioState();
  const [activeCall, setActiveCall] = React.useState(initialActiveCall);

  React.useEffect(() => {
    setActiveCall(initialActiveCall);
  }, [scenarioId, initialActiveCall]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScenarioBar
        scenarioId={scenarioId}
        onScenarioChange={setScenarioId}
        layoutLabel="Slide-in left rail"
        callControl={{
          activeCall,
          onToggle: () => setActiveCall((v) => !v),
        }}
      />
      <div className="min-h-0 flex-1">
        <LeftRailLayout scenario={scenario} activeCall={activeCall} />
      </div>
    </div>
  );
}

const meta = {
  title: "Layouts/Left Rail",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Handoff context stays hidden while idle. When a call arrives, the 360px rail slides in from the left and CSA content reflows. Toggle “Simulate incoming call” in the review bar to preview the transition.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Idle: Story = {
  name: "Idle (no call)",
  render: () => <LeftRailPlayground initialActiveCall={false} />,
};

export const ActiveCall: Story = {
  name: "Active call (rail visible)",
  render: () => <LeftRailPlayground initialActiveCall={true} />,
};

export const Playground: Story = {
  render: () => <LeftRailPlayground />,
};
