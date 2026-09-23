import * as React from "react";
import { Button, Icon, Label } from "@everkit/design-system";
import {
  DEFAULT_TRANSFER_CONTEXT_SCENARIO,
  TRANSFER_CONTEXT_SCENARIOS,
  type TransferContextScenario,
} from "../data/scenarios";
import {
  MVP_FLOW_BRANCH,
  MVP_MASTER_FLOW_SCENARIO_NUMBERS,
} from "../data/mvpMasterFlowScenarios";

const MVP_SCENARIOS = MVP_MASTER_FLOW_SCENARIO_NUMBERS.map(
  (n) => TRANSFER_CONTEXT_SCENARIOS.find((s) => s.scenarioNumber === n)!,
).filter(Boolean);

const SCENARIO_BAR_COLLAPSED_KEY = "csa-handoff:scenario-bar-collapsed";

function readScenarioBarCollapsed() {
  try {
    return sessionStorage.getItem(SCENARIO_BAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeScenarioBarCollapsed(collapsed: boolean) {
  try {
    sessionStorage.setItem(SCENARIO_BAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // Ignore storage failures in Storybook embeds.
  }
}

export function ScenarioBar({
  scenarioId,
  onScenarioChange,
  layoutLabel,
  defaultCollapsed = false,
  callControl,
}: {
  scenarioId: string;
  onScenarioChange: (id: string) => void;
  layoutLabel: string;
  defaultCollapsed?: boolean;
  /** Optional left-rail demo control — collapses with the review bar. */
  callControl?: {
    activeCall: boolean;
    onToggle: () => void;
  };
}) {
  const [collapsed, setCollapsed] = React.useState(
    () => defaultCollapsed || readScenarioBarCollapsed(),
  );

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((value) => {
      const next = !value;
      writeScenarioBarCollapsed(next);
      return next;
    });
  }, []);

  const index = Math.max(
    0,
    MVP_SCENARIOS.findIndex((s) => s.id === scenarioId),
  );
  const scenario = MVP_SCENARIOS[index] ?? MVP_SCENARIOS[0];
  const branch = MVP_FLOW_BRANCH[scenario.scenarioNumber] ?? "";

  const go = (delta: number) => {
    const next = MVP_SCENARIOS[index + delta];
    if (next) onScenarioChange(next.id);
  };

  if (collapsed) {
    return (
      <div className="flex justify-end border-b border-[var(--border)] bg-[var(--card)] px-1 py-0">
        <Button
          size="icon-sm"
          variant="tertiary"
          onClick={toggleCollapsed}
          aria-expanded={false}
          aria-label="Show review bar"
        >
          <Icon name="expand_more" size="sm" aria-hidden />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-end gap-4 px-4 py-3">
      <div className="min-w-[200px] flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          CSA handoff demo · review
        </p>
        <p className="text-sm font-medium">{layoutLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Scenario {index + 1} of {MVP_SCENARIOS.length} · FigJam{" "}
          <a
            className="text-[var(--everkit-color-content-link)] underline"
            href="https://www.figma.com/board/fCUSpphZcLFL4GP8hdDsW4/IVR-AI-Integration?node-id=1771-9321"
            target="_blank"
            rel="noreferrer"
          >
            MVP Master Flows
          </a>
        </p>
      </div>

      <div className="flex items-end gap-2">
        <Button size="sm" variant="neutral-secondary" disabled={index <= 0} onClick={() => go(-1)}>
          ← Prev
        </Button>
        <Button
          size="sm"
          variant="neutral-secondary"
          disabled={index >= MVP_SCENARIOS.length - 1}
          onClick={() => go(1)}
        >
          Next →
        </Button>
      </div>

      <div className="flex min-w-[320px] flex-col gap-1">
        <Label htmlFor="scenario-select">Scenario</Label>
        <select
          id="scenario-select"
          className="h-[var(--everkit-field-height)] rounded-[var(--everkit-field-radius)] border border-[var(--input)] bg-[var(--card)] px-3 text-sm"
          value={scenario.id}
          onChange={(e) => onScenarioChange(e.target.value)}
        >
          {MVP_SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        {branch && <p className="text-xs text-muted-foreground">{branch}</p>}
      </div>

      <Button
        size="icon-sm"
        variant="tertiary"
        className="self-center"
        onClick={toggleCollapsed}
        aria-expanded={true}
        aria-label="Hide review bar"
      >
        <Icon name="expand_less" size="sm" aria-hidden />
      </Button>
      </div>

      {callControl ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] px-4 py-2">
          <Button
            size="sm"
            variant={callControl.activeCall ? "neutral-secondary" : "primary"}
            onClick={callControl.onToggle}
          >
            {callControl.activeCall ? "End call" : "Simulate incoming call"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {callControl.activeCall
              ? "Handoff rail is visible — CSA may route to patient profile after verify."
              : "Idle — handoff rail is hidden; CSA uses full width for Patient Search."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function useScenarioState(initialId = DEFAULT_TRANSFER_CONTEXT_SCENARIO.id) {
  const mvpDefault = MVP_SCENARIOS[0]?.id ?? initialId;
  const [scenarioId, setScenarioId] = React.useState(
    MVP_SCENARIOS.some((s) => s.id === initialId) ? initialId : mvpDefault,
  );
  const scenario =
    MVP_SCENARIOS.find((s) => s.id === scenarioId) ?? MVP_SCENARIOS[0] ?? DEFAULT_TRANSFER_CONTEXT_SCENARIO;
  return { scenarioId, setScenarioId, scenario };
}

export type { TransferContextScenario };
