import type { SierraHandoffPayload } from "../../data/scenarios";
import type { CsaPatientSearchRow } from "../data";
import { CsaLegacyFooter } from "./CsaLegacyFooter";
import { CsaLegacyHeader } from "./CsaLegacyHeader";
import { CsaLegacyHomePage } from "./CsaLegacyHomePage";
import { CsaLegacyPatientProfile } from "./CsaLegacyPatientProfile";

export type CsaLegacyView = "home" | "profile";

interface Props {
  view?: CsaLegacyView;
  payload?: SierraHandoffPayload;
  onNavClick?: (label: string) => void;
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
  /** Pre-selects a tab on the patient profile (e.g. "Patient Intake"). */
  activeProfileTab?: string;
  /** Pre-fills the patient search form and auto-shows results. */
  initialSearch?: { firstName?: string; lastName?: string; phone?: string };
  /** Set false when the parent provides the header (e.g. handoff frame). Defaults to true. */
  showHeader?: boolean;
}

export function CsaLegacyShell({
  view = "home",
  payload,
  onNavClick,
  onSelectPatient,
  activeProfileTab,
  initialSearch,
  showHeader = true,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", fontFamily: "Arial, sans-serif" }}>
      {showHeader && (
        <CsaLegacyHeader
          activeNavLabel={view === "profile" ? "Patient Search" : "Home"}
          onNavClick={onNavClick}
        />
      )}

      <main style={{ flex: 1, overflow: "auto" }}>
        {view === "profile" ? (
          <CsaLegacyPatientProfile
            payload={payload}
            defaultTab={activeProfileTab as Parameters<typeof CsaLegacyPatientProfile>[0]["defaultTab"]}
          />
        ) : (
          <CsaLegacyHomePage onSelectPatient={onSelectPatient} initialSearch={initialSearch} />
        )}
      </main>

      <CsaLegacyFooter />
    </div>
  );
}
