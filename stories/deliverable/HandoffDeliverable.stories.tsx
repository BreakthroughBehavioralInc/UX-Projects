/**
 * Handoff Panel — per-scenario stories (deliverable)
 *
 * One Storybook entry per scenario. Navigate via the sidebar — no top picker needed.
 * Clean build for developer handoff: just these 19 stories + MDX docs.
 */

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button, Icon, Text } from "@everkit/design-system";
import { TRANSFER_CONTEXT_SCENARIOS, type TransferContextScenario, type SierraHandoffPayload } from "../../src/data/scenarios";
import { MVP_MASTER_FLOW_SCENARIO_NUMBERS } from "../../src/data/mvpMasterFlowScenarios";
import { useHandoffPanelSession } from "../../src/handoff/HandoffPanel";
import { HandoffRailPanelV2 } from "../../src/handoff/v2/HandoffPanelV2";
import { isMemberAuthenticated } from "../../src/handoff/utils";

// ---------------------------------------------------------------------------
// Scenario data — resolved once at module load.
// ---------------------------------------------------------------------------

const MVP_SCENARIOS = MVP_MASTER_FLOW_SCENARIO_NUMBERS.map(
  (n) => TRANSFER_CONTEXT_SCENARIOS.find((s) => s.scenarioNumber === n)!,
).filter(Boolean);

// ---------------------------------------------------------------------------
// Fake app header — placeholder for the real CSA shell header.
// Contains the Sierra panel toggle button (neutral).
// ---------------------------------------------------------------------------

function AppHeader({
  scenarioLabel,
  panelOpen,
  onTogglePanel,
}: {
  scenarioLabel: string;
  panelOpen: boolean;
  onTogglePanel: () => void;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4">
      <div className="flex min-w-0 flex-col justify-center">
        <Text variant="meta-small" className="truncate text-muted-foreground">
          {scenarioLabel}
        </Text>
      </div>
      <Button
        variant="neutral-secondary"
        size="icon-sm"
        aria-label={panelOpen ? "Hide Sierra handoff panel" : "Show Sierra handoff panel"}
        onClick={onTogglePanel}
      >
        <Icon
          name={panelOpen ? "right_panel_close" : "right_panel_open"}
          size="sm"
          fill={0}
          aria-hidden
        />
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder main content — shows the page context (Patient Search / Profile).
// ---------------------------------------------------------------------------

function PlaceholderMain({ payload }: { payload: SierraHandoffPayload | null }) {
  const label =
    payload && isMemberAuthenticated(payload) ? "Patient Profile" : "Patient Search";

  return (
    <div className="flex h-full items-center justify-center bg-background">
      <Text variant="body-default" className="text-muted-foreground">
        {label}
      </Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Deliverable layout — fake header + placeholder content + right rail.
// Height is h-[100dvh] (owns the viewport); inner layout uses h-full.
// ---------------------------------------------------------------------------

function DeliverableLayout({ scenario }: { scenario: TransferContextScenario }) {
  const { payload, lookupError, onClear, onLookup } = useHandoffPanelSession(scenario);
  const [panelOpen, setPanelOpen] = React.useState(false);

  React.useEffect(() => {
    if (!payload) return;
    const timer = window.setTimeout(() => setPanelOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [payload?.interactionId]);

  const handleClear = React.useCallback(() => {
    onClear();
    setPanelOpen(false);
  }, [onClear]);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <AppHeader
        scenarioLabel={scenario.label}
        panelOpen={panelOpen}
        onTogglePanel={() => setPanelOpen((v) => !v)}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-auto">
          <PlaceholderMain payload={payload} />
        </div>
        <div
          className="shrink-0 overflow-hidden transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
          style={{ width: panelOpen ? "400px" : "0px" }}
        >
          <HandoffRailPanelV2
            payload={payload}
            side="right"
            lookupError={lookupError}
            onClear={handleClear}
            onLookup={onLookup}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Handoff Panel",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function makeStory(scenario: TransferContextScenario): Story {
  return {
    render: () => <DeliverableLayout scenario={scenario} />,
  };
}

// ---------------------------------------------------------------------------
// One story per scenario — navigate via Storybook sidebar.
// Export key drives the display name (lodash startCase): underscores → spaces,
// camelCase boundaries → spaces. No `name` property (causes Storybook 8 ID mismatch).
// ---------------------------------------------------------------------------

export const S01_ScheduleVisitAuthenticated: Story = makeStory(MVP_SCENARIOS[0]);
export const S02_ScheduleVisitNotAuthenticated: Story = makeStory(MVP_SCENARIOS[1]);
export const S03_MultipleAccountsNotAuthenticated: Story = makeStory(MVP_SCENARIOS[2]);
export const S04_SpanishSpeakingAuthenticated: Story = makeStory(MVP_SCENARIOS[3]);
export const S05_CaregiverProxyMinorChild: Story = makeStory(MVP_SCENARIOS[4]);
export const S06_ConsentDeclinedSchedulingBlocked: Story = makeStory(MVP_SCENARIOS[5]);
export const S07_ConsentDeclinedBillingInquiry: Story = makeStory(MVP_SCENARIOS[6]);
export const S08_PharmacyAuthenticated: Story = makeStory(MVP_SCENARIOS[7]);
export const S09_PharmacyNotAuthenticated: Story = makeStory(MVP_SCENARIOS[8]);
export const S10_DermatologyInquiryAuthenticated: Story = makeStory(MVP_SCENARIOS[9]);
export const S11_DermatologyInquiryNotAuthenticated: Story = makeStory(MVP_SCENARIOS[10]);
export const S12_BehavioralHealthAuthenticated: Story = makeStory(MVP_SCENARIOS[11]);
export const S13_RetentionCallerWantedToDisconnect: Story = makeStory(MVP_SCENARIOS[12]);
export const S14_MentalHealthCrisisNoIdentity: Story = makeStory(MVP_SCENARIOS[13]);
export const S15_DroppedCallCallIdLookup: Story = makeStory(MVP_SCENARIOS[14]);
export const S16_RetentionIntentCapturedNoDob: Story = makeStory(MVP_SCENARIOS[15]);
export const S17_RetentionIntentAndName: Story = makeStory(MVP_SCENARIOS[16]);
export const S18_RetentionIntentNameAndDob: Story = makeStory(MVP_SCENARIOS[17]);
export const S19_MentalHealthCrisisNameCaptured: Story = makeStory(MVP_SCENARIOS[18]);
