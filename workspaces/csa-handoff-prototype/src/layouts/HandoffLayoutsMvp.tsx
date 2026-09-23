import * as React from "react";
import type { TransferContextScenario, SierraHandoffPayload } from "../data/scenarios";
import type { CsaPatientSearchRow } from "../csa/data";
import { CsaLegacyHeader } from "../csa/legacy/CsaLegacyHeader";
import { CsaLegacyShell } from "../csa/legacy/CsaLegacyShell";
import { useHandoffPanelSession } from "../handoff/HandoffPanel";
import {
  HandoffRailPanelMvp,
  HandoffRailMvp,
  type SierraAction,
} from "../handoff/mvp/HandoffPanelMvp";
import {
  HandoffRailPanelV2,
  HandoffRailV2,
} from "../handoff/v2/HandoffPanelV2";
import { isMemberAuthenticated } from "../handoff/utils";

type LegacyView = "home" | "profile";

function resolveLegacyView(
  payload: SierraHandoffPayload | null,
  patientConfirmed: boolean,
): LegacyView {
  if (!payload) return "home";
  if (isMemberAuthenticated(payload) || patientConfirmed) return "profile";
  return "home";
}

function useMvpNav(payload: SierraHandoffPayload | null) {
  const [patientConfirmed, setPatientConfirmed] = React.useState(false);
  const [showIntakeTab, setShowIntakeTab] = React.useState(false);

  React.useEffect(() => {
    setPatientConfirmed(false);
    setShowIntakeTab(false);
  }, [payload?.interactionId]);

  const handleSierraAction = React.useCallback((action: SierraAction) => {
    if (action.type === "start_intake") {
      setShowIntakeTab(true);
    }
  }, []);

  const handleSelectPatient = React.useCallback((_row: CsaPatientSearchRow) => {
    setPatientConfirmed(true);
  }, []);

  const view = resolveLegacyView(payload, patientConfirmed);
  const activeProfileTab = showIntakeTab ? "Patient Intake" : undefined;

  const initialSearch = React.useMemo(() => {
    if (!payload || isMemberAuthenticated(payload)) return undefined;
    const cf = payload.collectedFields;
    if (!cf.firstName && !cf.lastName && !cf.phone) return undefined;
    return {
      firstName: cf.firstName ?? undefined,
      lastName: cf.lastName ?? undefined,
      phone: cf.phone ?? undefined,
    };
  }, [payload]);

  return { view, activeProfileTab, initialSearch, patientConfirmed, handleSierraAction, handleSelectPatient };
}

