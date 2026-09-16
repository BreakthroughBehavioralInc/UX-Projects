/**
 * Demo — Finesse → CSA
 *
 * Mock Cisco Finesse CTI page, styled to match the real Finesse UI.
 * Ready → Reserved (auto 1.5s) → Talking + CSA V2 opens in new tab.
 */
import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

// ---------------------------------------------------------------------------
// Design tokens — light Finesse theme
// ---------------------------------------------------------------------------

const C = {
  pageBg:        "#f0f2f4",
  headerBg:      "#ffffff",
  headerBorder:  "#c8ccd0",
  sidebarBg:     "#2c2c2e",
  sidebarActive: "#0d5aa7",
  sidebarIcon:   "#9ca3af",
  panelBg:       "#ffffff",
  rowAlt:        "#f6f8fa",
  rowBorder:     "#e6e9ef",
  text:          "#24292f",
  muted:         "#6e7781",
  dim:           "#d0d7de",
  // States
  ready:         "#1a7f37",
  readyBg:       "#e6f4ea",
  reserved:      "#b96f00",
  reservedBg:    "#fff8e1",
  talking:       "#0969da",
  talkingBg:     "#e8f0fe",
  // Badges
  badgeTalking:  { bg: "#dbeafe", text: "#1d4ed8", dot: "#2563eb"  },
  badgeWrapUp:   { bg: "#fef3c7", text: "#92400e", dot: "#d97706"  },
  badgeReserved: { bg: "#fef3c7", text: "#92400e", dot: "#d97706"  },
  badgeNotReady: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444"  },
  // Actions
  green:         "#1a7f37",
  red:           "#cf222e",
  callBarBg:     "#f6f8fa",
} as const;

const BASE: React.CSSProperties = {
  fontFamily: "'Segoe UI', 'Open Sans', Arial, sans-serif",
  fontSize: "13px",
  color: C.text,
  boxSizing: "border-box",
};

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

type FinesseState = "ready" | "reserved" | "talking";

const V2_STORY_URL =
  "/iframe.html?globals=&id=1-%C2%B7-mvp-v2--right-rail&viewMode=story";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFullDuration(s: number): string {
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PhoneIcon({ size = 18, color = C.text }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
    </svg>
  );
}

function HomeIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function ClockIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
    </svg>
  );
}

function UserIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Cigna logo (SVG approximation)
// ---------------------------------------------------------------------------

function CignaLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="11" r="9"  fill="#007b87" />
      <circle cx="12" cy="24" r="8"  fill="#0096a9" />
      <circle cx="28" cy="24" r="8"  fill="#007b87" />
      <rect   x="18.5" y="24" width="3" height="12" rx="1.5" fill="#5a5a5a" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Header status pill
// ---------------------------------------------------------------------------

