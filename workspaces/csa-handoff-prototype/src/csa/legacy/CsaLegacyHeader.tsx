import * as React from "react";
import { HeaderIconButton } from "@everkit/design-system";
import { CSA_NAV } from "../data";

const TEAL = "#176B76";

interface Props {
  activeNavLabel?: string;
  onNavClick?: (label: string) => void;
  /** Whether the Sierra handoff panel is open. Pass to show a toggle button. */
  sierraOpen?: boolean;
  onToggleSierra?: () => void;
  /** Which side the panel is on (controls arrow direction). */
  panelSide?: "left" | "right";
}

export function CsaLegacyHeader({
  activeNavLabel = "Home",
  onNavClick,
  sierraOpen,
  onToggleSierra,
  panelSide = "right",
}: Props) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  return (
    <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #ccc" }}>
      {/* Logo row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
        }}
      >
        {/* Logo */}
        <div>
          <div style={{ fontSize: "26px", fontWeight: 700, color: TEAL, lineHeight: 1.1 }}>
            MD Live
          </div>
          <div style={{ fontSize: "11px", color: TEAL, fontStyle: "italic" }}>
            By <strong>EVERNORTH</strong>
            <sup style={{ fontSize: "9px" }}>+</sup>
          </div>
        </div>

        {/* Agent info + logout */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: TEAL,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                justifyContent: "flex-end",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ flexShrink: 0 }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>{" "}
              Set Chat Available
            </div>
            <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
              You are NOT available to chat. Please mark yourself chat available.
            </div>
            <div style={{ fontSize: "11px", color: "#555" }}>No chats are waiting</div>
          </div>

          <div style={{ textAlign: "right", fontSize: "13px" }}>
            <div style={{ fontWeight: 600, color: "#222" }}>qaadmin14</div>
            <div style={{ color: "#555" }}>Administrator</div>
          </div>

          <button
            style={{
              backgroundColor: TEAL,
              color: "#fff",
              border: "none",
              padding: "8px 22px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              borderRadius: "2px",
              alignSelf: "center",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Nav row */}
      <nav
        style={{
          borderTop: "1px solid #ddd",
          padding: "0 4px",
          display: "flex",
          alignItems: "stretch",
        }}
        onMouseLeave={() => setOpenMenu(null)}
      >
        {onToggleSierra !== undefined && panelSide === "left" && (
          <LegacySierraToggle open={!!sierraOpen} side="left" onToggle={onToggleSierra} />
        )}
        {CSA_NAV.map((item) => {
          const isActive = item.label === activeNavLabel;
          if (!item.menu) {
            return (
              <button
                key={item.label}
                onClick={() => onNavClick?.(item.label)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${TEAL}` : "2px solid transparent",
                  cursor: "pointer",
                  padding: "10px 11px",
                  fontSize: "13px",
                  color: TEAL,
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </button>
            );
          }

          return (
            <div key={item.label} style={{ position: "relative" }}>
              <button
                onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                onMouseEnter={() => setOpenMenu(item.label)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${TEAL}` : "2px solid transparent",
                  cursor: "pointer",
                  padding: "10px 11px",
                  fontSize: "13px",
                  color: TEAL,
                  fontWeight: isActive ? 600 : 400,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
                <span style={{ fontSize: "9px", marginTop: "1px" }}>▼</span>
              </button>

              {openMenu === item.label && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 200,
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    minWidth: "200px",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.12)",
                  }}
                  onMouseEnter={() => setOpenMenu(item.label)}
                >
                  {item.menu.map((entry) => (
                    <LegacyDropdownItem
                      key={entry.label}
                      label={entry.label}
                      onSelect={() => {
                        onNavClick?.(entry.label);
                        setOpenMenu(null);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {onToggleSierra !== undefined && panelSide === "right" && (
          <LegacySierraToggle open={!!sierraOpen} side="right" onToggle={onToggleSierra} />
        )}
      </nav>
    </header>
  );
}

function LegacySierraToggle({
  open,
  side,
  onToggle,
}: {
  open: boolean;
  side: "left" | "right";
  onToggle: () => void;
}) {
  const icon =
    side === "left"
      ? open ? "left_panel_close" : "left_panel_open"
      : open ? "right_panel_close" : "right_panel_open";

  return (
    <div style={{ marginLeft: "auto", marginRight: "4px", alignSelf: "center" }}>
      <HeaderIconButton
        icon={icon}
        aria-label={open ? "Close Sierra panel" : "Open Sierra panel"}
        onClick={onToggle}
      />
    </div>
  );
}

function LegacyDropdownItem({
  label,
  onSelect,
}: {
  label: string;
  onSelect: () => void;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: hover ? "#f0f0f0" : "none",
        border: "none",
        cursor: "pointer",
        padding: "7px 14px",
        fontSize: "13px",
        color: "#176B76",
      }}
    >
      {label}
    </button>
  );
}
