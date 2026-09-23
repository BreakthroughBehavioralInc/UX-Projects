import * as React from "react";
import type { SierraHandoffPayload, TransferContextScenario } from "../data/scenarios";
import { CsaHeader } from "../csa/CsaHeader";
import { CsaShell } from "../csa/CsaShell";
import { csaActiveNavLabel, resolveCsaShellView } from "../csa/profileUtils";
import { HandoffRail, HandoffRailPanel, useHandoffPanelSession } from "../handoff/HandoffPanel";
import { HandoffTopBand } from "../handoff/HandoffTopBand";
import { shouldShowHandoffSidebar } from "../handoff/utils";

/** CSA masthead spans full width; handoff rails and main workspace share the row below. */
function CsaHandoffFrame({
  children,
  activeNavLabel,
}: {
  children: React.ReactNode;
  activeNavLabel?: string | null;
}) {
  return (
    <div className="density-compact flex h-full min-h-0 flex-col overflow-hidden bg-[var(--muted)]">
      <CsaHeader activeNavLabel={activeNavLabel} />
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

function useCsaHandoffNavigation(
  payload: SierraHandoffPayload | undefined,
  onVerified?: () => void,
  handoffActive = true,
) {
  const [resolved, setResolved] = React.useState(false);

  React.useEffect(() => {
    setResolved(false);
  }, [payload?.interactionId, handoffActive]);

  const view = resolveCsaShellView(handoffActive ? payload : undefined, handoffActive, resolved);

  const handleVerified = React.useCallback(() => {
    setResolved(true);
    onVerified?.();
  }, [onVerified]);

  return { view, handleVerified };
}

export function RightRailLayout({
  scenario,
  onVerified,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } = useHandoffPanelSession(scenario);
  const { view, handleVerified } = useCsaHandoffNavigation(payload ?? undefined, onVerified, payload != null);
  const showSidebar = scenario.startsCleared || shouldShowHandoffSidebar(scenario.payload);

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
    },
    [onSelectPatient, handleVerified],
  );

  return (
    <CsaHandoffFrame activeNavLabel={csaActiveNavLabel(view)}>
      <CsaShell
        showHeader={false}
        view={view}
        payload={payload ?? undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
      />
      {showSidebar ? (
        <HandoffRailPanel
          payload={payload}
          side="right"
          lookupError={lookupError}
          onClear={onClear}
          onLookup={onLookup}
        />
      ) : null}
    </CsaHandoffFrame>
  );
}

export function LeftRailLayout({
  scenario,
  onVerified,
  activeCall = false,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
  activeCall?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } = useHandoffPanelSession(scenario);
  const { view, handleVerified } = useCsaHandoffNavigation(
    payload ?? undefined,
    onVerified,
    activeCall && payload != null,
  );
  const showSidebar =
    activeCall && (scenario.startsCleared || shouldShowHandoffSidebar(scenario.payload));

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
    },
    [onSelectPatient, handleVerified],
  );

  return (
    <CsaHandoffFrame activeNavLabel={csaActiveNavLabel(view)}>
      <HandoffRail
        activeCall={showSidebar}
        payload={payload}
        onVerified={handleVerified}
        side="left"
        lookupError={lookupError}
        onClear={onClear}
        onLookup={onLookup}
      />
      <CsaShell
        showHeader={false}
        view={view}
        payload={activeCall ? payload ?? undefined : undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
      />
    </CsaHandoffFrame>
  );
}

export function StickyTopBandLayout({
  scenario,
  onVerified,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } = useHandoffPanelSession(scenario);
  const { view, handleVerified } = useCsaHandoffNavigation(payload ?? undefined, onVerified, payload != null);

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
    },
    [onSelectPatient, handleVerified],
  );

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--muted)]">
      <HandoffTopBand
        payload={payload}
        lookupError={lookupError}
        onClear={onClear}
        onLookup={onLookup}
        onVerified={handleVerified}
      />
      <CsaShell
        view={view}
        payload={payload ?? undefined}
        showHandoffAlertOnWorkspace={false}
        onSelectPatient={selectPatient}
      />
    </div>
  );
}
