/**
 * CSA handoff demo scenarios (1–10) for Storybook walkthrough.
 *
 * @see src/data/scenarios.ts
 */

export const MVP_MASTER_FLOW_FIGJAM = {
  fileKey: "fCUSpphZcLFL4GP8hdDsW4",
  sectionNodeId: "1771:9321",
  sectionName: "MVP Master Flows",
} as const;

/** Demo scenario index numbers — the only presets in this prototype. */
export const MVP_MASTER_FLOW_SCENARIO_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const;

export type MvpMasterFlowScenarioNumber = (typeof MVP_MASTER_FLOW_SCENARIO_NUMBERS)[number];

/** Flow branch labels for the scenario review bar. */
export const MVP_FLOW_BRANCH: Record<number, string> = {
  1:  "Schedule visit · authenticated · consent agreed",
  2:  "Schedule visit · not authenticated · last name Carrigo (no match) · correct to Carrillo and Search",
  3:  "Multiple accounts · not authenticated · consent agreed · select correct affiliation",
  4:  "Spanish-speaking member · authenticated · consent agreed · may need interpreter",
  5:  "Caregiver proxy · parent calling for minor child (8yo) · authenticated · urgent care",
  6:  "Consent declined (scheduling blocked) · authenticated · stomachache · card = error",
  7:  "Consent declined (billing inquiry) · authenticated · card = warning only (not blocked)",
  8:  "Pharmacy on behalf of patient · authenticated · consent not read",
  9:  "Pharmacy on behalf of patient · not authenticated · consent not read",
  10: "Dermatology inquiry (not booking) · authenticated · consent agreed",
  11: "Dermatology inquiry (not booking) · not authenticated · consent agreed",
  12: "Behavioral health scheduling (non-crisis) · authenticated · consent agreed",
  13: "Live agent retention · caller wanted to disconnect · auth not attempted",
  14: "Mental health crisis · no identity known",
  19: "Mental health crisis · name captured · not authenticated",
  16: "Live agent retention · intent captured · name/DOB not collected",
  17: "Live agent retention · intent + name captured · DOB not collected",
  18: "Live agent retention · intent + name + DOB captured · ready for confirmation",
  15: "Dropped call · Call Summary empty · look up Call ID to restore",
};
