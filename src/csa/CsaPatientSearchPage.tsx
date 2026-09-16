import * as React from "react";
import type { SierraHandoffPayload } from "../data/scenarios";
import { HandoffStatusAlert } from "../handoff/HandoffPanel";
import { isEmergencyHandoff } from "../handoff/utils";
import { CsaPageContainer } from "./CsaPageContainer";
import { CsaSearchResults } from "./CsaSearchResults";
import { CsaSearchWorkspace } from "./CsaSearchWorkspace";
import type { CsaPatientSearchRow } from "./data";
import {
  autoPatientSearchQuery,
  filterPatientSearchRows,
  patientSearchPrefill,
  type PatientSearchPrefill,
} from "./profileUtils";

/**
 * Patient Search — works both during a handoff (payload present, pre-filled, auto-searched)
 * and as a standalone page (no payload, idle empty state until first search).
 */
export function CsaPatientSearchPage({
  payload,
  showHandoffAlert = true,
  onSelectPatient,
}: {
  payload?: SierraHandoffPayload;
  /** False when a parent shell (rail / sticky band) already renders the status alert. */
  showHandoffAlert?: boolean;
  onSelectPatient?: (row: CsaPatientSearchRow) => void;
}) {
  const prefill = payload ? patientSearchPrefill(payload) : undefined;
  const [query, setQuery] = React.useState<PatientSearchPrefill>(() =>
    payload ? autoPatientSearchQuery(payload) : { firstName: "", lastName: "", phone: "", dob: "" },
  );
  // True once the user has submitted a search (or immediately if payload auto-searched).
  const [hasSearched, setHasSearched] = React.useState(!!payload);

  React.useEffect(() => {
    if (payload) {
      setQuery(autoPatientSearchQuery(payload));
      setHasSearched(true);
    }
  }, [payload?.interactionId]);

  const handleSearch = (q: PatientSearchPrefill) => {
    setHasSearched(true);
    setQuery(q);
  };

  const rows = filterPatientSearchRows(query);

  return (
    <CsaPageContainer>
      <div className="grid layout-gutter gap-y-[var(--everkit-content-gap-block)] xl:grid-cols-[440px_minmax(0,1fr)] xl:items-start">
        <aside className="flex min-w-0 flex-col gap-[var(--everkit-content-gap-block)]">
          {showHandoffAlert && payload ? (
            <HandoffStatusAlert payload={payload} showCrisisCta={isEmergencyHandoff(payload)} />
          ) : null}
          <CsaSearchWorkspace
            prefill={prefill}
            prefillKey={payload?.interactionId}
            affiliationKnownDefault={!!payload}
            showSearchTypeTabs={false}
            onSearch={handleSearch}
          />
        </aside>
        <main className="min-w-0">
          <CsaSearchResults
            rows={rows}
            onSelectPatient={onSelectPatient}
            idle={!hasSearched}
          />
        </main>
      </div>
    </CsaPageContainer>
  );
}
