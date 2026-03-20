export default function Sidebar({
  navItems,
  panel,
  setPanel,
  router,
  gold,
  dark3,
  muted,
}) {
  const SbItem = ({ item }) => {
    if (item.sep) {
      return (
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            padding: "0.7rem 0.75rem 0.35rem",
          }}
        >
          {item.label}
        </div>
      );
    }

    const active = panel === item.id;

    return (
      <div
        onClick={() => (item.link ? router.push(item.link) : setPanel(item.id))}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "0.6rem 0.75rem",
          borderRadius: 6,
          fontSize: "0.82rem",
          fontWeight: active ? 700 : 500,
          color: active ? gold : muted,
          background: active ? "rgba(240,185,11,0.08)" : "transparent",
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = dark3;
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <span style={{ fontSize: "0.75rem", width: 16, textAlign: "center" }}>
          {item.icon}
        </span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && (
          <span
            style={{
              padding: "1px 6px",
              background: gold,
              borderRadius: 100,
              fontSize: "0.6rem",
              fontWeight: 800,
              color: "black",
            }}
          >
            {item.badge}
          </span>
        )}
      </div>
    );
  };

  return (
    <aside
      style={{
        width: 220,
        background: "#161A1E",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "1rem 0",
        flexShrink: 0,
        position: "sticky",
        top: 60,
        height: "calc(100vh - 60px)",
        overflowY: "auto",
      }}
    >
      {navItems.map((item) => (
        <div key={item.id} style={{ padding: item.sep ? "0" : "0 0.75rem" }}>
          <SbItem item={item} />
        </div>
      ))}
    </aside>
  );
}