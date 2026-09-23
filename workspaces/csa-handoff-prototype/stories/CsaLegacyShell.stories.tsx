import type { Meta, StoryObj } from "@storybook/react";
import { TRANSFER_CONTEXT_SCENARIOS } from "../src/data/scenarios";
import { CsaLegacyShell } from "../src/csa/legacy/CsaLegacyShell";

const meta = {
  title: "CSA/Legacy Shell",
  component: CsaLegacyShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Faithful reproduction of the current production CSA experience — shown here for contrast with the future-state shell. Dense layouts, clinical forms, inconsistent spacing. Reference: stage-csa.mdlive.com.",
      },
    },
  },
} satisfies Meta<typeof CsaLegacyShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeDashboard: Story = {
  name: "Home dashboard (current)",
  render: () => (
    <div className="h-[100dvh] overflow-auto">
      <CsaLegacyShell view="home" />
    </div>
  ),
};

const authScenario =
  TRANSFER_CONTEXT_SCENARIOS.find((s) => s.id === "demo-member-services-auth") ??
  TRANSFER_CONTEXT_SCENARIOS[0];

export const PatientProfile: Story = {
  name: "Patient profile (current)",
  render: () => (
    <div className="h-[100dvh] overflow-auto">
      <CsaLegacyShell view="profile" payload={authScenario.payload} />
    </div>
  ),
};