function StatusPill({ state, duration }: { state: FinesseState; duration: number }) {
  const cfg = {
    ready:    { color: C.ready,    bg: C.readyBg,    label: "Ready"    },
    reserved: { color: C.reserved, bg: C.reservedBg, label: "Reserved" },
    talking:  { color: C.talking,  bg: C.talkingBg,  label: "Talking"  },
  }[state];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        backgroundColor: cfg.bg,
        border: `1.5px solid ${cfg.color}`,
        borderRadius: 20,
        padding: "5px 14px 5px 6px",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          backgroundColor: cfg.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <PhoneIcon size={15} color="#fff" />
      </div>
      <span style={{ color: cfg.color, fontWeight: 700, fontSize: 13 }}>
        {cfg.label}
      </span>
      {(state === "ready" || state === "talking") && duration > 0 && (
        <span style={{ color: C.muted, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
          {formatFullDuration(duration)}
        </span>
      )}
      <svg width={14} height={14} viewBox="0 0 24 24" fill={cfg.color}>
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function FinesseHeader({ state, duration }: { state: FinesseState; duration: number }) {
  return (
    <header
      style={{
        ...BASE,
        backgroundColor: C.headerBg,
        borderBottom: `1px solid ${C.headerBorder}`,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 200 }}>
        <CignaLogo size={32} />
        <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
          Cigna Finesse
        </span>
      </div>

      <StatusPill state={state} duration={duration} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 200, justifyContent: "flex-end" }}>
        {state === "talking" && (
          <button
            style={{
              backgroundColor: "#e65100",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Request Wrap-Up?
          </button>
        )}
        <button
          style={{
            backgroundColor: "transparent",
            color: C.muted,
            border: `1px solid ${C.dim}`,
            borderRadius: 4,
            padding: "5px 12px",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Logout
          <svg width={13} height={13} viewBox="0 0 24 24" fill={C.muted}><path d="M7 10l5 5 5-5z" /></svg>
        </button>
        <div
          style={{
            width: 30, height: 30, borderRadius: "50%",
            backgroundColor: C.dim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <UserIcon size={16} color={C.muted} />
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function FinesseSidebar() {
  return (
    <nav
      style={{
        width: 64,
        backgroundColor: C.sidebarBg,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        paddingTop: 8,
        gap: 2,
      }}
    >
      {[
        { icon: <HomeIcon size={20} />,  label: "Home",                 active: true  },
        { icon: <ClockIcon size={20} />, label: "Call History",         active: false },
        { icon: <ClockIcon size={20} />, label: "Agent History Report", active: false },
      ].map((item) => (
        <div
          key={item.label}
          title={item.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "10px 4px",
            backgroundColor: item.active ? C.sidebarActive : "transparent",
            color: item.active ? "#ffffff" : C.sidebarIcon,
            cursor: "pointer",
          }}
        >
          {item.icon}
          <span style={{ fontSize: 9, textAlign: "center", lineHeight: 1.2, maxWidth: 56 }}>
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: C.text,
        backgroundColor: C.rowAlt,
        borderBottom: `1px solid ${C.rowBorder}`,
        padding: "6px 12px",
      }}
    >
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Send Digits
// ---------------------------------------------------------------------------

function SendDigitsSection() {
  return (
    <div style={{ borderBottom: `1px solid ${C.rowBorder}` }}>
      <SectionHeader label="Send Digits" />
      <div style={{ padding: "10px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              readOnly
              placeholder="Enter digits"
              style={{
                width: 110,
                border: `1px solid ${C.dim}`,
                borderRadius: 3,
                padding: "4px 6px",
                fontSize: 12,
                color: C.text,
                backgroundColor: "#fff",
              }}
            />
            <span style={{ color: C.muted }}>#</span>
            <button
              style={{
                backgroundColor: "#0078a3",
                color: "#fff",
                border: "none",
                borderRadius: 3,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phone Book
// ---------------------------------------------------------------------------

function PhoneBookSection() {
  return (
    <div style={{ borderBottom: `1px solid ${C.rowBorder}` }}>
      <div
        style={{
          fontSize: 12,
          color: "#0078a3",
          cursor: "pointer",
          backgroundColor: C.rowAlt,
          borderBottom: `1px solid ${C.rowBorder}`,
          padding: "6px 12px",
          fontWeight: 600,
        }}
      >
        Phone Book — Click here to view or hide phonebook
      </div>
      <div style={{ padding: "10px 12px", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {["Search Contacts", "Select from ContactList or Enter number"].map((ph, i) => (
          <div
            key={ph}
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${C.dim}`,
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <input
              readOnly
              placeholder={ph}
              style={{
                width: i === 0 ? 160 : 240,
                padding: "4px 8px",
                fontSize: 12,
                border: "none",
                outline: "none",
              }}
            />
            <span style={{ padding: "0 8px", color: C.muted, cursor: "pointer" }}>✕</span>
          </div>
        ))}
        {["Direct Transfer", "Consult"].map((label) => (
          <button
            key={label}
            style={{
              backgroundColor: "#0078a3",
              color: "#fff",
              border: "none",
              borderRadius: 3,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const BADGE_CONFIG = {
  "Wrap-Up":  C.badgeWrapUp,
  "Talking":  C.badgeTalking,
  "Reserved": C.badgeReserved,
  "Not Ready": C.badgeNotReady,
} as const;
type BadgeLabel = keyof typeof BADGE_CONFIG;

function StatusBadge({ label }: { label: BadgeLabel }) {
  const cfg = BADGE_CONFIG[label];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.dot}44`,
        borderRadius: 3,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: cfg.dot, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Agent History
// ---------------------------------------------------------------------------

const HISTORY_ROWS: Array<{ status: BadgeLabel; note?: string; time?: string; dur?: string }> = [
  { status: "Wrap-Up",  time: "Thu, Sep 10th, 4:51:53 PM", dur: "00:20" },
  { status: "Talking",  time: "Thu, Sep 10th, 4:51:32 PM", dur: "13:38" },
  { status: "Reserved", time: "Thu, Sep 10th, 4:37:54 PM"               },
  { status: "Not Ready", note: "Project - General"                       },
  { status: "Not Ready"                                                   },
];

function AgentHistorySection() {
  return (
    <div style={{ borderBottom: `1px solid ${C.rowBorder}` }}>
      <SectionHeader label="Agent History" />
      {HISTORY_ROWS.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 12px",
            backgroundColor: i % 2 === 0 ? "#fff" : C.rowAlt,
            borderBottom: `1px solid ${C.rowBorder}`,
          }}
        >
          <UserIcon size={14} color={C.muted} />
          <StatusBadge label={row.status} />
          {row.note && <span style={{ color: C.text, fontSize: 12 }}>{row.note}</span>}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            {row.time && (
              <span style={{ color: C.muted, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill={C.muted}>
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z" />
                </svg>
                {row.time}
              </span>
            )}
            {row.dur && (
              <span style={{ color: C.muted, fontSize: 11, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width={11} height={11} viewBox="0 0 24 24" fill={C.muted}>
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
                {row.dur}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Queue Statistics
// ---------------------------------------------------------------------------

function QueueStatisticsSection() {
  return (
    <div>
      <SectionHeader label="Queue Statistics" />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ backgroundColor: C.rowAlt }}>
            {["Queue Name", "# Calls", "Max Time", "Ready", "Not Ready", "Active In", "Active Out", "Other"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "5px 10px",
                  textAlign: "left",
                  color: C.muted,
                  fontWeight: 600,
                  borderBottom: `1px solid ${C.rowBorder}`,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {["MD Live Main — Inbound", "3", "00:04:22", "12", "2", "8", "0", "0"].map((v, i) => (
              <td key={i} style={{ padding: "5px 10px", color: C.text }}>{v}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Incoming call popup
// ---------------------------------------------------------------------------

function PhoneRingAnimation() {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 2), 600);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        backgroundColor: frame === 0 ? "#374151" : "#1f2937",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background-color 0.3s",
      }}
    >
      <PhoneIcon size={20} color="#9ca3af" />
      <span style={{ color: "#6b7280", fontSize: 9, marginTop: 1, fontVariantNumeric: "tabular-nums" }}>
        00:00
      </span>
    </div>
  );
}

function IncomingCallPopup({ onAnswer }: { onAnswer: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        width: 310,
        backgroundColor: "#2c2c2e",
        borderRadius: 8,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        overflow: "hidden",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "#1e1e20",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600 }}>
          Incoming Call from +1 (408) 222-2231
        </span>
        <span style={{ color: "#9ca3af", cursor: "pointer" }}>—</span>
      </div>
      <div style={{ padding: "12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <PhoneRingAnimation />
        <div style={{ flex: 1, fontSize: 11 }}>
          {[
            ["Skill Name", "MDL_CallCtrGrnd"],
            ["A", "Ph=4082222231 LegalPlayed=N"],
            ["B", "8886764204 Virtual Visits"],
            ["C", "MD Live Main — Inbound"],
            ["D", "?"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
              <span style={{ color: "#9ca3af", minWidth: 60 }}>{k}</span>
              <span style={{ color: "#d1d5db" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onAnswer}
        style={{
          width: "100%",
          backgroundColor: "#16a34a",
          color: "#fff",
          border: "none",
          padding: "12px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.03em",
        }}
      >
        Answer
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Call bar (Talking state)
// ---------------------------------------------------------------------------

function CallBar({ duration }: { duration: number }) {
  return (
    <div
      style={{
        backgroundColor: C.callBarBg,
        borderBottom: `1px solid ${C.dim}`,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontVariantNumeric: "tabular-nums",
          fontWeight: 600,
          fontSize: 13,
          color: C.text,
          minWidth: 64,
        }}
      >
        {formatFullDuration(duration)}
      </span>
      <svg width={14} height={14} viewBox="0 0 24 24" fill={C.muted}>
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
      </svg>
      <span style={{ fontWeight: 600, color: C.text }}>+1 (408) 222-2231</span>
      <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
        {["Keypad", "Hold"].map((label) => (
          <button
            key={label}
            style={{
              backgroundColor: "#fff",
              color: C.text,
              border: `1px solid ${C.dim}`,
              borderRadius: 3,
              padding: "4px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        style={{
          marginLeft: "auto",
          backgroundColor: C.red,
          color: "#fff",
          border: "none",
          borderRadius: 3,
          padding: "5px 20px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        End
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Call metadata grid (Talking state)
// ---------------------------------------------------------------------------

function CallMetadata() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0 24px",
        fontSize: 12,
        borderBottom: `1px solid ${C.rowBorder}`,
        padding: "10px 12px",
      }}
    >
      {[
        [
          ["Skill Name", "MDL_CallCtrGrnd"],
          ["A", "Ph=4082222231 00/00/0000 LegalPlayed=N"],
          ["B", "8886764204 BCBSIL Virtual Visits"],
          ["C", "MD Live Main — Inbound"],
          ["D", "?"],
          ["E", "V?"],
        ],
        [
          ["Unique Call ID", "155480000301148"],
          ["GUID", "3703798201f1ad81a6df000825200fe0"],
          ["W", "T"],
          ["X", ""],
          ["Y", ""],
          ["Z", "?"],
        ],
      ].map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {col.map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 8 }}>
              <span style={{ color: C.muted, minWidth: ci === 0 ? 70 : 110 }}>{k}</span>
              <span style={{ color: C.text, wordBreak: "break-all" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main content area
// ---------------------------------------------------------------------------

function FinesseContent({
  finesseState,
  duration,
  onSimulate,
  onAnswer,
}: {
  finesseState: FinesseState;
  duration: number;
  onSimulate: () => void;
  onAnswer: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
      {finesseState === "talking" && <CallBar duration={duration} />}

      <div style={{ flex: 1, overflowY: "auto", backgroundColor: C.pageBg }}>
        <div style={{ backgroundColor: C.panelBg }}>

          {/* Top section */}
          {finesseState === "ready" && (
            <div style={{ borderBottom: `1px solid ${C.rowBorder}` }}>
              <SectionHeader label="Question Type" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: "40px 0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: C.readyBg,
                    border: `2px solid ${C.ready}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneIcon size={26} color={C.ready} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Ready for calls</div>
                  <div style={{ color: C.muted }}>Waiting for the next call in queue</div>
                </div>
                <button
                  onClick={onSimulate}
                  style={{
                    backgroundColor: C.green,
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "9px 22px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <PhoneIcon size={14} color="#fff" />
                  Simulate incoming call
                </button>
              </div>
            </div>
          )}

          {finesseState === "reserved" && (
            <div style={{ borderBottom: `1px solid ${C.rowBorder}` }}>
              <SectionHeader label="Question Type" />
              <div style={{ height: 88 }} />
            </div>
          )}

          {finesseState === "talking" && (
            <>
              <div style={{ textAlign: "center", padding: "24px 12px 18px", borderBottom: `1px solid ${C.rowBorder}` }}>
                <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: C.muted }}>
                  Not Identified
                </h1>
              </div>
              <CallMetadata />
            </>
          )}

          <SendDigitsSection />
          <PhoneBookSection />
          <AgentHistorySection />
          <QueueStatisticsSection />
        </div>
      </div>

      {/* Incoming call popup */}
      {finesseState === "reserved" && <IncomingCallPopup onAnswer={onAnswer} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

function FinesseMockPage() {
  const [finesseState, setFinesseState] = React.useState<FinesseState>("ready");
  const [duration, setDuration] = React.useState(0);
  const [readyDuration, setReadyDuration] = React.useState(0);

  React.useEffect(() => {
    if (finesseState !== "ready") return;
    const id = setInterval(() => setReadyDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [finesseState]);

  React.useEffect(() => {
    if (finesseState !== "talking") return;
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [finesseState]);

  const handleAnswer = React.useCallback(() => {
    setFinesseState("talking");
    window.open(V2_STORY_URL, "_blank");
  }, []);

  React.useEffect(() => {
    if (finesseState !== "reserved") return;
    const timer = window.setTimeout(handleAnswer, 1500);
    return () => window.clearTimeout(timer);
  }, [finesseState, handleAnswer]);

  const headerDuration = finesseState === "ready" ? readyDuration : duration;

  return (
    <div style={{ ...BASE, height: "100dvh", display: "flex", flexDirection: "column" }}>
      <FinesseHeader state={finesseState} duration={headerDuration} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <FinesseSidebar />
        <FinesseContent
          finesseState={finesseState}
          duration={duration}
          onSimulate={() => setFinesseState("reserved")}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta = {
  title: "Demo/Finesse → CSA",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "**Demo flow** — mock Cisco Finesse CTI page.",
          "",
          "1. Agent is in **Ready** state → click *Simulate incoming call*",
          "2. Finesse shows **Reserved** + incoming call popup (auto-answers after 1.5s)",
          "3. Transitions to **Talking** — CSA V2 opens in a new tab automatically",
        ].join("\n"),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Incoming call",
  render: () => <FinesseMockPage />,
};
