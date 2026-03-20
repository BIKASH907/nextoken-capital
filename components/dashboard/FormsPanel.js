export default function FormsPanel({
  panel,
  user,
  router,
  form,
  updateForm,
  submitForm,
  messages,
  gold,
  green,
  dark2,
  dark3,
  dark4,
  border,
  muted,
}) {
  const inp = {
    width: "100%",
    padding: "0.8rem 0.95rem",
    background: dark3,
    border: `1px solid ${border}`,
    borderRadius: 6,
    color: "#fff",
    fontSize: "0.9rem",
    fontFamily: "Inter,sans-serif",
    outline: "none",
    boxSizing: "border-box",
    marginTop: 4,
  };

  const lbl = {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: muted,
    marginBottom: 3,
  };

  const fg = { marginBottom: "1rem" };

  const successBox = (text) =>
    text ? (
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "rgba(14,203,129,0.1)",
          border: `1px solid rgba(14,203,129,0.2)`,
          borderRadius: 4,
          color: green,
          fontSize: "0.82rem",
          marginBottom: "1.25rem",
        }}
      >
        {text}
      </div>
    ) : null;

  if (panel === "portfolio") {
    return (
      <div>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 900 }}>Portfolio</div>
          <div style={{ fontSize: "0.78rem", color: muted }}>Your investments and holdings</div>
        </div>

        <div
          style={{
            padding: "1rem",
            background: "rgba(240,185,11,0.08)",
            border: `1px solid rgba(240,185,11,0.15)`,
            borderRadius: 4,
            fontSize: "0.85rem",
            color: gold,
            marginBottom: "1.5rem",
          }}
        >
          Your portfolio is empty. Start investing in bonds, equity, or tokenized assets.
        </div>

        <button
          onClick={() => router.push("/bonds")}
          style={{
            padding: "0.7rem 1.75rem",
            background: gold,
            color: "black",
            border: "none",
            borderRadius: 6,
            fontSize: "0.88rem",
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "Inter,sans-serif",
          }}
        >
          Browse Bonds →
        </button>
      </div>
    );
  }

  if (panel === "settings") {
    return (
      <div>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 900 }}>Account Settings</div>
          <div style={{ fontSize: "0.78rem", color: muted }}>Manage your account preferences</div>
        </div>

        {successBox(messages["settings"])}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 6 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontWeight: 700 }}>Profile</span>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                <div style={fg}>
                  <label style={lbl}>First Name</label>
                  <input style={inp} defaultValue={user?.first_name || ""} />
                </div>
                <div style={fg}>
                  <label style={lbl}>Last Name</label>
                  <input style={inp} defaultValue={user?.last_name || ""} />
                </div>
              </div>

              <div style={fg}>
                <label style={lbl}>Email</label>
                <input style={inp} type="email" defaultValue={user?.email || ""} />
              </div>

              <div style={fg}>
                <label style={lbl}>Company (Optional)</label>
                <input style={inp} placeholder="Your company name" />
              </div>

              <button
                onClick={() => submitForm("settings")}
                style={{
                  padding: "0.65rem 1.75rem",
                  background: gold,
                  color: "black",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 6 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontWeight: 700 }}>Security</span>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={fg}>
                <label style={lbl}>Current Password</label>
                <input style={inp} type="password" placeholder="••••••••" />
              </div>
              <div style={fg}>
                <label style={lbl}>New Password</label>
                <input style={inp} type="password" placeholder="••••••••" />
              </div>
              <div style={fg}>
                <label style={lbl}>Confirm New Password</label>
                <input style={inp} type="password" placeholder="••••••••" />
              </div>

              <button
                style={{
                  padding: "0.65rem 1.75rem",
                  background: dark4,
                  color: "rgba(255,255,255,0.7)",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (panel === "kyc") {
    return (
      <div>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "1.3rem", fontWeight: 900 }}>KYC Verification</div>
          <div style={{ fontSize: "0.78rem", color: muted }}>Verify your identity to unlock full platform access</div>
        </div>

        <div
          style={{
            padding: "0.85rem 1rem",
            background: "rgba(240,185,11,0.08)",
            border: `1px solid rgba(240,185,11,0.15)`,
            borderRadius: 4,
            color: gold,
            fontSize: "0.82rem",
            marginBottom: "1.5rem",
          }}
        >
          ⚠ KYC verification is required to trade, invest, and issue assets on Nextoken Capital.
        </div>

        {successBox(messages["kyc"])}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 6 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontWeight: 700 }}>Identity Verification</span>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={fg}>
                <label style={lbl}>Full Legal Name</label>
                <input style={inp} placeholder="As it appears on your ID" />
              </div>
              <div style={fg}>
                <label style={lbl}>Date of Birth</label>
                <input style={inp} type="date" />
              </div>
              <div style={fg}>
                <label style={lbl}>Nationality</label>
                <select style={{ ...inp, appearance: "none" }}>
                  <option>Lithuanian</option>
                  <option>Estonian</option>
                  <option>German</option>
                  <option>British</option>
                  <option>Other EU</option>
                  <option>Non-EU</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ background: dark2, border: `1px solid ${border}`, borderRadius: 6 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${border}` }}>
              <span style={{ fontWeight: 700 }}>Verification Flow</span>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(14,203,129,0.06)",
                  border: `1px solid rgba(14,203,129,0.15)`,
                  borderRadius: 4,
                  fontSize: "0.72rem",
                  color: green,
                  marginBottom: "1rem",
                  lineHeight: 1.6,
                }}
              >
                Your documents are encrypted and stored securely.
              </div>

              <button
                onClick={() => router.push("/kyc")}
                style={{
                  padding: "0.75rem 2rem",
                  background: gold,
                  color: "black",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontFamily: "Inter,sans-serif",
                }}
              >
                Open Verification Flow
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.5rem" }}>
        {panel}
      </div>
      <div style={{ color: muted }}>This section can be expanded next.</div>
    </div>
  );
}