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
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      setMessage("Login successful");
      router.push("/dashboard");
    } catch (error) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Log In</h1>
          <p style={styles.subtitle}>Welcome back to Nextoken Capital</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          {message ? <p style={styles.message}>{message}</p> : null}

          <div style={styles.bottomText}>
            <span style={styles.bottomMuted}>Don&apos;t have an account? </span>
            <Link href="/register" style={styles.registerLink}>
              Register / Sign Up
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
  },
  main: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "38px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
  },
  title: {
    margin: 0,
    fontSize: "40px",
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    marginTop: "10px",
    marginBottom: "28px",
    fontSize: "18px",
    color: "rgba(255,255,255,0.65)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  input: {
    width: "100%",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1a1a1a",
    color: "#ffffff",
    fontSize: "18px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "8px",
    width: "100%",
    padding: "18px 20px",
    borderRadius: "14px",
    border: "none",
    background: "#F0B90B",
    color: "#111111",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
  },
  message: {
    marginTop: "18px",
    textAlign: "center",
    color: "#F0B90B",
    fontSize: "15px",
  },
  bottomText: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "16px",
  },
  bottomMuted: {
    color: "rgba(255,255,255,0.65)",
  },
  registerLink: {
    color: "#F0B90B",
    fontWeight: "700",
    textDecoration: "none",
  },
};