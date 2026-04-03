import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { useToast } from "../components/Toast";
import { getUser } from "../services/authService";
import api from "../services/api";
import "../styles/Profile.css";

const MENU_ITEMS = [
  { key: "INFO", label: "Personal Information" },
  { key: "PASSWORD", label: "Change Password" },
  { key: "QUICK", label: "Quick Access" },
];

const QUICK_LINKS = [
  { label: "My Orders", sub: "Review order history and updates", path: "/orders" },
  { label: "Cart", sub: "Open your shopping cart", path: "/cart" },
  { label: "Design Glasses", sub: "Create a custom glasses request", path: "/design-glasses" },
  { label: "Eye Profile", sub: "Manage your saved eye measurements", path: "/eye-profile" },
];

export default function Profile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState("INFO");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      await api.put("/customer/profile", form);
      const nextUser = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
      toast({ message: "Profile updated successfully.", type: "success" });
      setEditMode(false);
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to update profile.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      toast({ message: "Please complete all password fields.", type: "warning" });
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ message: "Password confirmation does not match.", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      await api.put("/customer/change-password", {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      });
      toast({ message: "Password changed successfully.", type: "success" });
      setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to change password.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="profile-main">
        <div className="electro-shell">
          <div className="profile-head">
            <div>
              <h1>My Profile</h1>
            </div>
          </div>

          <div className="profile-layout">
            <aside className="profile-sidebar">
              <div className="profile-avatar">
                {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <h2>{user?.name || user?.username}</h2>
              <p>{user?.role === "USER" ? "Customer Account" : user?.role}</p>

              <div className="profile-menu">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    className={tab === item.key ? "active" : ""}
                    onClick={() => setTab(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </aside>

            <section className="profile-content">
              {tab === "INFO" && (
                <div className="profile-card">
                  <div className="profile-card-head">
                    <h3>Personal Information</h3>
                    {!editMode && (
                      <button className="profile-outline-btn" onClick={() => setEditMode(true)}>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="profile-form-grid">
                    <label>
                      <span>Username</span>
                      <input value={user?.username || ""} disabled />
                    </label>

                    <label>
                      <span>Email</span>
                      <input value={user?.email || ""} disabled />
                    </label>

                    <label>
                      <span>Full Name</span>
                      <input
                        value={form.name}
                        disabled={!editMode}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Phone Number</span>
                      <input
                        value={form.phone}
                        disabled={!editMode}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </label>

                    <label className="profile-full-row">
                      <span>Address</span>
                      <input
                        value={form.address}
                        disabled={!editMode}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                      />
                    </label>
                  </div>

                  {editMode && (
                    <div className="profile-action-row">
                      <button className="profile-primary-btn" onClick={handleUpdateProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button className="profile-secondary-btn" onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {tab === "PASSWORD" && (
                <div className="profile-card">
                  <div className="profile-card-head">
                    <h3>Change Password</h3>
                  </div>

                  <div className="profile-password-grid">
                    <label>
                      <span>Current Password</span>
                      <input
                        type="password"
                        value={pwForm.oldPassword}
                        onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>New Password</span>
                      <input
                        type="password"
                        value={pwForm.newPassword}
                        onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      />
                    </label>

                    <label>
                      <span>Confirm New Password</span>
                      <input
                        type="password"
                        value={pwForm.confirmPassword}
                        onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="profile-action-row">
                    <button className="profile-primary-btn" onClick={handleChangePassword} disabled={saving}>
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "QUICK" && (
                <div className="profile-card">
                  <div className="profile-card-head">
                    <h3>Quick Access</h3>
                  </div>

                  <div className="profile-quick-grid">
                    {QUICK_LINKS.map((item) => (
                      <button key={item.path} className="profile-quick-card" onClick={() => navigate(item.path)}>
                        <strong>{item.label}</strong>
                        <span>{item.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
