export function CsaLegacyFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#176B76",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "auto",
      }}
    >
      {/* EVERNORTH logo area */}
      <div style={{ color: "#fff" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "1px" }}>
          EVERNORTH<sup style={{ fontSize: "10px" }}>+</sup>
        </div>
        <div style={{ fontSize: "10px", letterSpacing: "2px", marginTop: "1px" }}>
          HEALTH SERVICES
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#fff" }}>
        Copyright &copy;2026 MD Live by Evernorth
      </div>
    </footer>
  );
}
