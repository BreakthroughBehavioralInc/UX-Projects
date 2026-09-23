import * as React from "react";
import type { TransferContextScenario } from "../data/scenarios";
import type { SierraHandoffPayload } from "../data/scenarios";
import { CsaHeader } from "../csa/CsaHeader";
import { CsaShell } from "../csa/CsaShell";
import { csaActiveNavLabel, resolveCsaShellView } from "../csa/profileUtils";
import { useHandoffPanelSession } from "../handoff/HandoffPanel";
import {
  HandoffRailPanelV3,
  HandoffRailV3,
  type SierraAction,
} from "../handoff/v3/HandoffPanelV3";
import { buildIntakeContext, type IntakeContext } from "../csa/intake/types";
import type { CsaShellView } from "../csa/profileUtils";
import { shouldShowHandoffSidebar } from "../handoff/utils";

// nav labels that map to a real shell view
const HEADER_NAV_MAP: Record<string, CsaShellView> = {
  Home: "home",
  "Patient Search": "patient-search",
};

function CsaHandoffFrameV3({
  children,
  activeNavLabel,
  onHeaderNav,
  aiPanelOpen,
  onToggleAiPanel,
  panelSide = "right",
}: {
  children: React.ReactNode;
  activeNavLabel?: string | null;
  onHeaderNav?: (label: string) => void;
  aiPanelOpen?: boolean;
  onToggleAiPanel?: () => void;
  panelSide?: "left" | "right";
}) {
  return (
    <div className="density-compact flex h-full min-h-0 flex-col overflow-hidden bg-[var(--muted)]">
      <CsaHeader
        activeNavLabel={activeNavLabel}
        onNavClick={onHeaderNav}
        aiPanelOpen={aiPanelOpen}
        onToggleAiPanel={onToggleAiPanel}
        panelSide={panelSide}
      />
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

function useCsaHandoffNavigationV3(
  payload: SierraHandoffPayload | undefined,
  handoffActive = true,
) {
  const [resolved, setResolved] = React.useState(false);
  const [patientConfirmed, setPatientConfirmed] = React.useState(false);
  const [sierraViewOverride, setSierraViewOverride] = React.useState<"intake" | null>(null);
  const [intakeContext, setIntakeContext] = React.useState<IntakeContext | null>(null);
  const [headerView, setHeaderView] = React.useState<CsaShellView | null>(null);
  const [notFoundLabel, setNotFoundLabel] = React.useState<string | undefined>(undefined);
  const [userPanelOpen, setUserPanelOpen] = React.useState(true);

  React.useEffect(() => {
    setResolved(false);
    setPatientConfirmed(false);
    setSierraViewOverride(null);
    setIntakeContext(null);
    setHeaderView(null);
    setNotFoundLabel(undefined);
  }, [payload?.interactionId, handoffActive]);

  const resolvedView = resolveCsaShellView(
    handoffActive ? payload : undefined,
    handoffActive,
    resolved,
  );
  const effectiveView = sierraViewOverride ?? headerView ?? resolvedView;

  const handleVerified = React.useCallback(() => {
    setResolved(true);
    setPatientConfirmed(true);
    setHeaderView(null);
    setNotFoundLabel(undefined);
  }, []);

  const handleSierraAction = React.useCallback((action: SierraAction) => {
    if (action.type === "start_intake") {
      setIntakeContext(action.context);
      setSierraViewOverride("intake");
      setHeaderView(null);
      setNotFoundLabel(undefined);
    }
  }, []);

  const handleIntakeComplete = React.useCallback(() => {
    setSierraViewOverride(null);
    setIntakeContext(null);
  }, []);

  const handleTabNavigate = React.useCallback(
    (nextView: CsaShellView) => {
      setHeaderView(null);
      setNotFoundLabel(undefined);
      if (nextView === "intake") {
        if (!intakeContext && payload) {
          setIntakeContext(buildIntakeContext(payload));
        }
        setSierraViewOverride("intake");
      } else {
        setSierraViewOverride(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payload],
  );

  const handleHeaderNav = React.useCallback((label: string) => {
    setSierraViewOverride(null);
    const mapped = HEADER_NAV_MAP[label];
    if (mapped) {
      setHeaderView(mapped);
      setNotFoundLabel(undefined);
    } else {
      setHeaderView("not-found");
      setNotFoundLabel(label);
    }
  }, []);

  const handleTogglePanel = React.useCallback(() => {
    setUserPanelOpen((prev) => !prev);
  }, []);

  return {
    effectiveView,
    resolvedView,
    patientConfirmed,
    intakeContext,
    notFoundLabel,
    userPanelOpen,
    handleVerified,
    handleSierraAction,
    handleIntakeComplete,
    handleTabNavigate,
    handleHeaderNav,
    handleTogglePanel,
  };
}

export function RightRailLayoutV3({
  scenario,
  onVerified,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } =
    useHandoffPanelSession(scenario);

  const {
    effectiveView,
    patientConfirmed,
    intakeContext,
    notFoundLabel,
    userPanelOpen,
    handleVerified,
    handleSierraAction,
    handleIntakeComplete,
    handleTabNavigate,
    handleHeaderNav,
    handleTogglePanel,
  } = useCsaHandoffNavigationV3(payload ?? undefined, payload != null);

  const showSidebar = scenario.startsCleared || shouldShowHandoffSidebar(scenario.payload);

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
      onVerified?.();
    },
    [onSelectPatient, handleVerified, onVerified],
  );

  return (
    <CsaHandoffFrameV3
      activeNavLabel={csaActiveNavLabel(effectiveView)}
      onHeaderNav={handleHeaderNav}
      aiPanelOpen={showSidebar ? userPanelOpen : undefined}
      onToggleAiPanel={showSidebar ? handleTogglePanel : undefined}
      panelSide="right"
    >
      <CsaShell
        showHeader={false}

        view={effectiveView}
        payload={payload ?? undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
        intakeContext={intakeContext ?? undefined}
        onIntakeComplete={handleIntakeComplete}
        onTabNavigate={handleTabNavigate}
        notFoundLabel={notFoundLabel}
      />
      {showSidebar ? (
        <div
          className={[
            "shrink-0 overflow-hidden transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)] motion-reduce:transition-none",
            userPanelOpen ? "w-[400px]" : "w-0",
          ].join(" ")}
        >
          <HandoffRailPanelV3
            payload={payload}
            side="right"
            lookupError={lookupError}
            onClear={onClear}
            onLookup={onLookup}
            patientConfirmed={patientConfirmed}
            onSierraAction={handleSierraAction}
          />
        </div>
      ) : null}
    </CsaHandoffFrameV3>
  );
}

export function LeftRailLayoutV3({
  scenario,
  onVerified,
  activeCall = false,
}: {
  scenario: TransferContextScenario;
  onVerified?: () => void;
  activeCall?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup, onSelectPatient } =
    useHandoffPanelSession(scenario);

  const {
    effectiveView,
    patientConfirmed,
    intakeContext,
    notFoundLabel,
    userPanelOpen,
    handleVerified,
    handleSierraAction,
    handleIntakeComplete,
    handleTabNavigate,
    handleHeaderNav,
    handleTogglePanel,
  } = useCsaHandoffNavigationV3(
    payload ?? undefined,
    activeCall && payload != null,
  );

  const showSidebar =
    activeCall && (scenario.startsCleared || shouldShowHandoffSidebar(scenario.payload));

  const selectPatient = React.useCallback(
    (row: Parameters<typeof onSelectPatient>[0]) => {
      onSelectPatient(row);
      handleVerified();
      onVerified?.();
    },
    [onSelectPatient, handleVerified, onVerified],
  );

  return (
    <CsaHandoffFrameV3
      activeNavLabel={csaActiveNavLabel(effectiveView)}
      onHeaderNav={handleHeaderNav}
      aiPanelOpen={showSidebar ? userPanelOpen : undefined}
      onToggleAiPanel={showSidebar ? handleTogglePanel : undefined}
      panelSide="left"
    >
      <HandoffRailV3
        activeCall={showSidebar && userPanelOpen}
        payload={payload}
        side="left"
        lookupError={lookupError}
        onClear={onClear}
        onLookup={onLookup}
        patientConfirmed={patientConfirmed}
        onSierraAction={handleSierraAction}
      />
      <CsaShell
        showHeader={false}

        view={effectiveView}
        payload={activeCall ? payload ?? undefined : undefined}
        showHandoffAlertOnWorkspace={!showSidebar}
        onSelectPatient={selectPatient}
        intakeContext={intakeContext ?? undefined}
        onIntakeComplete={handleIntakeComplete}
        onTabNavigate={handleTabNavigate}
        notFoundLabel={notFoundLabel}
      />
    </CsaHandoffFrameV3>
  );
}
