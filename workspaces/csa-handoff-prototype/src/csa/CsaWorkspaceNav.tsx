import * as React from "react";
import {
  Icon,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@everkit/design-system";
import type { CsaShellView } from "./profileUtils";

interface WorkspaceNavItem {
  id: string;
  label: string;
  icon?: string;
  view?: CsaShellView;
  disabled?: boolean;
}

const WORKSPACE_NAV: WorkspaceNavItem[] = [
  { id: "profile",            label: "Profile",                   icon: "person",                view: "profile" },
  { id: "new-consultation",   label: "New Consultation",          icon: "medical_services",      view: "intake"  },
  { id: "escalations",        label: "Escalations",               icon: "priority_high",         disabled: true  },
  { id: "appointments",       label: "Appointments",              icon: "calendar_today",        disabled: true  },
  { id: "appt-requests",      label: "Appointment Requests",      icon: "pending_actions",       disabled: true  },
  { id: "billing",            label: "Billing/Credits",           icon: "payment",               disabled: true  },
  { id: "insurance-details",  label: "Insurance Details",         icon: "health_and_safety",     disabled: true  },
  { id: "eligible-members",   label: "Eligible Members",          icon: "group",                 disabled: true  },
  { id: "health-history",     label: "Health History",            icon: "history",               disabled: true  },
  { id: "pharmacy-rx",        label: "Pharmacy/Rx",               icon: "medication",            disabled: true  },
  { id: "notes",              label: "Notes",                     icon: "note_alt",              disabled: true  },
  { id: "activity",           label: "Activity History",          icon: "timeline",              disabled: true  },
  { id: "chat-history",       label: "Chat History",              icon: "chat",                  disabled: true  },
  { id: "orders",             label: "Orders",                    icon: "receipt_long",          disabled: true  },
  { id: "schedule-sessions",  label: "Schedule Sessions",         icon: "event_available",       disabled: true  },
  { id: "audit-logs",         label: "Audit Logs",                icon: "manage_search",         disabled: true  },
  { id: "records",            label: "Records",                   icon: "folder",                disabled: true  },
  { id: "hets-transaction",   label: "Hets Transaction 270/271",  icon: "sync_alt",              disabled: true  },
  { id: "transaction-history",label: "Transaction History",       icon: "account_balance_wallet",disabled: true  },
  { id: "labs",               label: "Labs",                      icon: "science",               disabled: true  },
];

interface CsaWorkspaceNavProps {
  view: CsaShellView;
  onNavigate?: (nextView: CsaShellView) => void;
}

export function CsaWorkspaceNav({ view, onNavigate }: CsaWorkspaceNavProps) {
  return (
    <div
      className="relative h-full shrink-0 overflow-hidden [transform:translateZ(0)]"
      style={{ width: "192px" }}
    >
      <SidebarProvider
        defaultOpen
        className="h-full min-h-0"
        style={{ "--sidebar-width": "192px" } as React.CSSProperties}
      >
        <Sidebar collapsible="none" className="h-full border-r border-[var(--everkit-color-sidenav-border)]">
          <SidebarContent>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  {WORKSPACE_NAV.map((item) => {
                    const isActive = item.view === view;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={isActive}
                          disabled={item.disabled}
                          tone="neutral"
                          onClick={() =>
                            !item.disabled && item.view && onNavigate?.(item.view)
                          }
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              size="xs"
                              fill={isActive ? 1 : 0}
                              aria-hidden
                            />
                          )}
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}
