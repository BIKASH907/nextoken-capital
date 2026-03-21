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
    fontFamily: "Inter, sans-serif",
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

  const primaryBtn = {
    padding: "0.65rem 1.75rem",
    background: gold,
    color: "black",
    border: "none",
    borderRadius: 6,
    fontSize: "0.85rem",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  };

  const secondaryBtn = {
    padding: "0.65rem 1.75rem",
    background: dark4,
    color: "rgba(255,255,255,0.7)",
    border: "none",
    borderRadius: 6,
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
  };

  const successBox = (text) =>
    text ? (
      <div
        style={{
          padding: "0.75rem 1rem",
          background: "rgba(14,203,129,0.1)",
          border: "1px solid rgba(14,203,129,0.2)",
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
          <div style={{ fontSize: "0.78rem", color: muted }}>
            Your investments and holdings
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            background: "rgba(240,185,11,0.08)",
            border: "1px solid rgba(240,185,11,0.15)",
            borderRadius: 4,
            fontSize: "0.85rem",
            color: gold,
            marginBottom: "1.5rem",
          }}
        >
          Your portfolio is empty. Start investing in bonds, equity, or tokenized assets.
        </div>

        <button
          type="button"
          onClick={() => router.push("/bonds")}
          style={primaryBtn}
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
          <div style={{ fontSize: "0.78rem", color: muted }}>
            Manage your account preferences
          </div>
        </div>

        {successBox(messages?.settings)}

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
                  <input
                    style={inp}
                    value={form?.firstName ?? user?.first_name ?? ""}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    placeholder="First name"
                  />
                </div>

                <div style={fg}>
                  <label style={lbl}>Last Name</label>
                  <input
                    style={inp}
                    value={form?.lastName ?? user?.last_name ?? ""}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div style={fg}>
                <label style={lbl}>Email</label>
                <input
                  style={inp}
                  type="email"
                  value={form?.email ?? user?.email ?? ""}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="Email address"
                />
              </div>

              <div style={fg}>
                <label style={lbl}>Company (Optional)</label>
                <input
                  style={inp}
                  value={form?.company ?? ""}
                  onChange={(e) => updateForm("company", e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <button
                type="button"
                onClick={() => submitForm("settings")}
                style={primaryBtn}
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
                <input
                  style={inp}
                  type="password"
                  value={form?.currentPassword ?? ""}
                  onChange={(e) => updateForm("currentPassword", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={fg}>
                <label style={lbl}>New Password</label>
                <input
                  style={inp}
                  type="password"
                  value={form?.newPassword ?? ""}
                  onChange={(e) => updateForm("newPassword", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={fg}>
                <label style={lbl}>Confirm New Password</label>
                <input
                  style={inp}
                  type="password"
                  value={form?.confirmPassword ?? ""}
                  onChange={(e) => updateForm("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="button"
                onClick={() => submitForm("password")}
                style={secondaryBtn}
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
          <div style={{ fontSize: "0.78rem", color: muted }}>
            Verify your identity to unlock full platform access
          </div>
        </div>

        <div
          style={{
            padding: "0.85rem 1rem",
            background: "rgba(240,185,11,0.08)",
            border: "1px solid rgba(240,185,11,0.15)",
            borderRadius: 4,
            color: gold,
            fontSize: "0.82rem",
            marginBottom: "1.5rem",
          }}
        >
          KYC verification is required to trade, invest, and issue assets on Nextoken Capital.
        </div>

        {successBox(messages?.kyc)}

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
                <input
                  style={inp}
                  value={form?.legalName ?? ""}
                  onChange={(e) => updateForm("legalName", e.target.value)}
                  placeholder="As it appears on your ID"
                />
              </div>

              <div style={fg}>
                <label style={lbl}>Date of Birth</label>
                <input
                  style={inp}
                  type="date"
                  value={form?.dob ?? ""}
                  onChange={(e) => updateForm("dob", e.target.value)}
                />
              </div>

              <div style={fg}>
                <label style={lbl}>Nationality</label>
                <select
                  style={{ ...inp, appearance: "none" }}
                  value={form?.nationality ?? "Lithuanian"}
                  onChange={(e) => updateForm("nationality", e.target.value)}
                >
                  <option value="Lithuanian">Lithuanian</option>
                  <option value="Estonian">Estonian</option>
                  <option value="German">German</option>
                  <option value="British">British</option>
                  <option value="Other EU">Other EU</option>
                  <option value="Non-EU">Non-EU</option>
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
                  border: "1px solid rgba(14,203,129,0.15)",
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
                type="button"
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
                  fontFamily: "Inter, sans-serif",
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