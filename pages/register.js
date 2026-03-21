import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("Register data:", form);

      setTimeout(() => {
        setLoading(false);
        setMessage("Account created successfully");
        router.push("/login");
      }, 1000);
    } catch (error) {
      setLoading(false);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Register</h1>
          <p style={styles.subtitle}>Create your Nextoken Capital account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          {message ? <p style={styles.message}>{message}</p> : null}

          <p style={styles.footerText}>
            Already have an account?{" "}
            <span onClick={() => router.push("/login")} style={styles.link}>
              Log In
            </span>
          </p>
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
    minHeight: "100vh",
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
  footerText: {
    marginTop: "24px",
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: "16px",
  },
  link: {
    color: "#F0B90B",
    fontWeight: "700",
    cursor: "pointer",
  },
};