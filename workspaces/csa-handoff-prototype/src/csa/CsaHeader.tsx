import * as React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Header,
  HeaderActions,
  HeaderBar,
  HeaderIconButton,
  HeaderLogo,
  HeaderNav,
  Icon,
  Label,
  Logo,
  NavLink,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Switch,
  Text,
} from "@everkit/design-system";
import { CSA_NAV } from "./data";

const APPLICATION_BAR_CLASS = "mx-0 max-w-none";

export function CsaHeader({
  activeNavLabel = "Home",
  onNavClick,
  aiPanelOpen,
  onToggleAiPanel,
  panelSide = "right",
}: {
  activeNavLabel?: string | null;
  onNavClick?: (label: string) => void;
  aiPanelOpen?: boolean;
  onToggleAiPanel?: () => void;
  panelSide?: "left" | "right";
}) {
  const [chatAvailable, setChatAvailable] = React.useState(false);

  const panelIcon =
    panelSide === "left"
      ? aiPanelOpen
        ? "left_panel_close"
        : "left_panel_open"
      : aiPanelOpen
        ? "right_panel_close"
        : "right_panel_open";

  const panelToggle =
    onToggleAiPanel !== undefined ? (
      <HeaderIconButton
        icon={panelIcon}
        aria-label={aiPanelOpen ? "Close Sierra panel" : "Open Sierra panel"}
        onClick={onToggleAiPanel}
      />
    ) : null;

  return (
    <Header
      sticky={false}
      layout="application"
      className="relative z-[var(--everkit-z-sticky)] shrink-0"
    >
      <HeaderBar layout="application" className={APPLICATION_BAR_CLASS}>
        {panelSide === "left" && panelToggle}

        <HeaderLogo href="#">
          <Logo brand="mdlive" size="md" />
        </HeaderLogo>

        {/* NavigationMenu handles hover-open flyouts natively via a shared viewport —
            no gap between trigger and panel, no timers, no flicker. Flat links (no
            menu) fall back to plain NavLink outside NavigationMenu so they retain
            the 4-px current-page underline indicator. */}
        <HeaderNav>
          {/* h-full + self-stretch propagate the HeaderBar height into the menu root so
              NavigationMenuTrigger / NavigationMenuLink h-full resolves instead of collapsing. */}
          <NavigationMenu className="h-full self-stretch max-w-none">
            <NavigationMenuList className="h-full">
              {CSA_NAV.map((item) => {
                const current = activeNavLabel != null && item.label === activeNavLabel;

                if (!item.menu) {
                  return (
                    <NavigationMenuItem key={item.label}>
                      <NavLink
                        href="#"
                        current={current}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          onNavClick?.(item.label);
                        }}
                      >
                        {item.label}
                      </NavLink>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger
                      aria-current={current ? "page" : undefined}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="min-w-[180px]">
                        {item.menu.map((entry) => (
                          <li key={entry.label}>
                            <NavigationMenuLink
                              href="#"
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                onNavClick?.(entry.label);
                              }}
                            >
                              {entry.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </HeaderNav>

        {/* Agent avatar — availability badge + account dropdown */}
        <HeaderActions className="gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Agent menu"
                className="relative flex shrink-0 items-center rounded-full transition-shadow hover:ring-2 hover:ring-[var(--everkit-color-border-brand)] hover:ring-offset-2 hover:ring-offset-[var(--everkit-color-header-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              >
                <Avatar size="sm" shape="circle">
                  <AvatarFallback variant="brand-subtle">QA</AvatarFallback>
                  <AvatarBadge
                    aria-label={chatAvailable ? "Available for chat" : "Not available for chat"}
                    className={[
                      "ring-[var(--everkit-color-header-bg)]",
                      chatAvailable
                        ? "bg-[var(--everkit-color-content-success)]"
                        : "bg-[var(--muted-foreground)]",
                    ].join(" ")}
                  />
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col gap-0.5 px-3 py-2">
                <Text variant="body-small" weight="strong">qaadmin14</Text>
                <Text variant="meta-small" className="text-muted-foreground">Administrator</Text>
                <Text variant="meta-small" className="text-muted-foreground">Timezone: PST</Text>
              </div>

              <DropdownMenuSeparator />

              <div
                className="flex items-center justify-between px-3 py-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Label
                  htmlFor="csa-chat-available"
                  className="cursor-pointer select-none text-sm font-normal"
                >
                  Available for chat
                </Label>
                <Switch
                  id="csa-chat-available"
                  checked={chatAvailable}
                  onCheckedChange={setChatAvailable}
                  aria-label="Toggle chat availability"
                />
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-[var(--everkit-color-content-error)] focus:text-[var(--everkit-color-content-error)]">
                <Icon name="logout" size="sm" aria-hidden className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {panelSide === "right" && panelToggle}
        </HeaderActions>
      </HeaderBar>
    </Header>
  );
}
