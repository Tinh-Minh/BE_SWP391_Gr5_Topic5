import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../services/authService";
import "../../styles/NavBar.css";

export default function NavBar({ keyword = "", onKeywordChange, onSearch }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser());
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const DASHBOARD_MAP = {
    ADMIN:     { path: "/admin",     label: "⚙️ Admin Dashboard" },
    STAFF:     { path: "/staff",     label: "🧾 Staff Dashboard" },
    OPERATION: { path: "/operation", label: "🔧 Operation Dashboard" },
    SHIPPER:   { path: "/shipper",   label: "🚚 Shipper Dashboard" },
  };

  const dashboard = user ? DASHBOARD_MAP[user.role] : null;

  const menuItems = [
    { label: "My Profile", path: "/profile" },
    { label: "EyeProfile", path: "/eye-profile" },
    { label: "Your Orders", path: "/orders" },
  ];

  return (
    <header className="electro-navbar">
      <div className="electro-navbar-inner">
        <div className="electro-navbar-brand">
          <button className="electro-logo" onClick={() => navigate("/")}>
            <span>👓 GlassesShop</span>
          </button>
        </div>

        <div className="electro-navbar-search">
          <div className="electro-searchbar electro-searchbar--single">
            <input
              type="text"
              placeholder="Search here"
              value={keyword}
              onChange={(event) => onKeywordChange?.(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && onSearch?.()}
            />
            <button className="electro-search-btn" onClick={() => onSearch?.()}>
              Search
            </button>
          </div>
        </div>

        <div className="electro-navbar-actions">
          {user ? (
            <>
              <button className="electro-icon-action" onClick={() => navigate("/cart")}>
                <span>🛒</span>
                <strong>Cart</strong>
              </button>

              <div className="electro-menu-wrap">
                <button className="electro-icon-action" onClick={() => setMenuOpen((prev) => !prev)}>
                  <span>☰</span>
                  <strong>Menu</strong>
                </button>

                {menuOpen && (
                  <div className="electro-menu-dropdown">
                    <div className="electro-menu-user">
                      Hello, {user?.name?.split(" ").pop() || user?.username}
                    </div>

                    {dashboard && (
                      <button
                        className="electro-menu-item"
                        style={{ color: "#d10024", fontWeight: 700, borderBottom: "1px solid #f0f0f0" }}
                        onClick={() => { setMenuOpen(false); navigate(dashboard.path); }}
                      >
                        {dashboard.label}
                      </button>
                    )}

                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        className="electro-menu-item"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(item.path);
                        }}
                      >
                        {item.label}
                      </button>
                    ))}

                    <button className="electro-menu-item electro-menu-item--logout" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="electro-auth-actions">
              <button className="electro-auth-btn electro-auth-btn--ghost" onClick={() => navigate("/login")}>
                Sign In
              </button>
              <button className="electro-auth-btn" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}