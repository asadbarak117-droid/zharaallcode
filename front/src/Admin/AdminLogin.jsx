import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #eaf5fa, #f8f4f1, #e5f0f5)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "45px 38px",
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 15px 50px rgba(43, 76, 95, 0.12)",
  },
  logo: {
    width: "65px",
    height: "65px",
    margin: "0 auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    background: "#729db4",
    borderRadius: "18px",
  },
  title: {
    textAlign: "center",
    fontSize: "29px",
    color: "#304b5a",
    margin: "0 0 10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#84949d",
    fontSize: "14px",
    lineHeight: 1.6,
    marginBottom: "32px",
  },
  label: {
    display: "block",
    color: "#405966",
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
    border: "1px solid #dce6eb",
    borderRadius: "11px",
    marginBottom: "22px",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#304b5a",
  },
  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#729db4",
    cursor: "pointer",
    display: "flex",
  },
  loginButton: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "11px",
    background: "#729db4",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "5px",
  },
  error: {
    color: "#c34b4b",
    fontSize: "13px",
    marginBottom: "15px",
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "7px",
    color: "#8a9ba4",
    fontSize: "12px",
    marginTop: "28px",
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
          <ShieldCheck size={34} />
        </div>

        <h1 style={styles.title}>Welcome Back</h1>

        <p style={styles.subtitle}>
          Sign in to your Beauty Online Shop Admin Panel
        </p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email Address</label>

          <div style={styles.inputBox}>
            <Mail size={19} color="#729db4" />

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
            <Lock size={19} color="#729db4" />

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

        <div style={styles.footer}>
          <ShieldCheck size={16} />
          <span>Authorized Administrators Only</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
