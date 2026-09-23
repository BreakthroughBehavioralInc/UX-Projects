import type { SierraHandoffPayload } from "../data/scenarios";
import { CsaFooter } from "./CsaFooter";
import { CsaHeader } from "./CsaHeader";
import { CsaHomePage } from "./CsaHomePage";
import { CsaNotFoundPage } from "./CsaNotFoundPage";
import { CsaPatientProfile } from "./CsaPatientProfile";
import { CsaPatientSearchPage } from "./CsaPatientSearchPage";
import { CsaWorkspaceNav } from "./CsaWorkspaceNav";
import type { CsaPatientSearchRow } from "./data";
import { CsaPatientIntake } from "./intake/CsaPatientIntake";
import type { IntakeContext } from "./intake/types";
import { type CsaShellView, csaActiveNavLabel } from "./profileUtils";

export type { CsaShellView };

export function CsaShell({
  view = "home",
  payload,
  showHeader = true,
  showFooter = true,
  showHandoffAlertOnWorkspace = true,
  onSelectPatient,
  intakeContext,
  onIntakeComplete,
  onTabNavigate,
  onNavClick,
  notFoundLabel,
}: {
  view?: CsaShellView;
  payload?: SierraHandoffPayload;
  showHeader?: boolean;
  showFooter?: boolean;
  showHandoffAlertOnWorkspace?: boolean;
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
  intakeContext?: IntakeContext;
  onIntakeComplete?: () => void;
  onTabNavigate?: (nextView: CsaShellView) => void;
  onNavClick?: (label: string) => void;
  notFoundLabel?: string;
}) {
  const showWorkspaceNav =
    (view === "profile" || view === "intake") && !!payload;

  return (
    <div className="density-compact flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--background)]">
      {showHeader ? (
        <CsaHeader
          activeNavLabel={csaActiveNavLabel(view)}
          onNavClick={onNavClick}
        />
      ) : null}

      <div className="flex min-h-0 flex-1">
        {showWorkspaceNav && (
          <CsaWorkspaceNav view={view} onNavigate={onTabNavigate} />
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--muted)]">
          <div className="flex-1">
            {view === "not-found" ? (
              <CsaNotFoundPage page={notFoundLabel} />
            ) : view === "intake" && intakeContext ? (
              <CsaPatientIntake context={intakeContext} onComplete={onIntakeComplete} />
            ) : view === "profile" && payload ? (
              <CsaPatientProfile payload={payload} />
            ) : view === "patient-search" ? (
              <CsaPatientSearchPage
                payload={payload}
                showHandoffAlert={showHandoffAlertOnWorkspace}
                onSelectPatient={onSelectPatient}
              />
            ) : (
              <CsaHomePage />
            )}
          </div>
          {showFooter && <CsaFooter />}
        </div>
      </div>
    </div>
  );
}
