import { useState } from "react";
import { useAuth } from "../lib/AuthContext";

export default function AuthModal({ mode = "login", onClose, onSwitch }) {
  const { login, register, fetchUser } = useAuth();

  const isLogin = mode === "login";

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const dark = "#0B0E11";
  const dark2 = "#161A1E";
  const dark3 = "#1E2329";
  const gold = "#F0B90B";
  const border = "rgba(255,255,255,0.08)";
  const muted = "rgba(255,255,255,0.6)";
  const red = "#F6465D";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      let result;

      if (isLogin) {
        result = await login(form.email, form.password);
      } else {
        result = await register({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        });
      }

      if (!result?.success) {
        setMsg(result?.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (!isLogin) {
        const loginResult = await login(form.email, form.password);
        if (!loginResult?.success) {
          setMsg("Registered successfully. Please log in.");
          setLoading(false);
          return;
        }
      }

      await fetchUser();
      setLoading(false);
      if (typeof onClose === "function") onClose();
    } catch (error) {
      setMsg("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, background: dark2, border: `1px solid ${border}` }}>
        <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Close">
          ×
        </button>

        <div style={styles.header}>
          <h2 style={styles.title}>{isLogin ? "Log In" : "Register"}</h2>
          <p style={{ ...styles.subtitle, color: muted }}>
            {isLogin
              ? "Access your Nextoken Capital account"
              : "Create your Nextoken Capital account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <div style={styles.row}>
                <input
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  value={form.first_name}
                  onChange={handleChange}
                  style={{ ...styles.input, background: dark3, border: `1px solid ${border}` }}
                  required
                />
                <input
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  value={form.last_name}
                  onChange={handleChange}
                  style={{ ...styles.input, background: dark3, border: `1px solid ${border}` }}
                  required
                />
              </div>
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            style={{ ...styles.input, background: dark3, border: `1px solid ${border}` }}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ ...styles.input, background: dark3, border: `1px solid ${border}` }}
            required
          />

          {msg ? (
            <div style={{ ...styles.message, color: red }}>
              {msg}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              background: gold,
              color: "#111",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={{ color: muted }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={() => onSwitch(isLogin ? "register" : "login")}
            style={{ ...styles.switchBtn, color: gold }}
          >
            {isLogin ? "Register" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 2000,
  },
  modal: {
    width: "100%",
    maxWidth: "460px",
    borderRadius: "14px",
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "12px",
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: "28px",
    lineHeight: 1,
    cursor: "pointer",
  },
  header: {
    marginBottom: "18px",
  },
  title: {
    margin: 0,
    color: "#fff",
    fontSize: "28px",
    fontWeight: 800,
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  message: {
    fontSize: "13px",
    marginTop: "2px",
  },
  submitBtn: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 14px",
    fontSize: "15px",
    fontWeight: 800,
    marginTop: "4px",
  },
  footer: {
    marginTop: "16px",
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    flexWrap: "wrap",
  },
  switchBtn: {
    border: "none",
    background: "transparent",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
};