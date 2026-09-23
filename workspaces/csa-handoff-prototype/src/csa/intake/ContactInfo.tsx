import * as React from "react";
import {
  Button,
  Icon,
  Input,
  Label,
  Text,
} from "@everkit/design-system";
import type { IntakeContext } from "./types";
import { inferTimezone } from "./types";

interface ContactInfoProps {
  context: IntakeContext;
  onContinue: (state: string, timezone: string) => void;
}

function toTitleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function ContactInfo({ context, onContinue }: ContactInfoProps) {
  const [state, setState] = React.useState(
    context.state ? toTitleCase(context.state) : "",
  );
  const [timezone, setTimezone] = React.useState(context.timezone ?? "");

  React.useEffect(() => {
    const inferred = inferTimezone(state);
    if (inferred) setTimezone(inferred);
  }, [state]);

  return (
    <div className="flex flex-col gap-[var(--everkit-content-gap-block)]">
      <Text variant="title-default" as="h2">Contact Information</Text>

      <div className="flex flex-col gap-4 max-w-[400px]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-state">State</Label>
          <Input
            id="contact-state"
            value={state}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
            placeholder="e.g. Florida"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-timezone">Timezone</Label>
          <Input
            id="contact-timezone"
            value={timezone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimezone(e.target.value)}
            placeholder="e.g. Eastern"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={() => onContinue(state, timezone)} disabled={!state.trim()}>
          Continue
          <Icon name="arrow_forward" size="sm" aria-hidden className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