// Shared frame: legacy header + [panel | content] below
function MvpHandoffFrame({
  children,
  panelOpen,
  onTogglePanel,
  panelSide,
  activeNavLabel,
}: {
  children: React.ReactNode;
  panelOpen: boolean;
  onTogglePanel: () => void;
  panelSide: "left" | "right";
  activeNavLabel?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      <CsaLegacyHeader
        activeNavLabel={activeNavLabel}
        sierraOpen={panelOpen}
        onToggleSierra={onTogglePanel}
        panelSide={panelSide}
      />
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

export function RightRailLayoutMvp({
  scenario,
  fastFollow = false,
}: {
  scenario: TransferContextScenario;
  fastFollow?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup } = useHandoffPanelSession(scenario);
  const { view, activeProfileTab, initialSearch, patientConfirmed, handleSierraAction, handleSelectPatient } =
    useMvpNav(payload);
  const [panelOpen, setPanelOpen] = React.useState(false);

  // Slide the panel in after initial paint so the animation is visible on load
  React.useEffect(() => {
    if (!payload) return;
    const timer = window.setTimeout(() => setPanelOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [payload?.interactionId]);

  // Clear payload and hide the panel
  const handleClear = React.useCallback(() => {
    onClear?.();
    setPanelOpen(false);
  }, [onClear]);

  return (
    <MvpHandoffFrame
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      panelSide="right"
      activeNavLabel={view === "profile" ? "Patient Search" : "Home"}
    >
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <CsaLegacyShell
          key={payload?.interactionId ?? "idle"}
          showHeader={false}
          view={view}
          payload={payload ?? undefined}
          activeProfileTab={activeProfileTab}
          initialSearch={initialSearch}
          onSelectPatient={handleSelectPatient}
        />
      </div>
      <div
        className="shrink-0 overflow-hidden transition-[width] duration-500 ease-[var(--ease-out)] motion-reduce:transition-none"
        style={{ width: panelOpen ? "400px" : "0px" }}
      >
        <HandoffRailPanelMvp
          payload={payload}
          side="right"
          lookupError={lookupError}
          onClear={handleClear}
          onLookup={onLookup}
          onSierraAction={handleSierraAction}
          patientConfirmed={patientConfirmed}
          fastFollow={fastFollow}
        />
      </div>
    </MvpHandoffFrame>
  );
}

export function RightRailLayoutV2({ scenario }: { scenario: TransferContextScenario }) {
  const { payload, lookupError, onClear, onLookup } = useHandoffPanelSession(scenario);
  const { view, activeProfileTab, initialSearch, patientConfirmed, handleSierraAction, handleSelectPatient } =
    useMvpNav(payload);
  const [panelOpen, setPanelOpen] = React.useState(false);

  React.useEffect(() => {
    if (!payload) return;
    const timer = window.setTimeout(() => setPanelOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [payload?.interactionId]);

  const handleClear = React.useCallback(() => {
    onClear?.();
    setPanelOpen(false);
  }, [onClear]);

  return (
    <MvpHandoffFrame
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      panelSide="right"
      activeNavLabel={view === "profile" ? "Patient Search" : "Home"}
    >
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <CsaLegacyShell
          key={payload?.interactionId ?? "idle"}
          showHeader={false}
          view={view}
          payload={payload ?? undefined}
          activeProfileTab={activeProfileTab}
          initialSearch={initialSearch}
          onSelectPatient={handleSelectPatient}
        />
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
          onSierraAction={handleSierraAction}
          patientConfirmed={patientConfirmed}
        />
      </div>
    </MvpHandoffFrame>
  );
}

export function LeftRailLayoutV2({
  scenario,
  activeCall = false,
}: {
  scenario: TransferContextScenario;
  activeCall?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup } = useHandoffPanelSession(scenario);
  const { view, activeProfileTab, initialSearch, patientConfirmed, handleSierraAction, handleSelectPatient } =
    useMvpNav(payload);
  const [panelOpen, setPanelOpen] = React.useState(true);

  React.useEffect(() => {
    if (payload) setPanelOpen(true);
  }, [payload?.interactionId]);

  const handleClear = React.useCallback(() => {
    onClear?.();
    setPanelOpen(false);
  }, [onClear]);

  return (
    <MvpHandoffFrame
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      panelSide="left"
      activeNavLabel={view === "profile" ? "Patient Search" : "Home"}
    >
      <HandoffRailV2
        activeCall={activeCall && payload != null && panelOpen}
        payload={payload}
        side="left"
        lookupError={lookupError}
        onClear={handleClear}
        onLookup={onLookup}
        onSierraAction={handleSierraAction}
        patientConfirmed={patientConfirmed}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <CsaLegacyShell
          key={payload?.interactionId ?? "idle"}
          showHeader={false}
          view={view}
          payload={payload ?? undefined}
          activeProfileTab={activeProfileTab}
          initialSearch={initialSearch}
          onSelectPatient={handleSelectPatient}
        />
      </div>
    </MvpHandoffFrame>
  );
}

export function LeftRailLayoutMvp({
  scenario,
  activeCall = false,
  fastFollow = false,
}: {
  scenario: TransferContextScenario;
  activeCall?: boolean;
  fastFollow?: boolean;
}) {
  const { payload, lookupError, onClear, onLookup } = useHandoffPanelSession(scenario);
  const { view, activeProfileTab, initialSearch, patientConfirmed, handleSierraAction, handleSelectPatient } =
    useMvpNav(payload);
  const [panelOpen, setPanelOpen] = React.useState(true);

  // Open the panel whenever a new call arrives
  React.useEffect(() => {
    if (payload) setPanelOpen(true);
  }, [payload?.interactionId]);

  // Clear payload and hide the panel
  const handleClear = React.useCallback(() => {
    onClear?.();
    setPanelOpen(false);
  }, [onClear]);

  return (
    <MvpHandoffFrame
      panelOpen={panelOpen}
      onTogglePanel={() => setPanelOpen((v) => !v)}
      panelSide="left"
      activeNavLabel={view === "profile" ? "Patient Search" : "Home"}
    >
      <HandoffRailMvp
        activeCall={activeCall && payload != null && panelOpen}
        payload={payload}
        side="left"
        lookupError={lookupError}
        onClear={handleClear}
        onLookup={onLookup}
        onSierraAction={handleSierraAction}
        patientConfirmed={patientConfirmed}
        fastFollow={fastFollow}
      />
      <div style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <CsaLegacyShell
          key={payload?.interactionId ?? "idle"}
          showHeader={false}
          view={view}
          payload={payload ?? undefined}
          activeProfileTab={activeProfileTab}
          initialSearch={initialSearch}
          onSelectPatient={handleSelectPatient}
        />
      </div>
    </MvpHandoffFrame>
  );
}
