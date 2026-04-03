import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, loginWithGoogle } from "../services/authService";
import { useToast } from "../components/Toast";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (event) => {
    event?.preventDefault();
    if (loading) return;

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(username, password);
      toast({ message: "Signed in successfully. Welcome " + (user?.name || user?.username), type: "success" });

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "STAFF") navigate("/staff");
      else if (user.role === "OPERATION") navigate("/operation");
      else if (user.role === "SHIPPER") navigate("/shipper");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Incorrect username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      toast({ message: "Đăng nhập Google thành công! Xin chào " + (user?.name || user?.username), type: "success" });
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "STAFF") navigate("/staff");
      else if (user.role === "OPERATION") navigate("/operation");
      else if (user.role === "SHIPPER") navigate("/shipper");
      else navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <span className="auth-kicker">Welcome back</span>
          <h1>Access your GlassesShop account.</h1>
          <p>
            Sign in to review your orders, manage your prescriptions, and continue shopping with a faster
            checkout experience.
          </p>
        </section>

        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-badge">👓</div>
          <h2>Sign In</h2>
          <p className="auth-subtitle">Continue with your existing account.</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="auth-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Đăng nhập Google thất bại.")}
              useOneTap={false}
              width="100%"
              text="signin_with"
              shape="rectangular"
              logo_alignment="center"
            />
          </div>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}