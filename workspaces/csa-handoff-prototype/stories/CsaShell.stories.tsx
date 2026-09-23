import type { Meta, StoryObj } from "@storybook/react";
import { TRANSFER_CONTEXT_SCENARIOS } from "../src/data/scenarios";
import { CsaShell } from "../src/csa/CsaShell";

const meta = {
  title: "CSA/Shell",
  component: CsaShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CSA shells rebuilt with everkit only — home dashboard (patient search + upcoming appointments) and patient profile (post-authentication destination).",
      },
    },
  },
} satisfies Meta<typeof CsaShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeDashboard: Story = {
  name: "Home dashboard",
  render: () => (
    <div className="h-[100dvh] overflow-hidden">
      <CsaShell />
    </div>
  ),
};

const authenticatedScenario =
  TRANSFER_CONTEXT_SCENARIOS.find((s) => s.id === "demo-member-services-auth") ??
  TRANSFER_CONTEXT_SCENARIOS[0];

export const PatientProfile: Story = {
  name: "Patient profile (authenticated)",
  render: () => (
    <div className="h-[100dvh] overflow-hidden">
      <CsaShell view="profile" payload={authenticatedScenario.payload} />
    </div>
  ),
};

const notAuthScenario =
  TRANSFER_CONTEXT_SCENARIOS.find((s) => s.id === "demo-member-services-not-auth") ??
  TRANSFER_CONTEXT_SCENARIOS[1];

export const PatientSearchHandoff: Story = {
  name: "Patient Search (not authenticated call)",
  render: () => (
    <div className="h-[100dvh] overflow-hidden">
      <CsaShell view="patient-search" payload={notAuthScenario.payload} />
    </div>
  ),
};
