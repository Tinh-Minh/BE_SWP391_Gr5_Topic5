import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { useToast } from "../components/Toast";
import "../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event?.preventDefault();
    if (loading) return;

    if (!form.username || !form.password || !form.name || !form.email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        username: form.username,
        password: form.password,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });

      toast({ message: "Registration successful. Please sign in.", type: "success" });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Username *", type: "text", placeholder: "Choose a username" },
    { name: "password", label: "Password *", type: "password", placeholder: "Create a password" },
    { name: "confirmPassword", label: "Confirm Password *", type: "password", placeholder: "Re-enter your password" },
    { name: "name", label: "Full Name *", type: "text", placeholder: "Enter your full name" },
    { name: "email", label: "Email *", type: "email", placeholder: "Enter your email" },
    { name: "phone", label: "Phone Number", type: "text", placeholder: "Enter phone number" },
    { name: "address", label: "Address", type: "text", placeholder: "Enter address" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-shell auth-shell--wide">
        <section className="auth-hero">
          <span className="auth-kicker">Create your account</span>
          <h1>Start shopping eyewear with confidence.</h1>
        </section>

        <form className="auth-card auth-card--wide" onSubmit={handleRegister}>
          <div className="auth-badge">👓</div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Set up your GlassesShop account.</p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-grid">
            {fields.map((field) => (
              <div className={"auth-field" + (field.name === "address" ? " auth-field--full" : "")} key={field.name}>
                <label htmlFor={"register-" + field.name}>{field.label}</label>
                <input
                  id={"register-" + field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
