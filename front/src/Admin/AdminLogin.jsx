import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "45px 38px",
    background: "#ffffff",
    borderRadius: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.10)",
  },
  logo: {
    width: "68px",
    height: "68px",
    margin: "0 auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#020617",
    background: "#38bdf8",
    borderRadius: "19px",
  },
  brand: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "2px",
    marginBottom: "10px",
  },
  title: {
    textAlign: "center",
    fontSize: "29px",
    color: "#020617",
    margin: "0 0 10px",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.7,
    marginBottom: "32px",
  },
  label: {
    display: "block",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "9px",
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    height: "52px",
    padding: "0 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "11px",
    marginBottom: "22px",
    background: "#ffffff",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#020617",
  },
  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
  },
  loginButton: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "11px",
    background: "#38bdf8",
    color: "#020617",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "5px",
    transition: "0.2s",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "15px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    color: "#64748b",
    fontSize: "12px",
    marginTop: "28px",
  },
  divider: {
    height: "1px",
    background: "#e2e8f0",
    marginTop: "25px",
  },
};

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://zharaallcode.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (err) {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <ShieldCheck size={35} />
        </div>

        <p style={styles.brand}>
          <Sparkles
            size={13}
            style={{ display: "inline", marginRight: "5px" }}
          />
          LEDORA ADMIN
        </p>

        <h1 style={styles.title}>Welcome Back</h1>

        <p style={styles.subtitle}>
          Sign in to your Beauty Online Shop Admin Panel
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email Address</label>

          <div style={styles.inputBox}>
            <Mail size={19} color="#0ea5e9" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              style={styles.input}
            />
          </div>

          <label style={styles.label}>Password</label>

          <div style={styles.inputBox}>
            <Lock size={19} color="#0ea5e9" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={styles.input}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={{
              ...styles.loginButton,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={styles.divider} />

        <div style={styles.footer}>
          <ShieldCheck size={16} color="#0ea5e9" />
          <span>Authorized Administrators Only</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
