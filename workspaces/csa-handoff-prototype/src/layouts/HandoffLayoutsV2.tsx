import * as React from "react";
import type { TransferContextScenario } from "../data/scenarios";
import type { SierraHandoffPayload } from "../data/scenarios";
import { CsaHeader } from "../csa/CsaHeader";
import { CsaShell } from "../csa/CsaShell";
import { csaActiveNavLabel, resolveCsaShellView } from "../csa/profileUtils";
import { useHandoffPanelSession } from "../handoff/HandoffPanel";
import { HandoffRailPanelV2, HandoffRailV2 } from "../handoff/v2/HandoffPanelV2";
import { shouldShowHandoffSidebar } from "../handoff/utils";

function CsaHandoffFrameV2({
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

function useCsaHandoffNavigationV2(
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

export function RightRailLayoutV2({
  scenario,
  onVerified,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } = useHandoffPanelSession(scenario);
  const { view, handleVerified } = useCsaHandoffNavigationV2(payload ?? undefined, onVerified, payload != null);
  const showSidebar = scenario.startsCleared || shouldShowHandoffSidebar(scenario.payload);

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
    },
    [onSelectPatient, handleVerified],
  );

  return (
    <CsaHandoffFrameV2 activeNavLabel={csaActiveNavLabel(view)}>
      <CsaShell
        showHeader={false}
        view={view}
        payload={payload ?? undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
      />
      {showSidebar ? (
        <HandoffRailPanelV2
          payload={payload}
          side="right"
          lookupError={lookupError}
          onClear={onClear}
          onLookup={onLookup}
          onVerified={handleVerified}
        />
      ) : null}
    </CsaHandoffFrameV2>
  );
}

export function LeftRailLayoutV2({
  scenario,
  onVerified,
  activeCall = false,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
  activeCall?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } = useHandoffPanelSession(scenario);
  const { view, handleVerified } = useCsaHandoffNavigationV2(
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
    <CsaHandoffFrameV2 activeNavLabel={csaActiveNavLabel(view)}>
      <HandoffRailV2
        activeCall={showSidebar}
        payload={payload}
        side="left"
        lookupError={lookupError}
        onClear={onClear}
        onLookup={onLookup}
        onVerified={handleVerified}
      />
      <CsaShell
        showHeader={false}
        view={view}
        payload={activeCall ? payload ?? undefined : undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
      />
    </CsaHandoffFrameV2>
  );
}
