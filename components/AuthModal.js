import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/router";

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "Investor",
  });

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (mode === "login") {
        result = await login(form.email, form.password);
      } else {
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters");
          setLoading(false);
          return;
        }

        result = await register({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          accountType: form.accountType,
        });
      }

      setLoading(false);

      if (result?.success) {
        onClose();
        router.push("/dashboard");
      } else {
        setError(result?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backdropFilter: "blur(4px)",
  };

  const modalStyle = {
    background: "#0F141B",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "2.5rem 2.25rem",
    width: "100%",
    maxWidth: "600px",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.35)",
    fontSize: "2rem",
    lineHeight: 1,
    cursor: "pointer",
  };

  const logoWrapStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "2rem",
  };

  const logoMarkStyle = {
    color: "#F0B90B",
    fontSize: "2rem",
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "0.08em",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const logoTextWrapStyle = {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.05,
    marginTop: "1px",
  };

  const logoTextStyle = {
    color: "#FFFFFF",
    fontSize: "1.15rem",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const headingStyle = {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#FFFFFF",
    marginBottom: "0.4rem",
    lineHeight: 1.1,
  };

  const subTextStyle = {
    fontSize: "1.05rem",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "2rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.42)",
    marginBottom: "0.5rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "1rem 1rem",
    background: "#1A2029",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const submitButtonStyle = {
    width: "100%",
    padding: "1rem",
    background: loading ? "#B8930A" : "#F0B90B",
    color: "#111111",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "0.5rem",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const footerTextStyle = {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.35)",
  };

  const switchLinkStyle = {
    color: "#F0B90B",
    fontWeight: 700,
    cursor: "pointer",
  };

  const errorStyle = {
    padding: "0.8rem 1rem",
    background: "rgba(246,70,93,0.12)",
    border: "1px solid rgba(246,70,93,0.2)",
    borderRadius: "8px",
    color: "#F6465D",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={overlayStyle}
    >
      <div style={modalStyle}>
        <button type="button" onClick={onClose} style={closeButtonStyle} aria-label="Close modal">
          ✕
        </button>

        <div style={logoWrapStyle}>
          <span style={logoMarkStyle}>NXT</span>
          <div style={logoTextWrapStyle}>
            <span style={logoTextStyle}>NEXTOKEN</span>
            <span style={logoTextStyle}>CAPITAL</span>
          </div>
        </div>

        <div style={headingStyle}>
          {mode === "login" ? "Log In" : "Create Account"}
        </div>

        <div style={subTextStyle}>
          {mode === "login"
            ? "Welcome back to Nextoken Capital"
            : "Create your Nextoken Capital account to get started."}
        </div>

        {error ? <div style={errorStyle}>{error}</div> : null}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  style={inputStyle}
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={inputStyle}
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: mode === "register" ? "1rem" : "1.5rem" }}>
            <label style={labelStyle}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
            />
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Account Type</label>
              <select
                style={inputStyle}
                value={form.accountType}
                onChange={(e) => set("accountType", e.target.value)}
              >
                <option value="Investor">Investor</option>
                <option value="Issuer">Issuer</option>
                <option value="Institution">Institution</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        <div style={footerTextStyle}>
          {mode === "login" ? (
            <>
              New to Nextoken?{" "}
              <span onClick={() => onSwitch("register")} style={switchLinkStyle}>
                Create Account →
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => onSwitch("login")} style={switchLinkStyle}>
                Log In →
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}