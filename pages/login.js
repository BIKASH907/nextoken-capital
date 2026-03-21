import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setMessage(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      setMessage("Login successful! Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Login Error:", error);
      setMessage("Connection error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style jsx global>{`
        input:focus {
          border-color: #f0b90b !important;
          box-shadow: 0 0 10px rgba(240, 185, 11, 0.15);
          transition: all 0.3s ease;
        }
        button:hover:not(:disabled) {
          background: #d4a30a !important;
          transform: translateY(-1px);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Log In</h1>
            <p style={styles.subtitle}>Secure Access to Nextoken Capital</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          {message && (
            <p
              style={{
                ...styles.message,
                color: message.includes("successful") ? "#4BB543" : "#F0B90B",
              }}
            >
              {message}
            </p>
          )}

          <div style={styles.footerText}>
            <span style={styles.muted}>New to the platform?</span>
            <Link href="/register" style={styles.link}>
              Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#05060a",
    color: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "28px",
    padding: "40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    marginTop: "8px",
    fontSize: "16px",
    color: "rgba(255,255,255,0.5)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginLeft: "4px",
  },
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#1a1a1a",
    color: "#ffffff",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "8px",
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "#F0B90B",
    color: "#000000",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  message: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
  },
  footerText: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "15px",
  },
  muted: {
    color: "rgba(255,255,255,0.4)",
  },
  link: {
    color: "#F0B90B",
    fontWeight: "600",
    textDecoration: "none",
    marginLeft: "6px",
  },
};