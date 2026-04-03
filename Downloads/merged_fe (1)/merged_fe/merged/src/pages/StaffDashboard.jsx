import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import api from "../services/api";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.sf-page { min-height:100vh; background:#0f1117; font-family:'Inter',system-ui,sans-serif; color:#e2e8f0; }

/* ---- NAV ---- */
.sf-nav {
  position:sticky; top:0; z-index:200;
  background:rgba(15,17,23,0.95);
  backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(255,255,255,0.07);
  height:64px;
}
.sf-nav-inner {
  max-width:1400px; margin:0 auto; padding:0 24px;
  height:100%; display:flex; align-items:center; gap:16px;
}
.sf-logo {
  display:flex; align-items:center; gap:10px; cursor:pointer; flex-shrink:0;
}
.sf-logo-icon {
  width:36px; height:36px; background:linear-gradient(135deg,#ef4444,#dc2626);
  border-radius:10px; display:flex; align-items:center; justify-content:center;
  font-size:18px; box-shadow:0 4px 12px rgba(239,68,68,0.3);
}
.sf-logo-text { font-size:16px; font-weight:700; color:#fff; }
.sf-logo-sub  { font-size:10px; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; }
.sf-nav-divider { width:1px; height:28px; background:rgba(255,255,255,0.1); margin:0 4px; }
.sf-nav-badge {
  display:flex; align-items:center; gap:8px; padding:6px 14px;
  background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25);
  border-radius:20px; font-size:12px; color:#fca5a5; font-weight:500;
}
.sf-nav-badge-dot { width:6px; height:6px; background:#ef4444; border-radius:50%; animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.sf-nav-right { margin-left:auto; display:flex; align-items:center; gap:8px; }
.sf-nav-user {
  display:flex; align-items:center; gap:8px; padding:6px 14px;
  background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
  border-radius:8px; cursor:pointer; transition:background 0.15s;
}
.sf-nav-user:hover { background:rgba(255,255,255,0.1); }
.sf-nav-user-avatar {
  width:28px; height:28px; background:linear-gradient(135deg,#6366f1,#8b5cf6);
  border-radius:8px; display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:white;
}
.sf-nav-user-name { font-size:13px; font-weight:500; color:#e2e8f0; }
.sf-nav-logout {
  padding:6px 14px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2);
  border-radius:8px; color:#fca5a5; font-size:12px; font-weight:500; cursor:pointer;
  transition:all 0.15s;
}
.sf-nav-logout:hover { background:rgba(239,68,68,0.2); }

/* ---- MAIN LAYOUT ---- */
.sf-main { max-width:1400px; margin:0 auto; padding:24px; }

/* ---- STATS ---- */
.sf-stats { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:24px; }
.sf-stat {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
  border-radius:12px; padding:18px 16px; position:relative; overflow:hidden;
  transition:transform 0.15s, border-color 0.15s; cursor:default;
}
.sf-stat:hover { transform:translateY(-2px); }
.sf-stat-glow {
  position:absolute; top:-20px; right:-20px; width:80px; height:80px;
  border-radius:50%; opacity:0.08; filter:blur(16px);
}
.sf-stat-label { font-size:11px; color:#64748b; font-weight:500; letter-spacing:0.3px; margin-bottom:10px; text-transform:uppercase; }
.sf-stat-value { font-size:30px; font-weight:800; line-height:1; }
.sf-stat-sub { font-size:11px; color:#475569; margin-top:6px; }

/* ---- CONTENT GRID ---- */
.sf-grid { display:grid; gap:16px; }
.sf-grid-split { grid-template-columns:1fr 400px; }

/* ---- ORDER PANEL ---- */
.sf-panel {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
  border-radius:16px; overflow:hidden;
}
.sf-panel-head {
  padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
}
.sf-panel-title { font-size:15px; font-weight:700; color:#f1f5f9; }

/* ---- FILTERS ---- */
.sf-filters { display:flex; gap:6px; flex-wrap:wrap; }
.sf-filter {
  padding:5px 12px; border:1px solid rgba(255,255,255,0.1);
  border-radius:20px; font-size:11px; font-weight:500;
  cursor:pointer; background:transparent; color:#94a3b8;
  transition:all 0.15s;
}
.sf-filter:hover { border-color:rgba(255,255,255,0.2); color:#e2e8f0; }
.sf-filter.active { border-color:transparent; color:#fff; font-weight:600; }
.sf-refresh {
  padding:5px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
  border-radius:8px; color:#94a3b8; font-size:12px; cursor:pointer; transition:all 0.15s;
}
.sf-refresh:hover { background:rgba(255,255,255,0.1); color:#e2e8f0; }

/* ---- ORDER LIST ---- */
.sf-list { max-height:calc(100vh - 310px); overflow-y:auto; }
.sf-list::-webkit-scrollbar { width:4px; }
.sf-list::-webkit-scrollbar-track { background:transparent; }
.sf-list::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

.sf-order {
  padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.05);
  cursor:pointer; transition:background 0.12s; border-left:3px solid transparent;
}
.sf-order:hover { background:rgba(255,255,255,0.04); }
.sf-order.active { background:rgba(239,68,68,0.05); border-left-color:#ef4444; }
.sf-order-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.sf-order-id { font-size:14px; font-weight:700; color:#f1f5f9; }
.sf-order-badge {
  display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
  border-radius:20px; font-size:11px; font-weight:600;
}
.sf-order-customer { font-size:13px; color:#94a3b8; margin-bottom:4px; }
.sf-order-addr { font-size:12px; color:#64748b; margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sf-order-items { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
.sf-order-item-chip {
  display:inline-flex; align-items:center; gap:4px; padding:3px 8px;
  background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
  border-radius:6px; font-size:11px; color:#94a3b8;
}
.sf-order-bottom { display:flex; justify-content:space-between; align-items:center; }
.sf-order-amount { font-size:15px; font-weight:700; color:#f87171; }
.sf-order-meta { display:flex; align-items:center; gap:8px; }
.sf-pay-tag {
  padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;
  letter-spacing:0.3px;
}
.sf-pay-tag.paid   { background:rgba(34,197,94,0.15); color:#4ade80; }
.sf-pay-tag.unpaid { background:rgba(251,191,36,0.15); color:#fbbf24; }
.sf-pay-tag.cod    { background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.2); color:#fbbf24; }
.sf-order-date { font-size:11px; color:#475569; }

/* ---- DETAIL PANEL ---- */
.sf-detail {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
  border-radius:16px; position:sticky; top:80px;
  max-height:calc(100vh - 104px); overflow-y:auto;
}
.sf-detail::-webkit-scrollbar { width:4px; }
.sf-detail::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
.sf-detail-head {
  padding:18px 20px; border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; background:#14161e; z-index:10;
}
.sf-detail-title { font-size:16px; font-weight:700; color:#f1f5f9; }
.sf-close {
  width:30px; height:30px; background:rgba(255,255,255,0.07); border:none;
  border-radius:8px; color:#94a3b8; font-size:16px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all 0.15s;
}
.sf-close:hover { background:rgba(255,255,255,0.12); color:#e2e8f0; }

.sf-detail-body { padding:20px; display:flex; flex-direction:column; gap:20px; }

/* Status Hero */
.sf-status-hero {
  border-radius:12px; padding:16px 20px;
  display:flex; align-items:center; gap:14px;
}
.sf-status-icon { font-size:28px; }
.sf-status-name { font-size:16px; font-weight:700; }
.sf-status-desc { font-size:12px; opacity:0.7; margin-top:2px; }

/* Section */
.sf-section { }
.sf-section-title {
  font-size:10px; font-weight:700; color:#475569; letter-spacing:1.5px;
  text-transform:uppercase; margin-bottom:10px;
  display:flex; align-items:center; gap:6px;
}
.sf-section-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }

/* Info grid */
.sf-info-grid { display:flex; flex-direction:column; gap:0; }
.sf-info-row {
  display:flex; justify-content:space-between; align-items:start;
  padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); gap:12px;
}
.sf-info-row:last-child { border-bottom:none; }
.sf-info-label { font-size:12px; color:#64748b; flex-shrink:0; }
.sf-info-value { font-size:13px; font-weight:500; color:#e2e8f0; text-align:right; word-break:break-word; max-width:60%; }

/* Item cards */
.sf-item {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07);
  border-radius:10px; padding:12px 14px; margin-bottom:8px;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.sf-item:last-child { margin-bottom:0; }
.sf-item-left { display:flex; align-items:center; gap:10px; min-width:0; }
.sf-item-emoji { font-size:20px; flex-shrink:0; }
.sf-item-name { font-size:13px; font-weight:600; color:#f1f5f9; }
.sf-item-type {
  display:inline-block; padding:2px 7px; border-radius:4px;
  font-size:10px; font-weight:600; margin-top:3px;
}
.sf-item-price { font-size:13px; font-weight:700; color:#f87171; flex-shrink:0; }
.sf-item-qty   { font-size:11px; color:#64748b; margin-top:2px; text-align:right; }

/* Action area */
.sf-actions { display:flex; flex-direction:column; gap:10px; }
.sf-action-btn {
  width:100%; padding:13px 16px; border:none; border-radius:10px;
  font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.sf-action-btn:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.1); }
.sf-action-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
.sf-action-btn-blue   { background:linear-gradient(135deg,#3b82f6,#2563eb); color:#fff; box-shadow:0 4px 12px rgba(59,130,246,0.3); }
.sf-action-btn-red    { background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; box-shadow:0 4px 12px rgba(239,68,68,0.3); }
.sf-action-btn-purple { background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; box-shadow:0 4px 12px rgba(139,92,246,0.3); }
.sf-action-btn-cyan   { background:linear-gradient(135deg,#06b6d4,#0891b2); color:#fff; box-shadow:0 4px 12px rgba(6,182,212,0.3); }
.sf-action-btn-pink   { background:linear-gradient(135deg,#ec4899,#db2777); color:#fff; box-shadow:0 4px 12px rgba(236,72,153,0.3); }

/* Assign box */
.sf-assign {
  background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2);
  border-radius:12px; padding:16px;
}
.sf-assign-label { font-size:12px; font-weight:600; color:#a5b4fc; margin-bottom:12px; }
.sf-assign-row { display:flex; gap:8px; }
.sf-select {
  flex:1; padding:9px 12px; background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12); border-radius:8px;
  font-size:13px; color:#e2e8f0; outline:none;
}
.sf-select option { background:#1e2130; }
.sf-assign-btn {
  padding:9px 16px; border:none; border-radius:8px;
  font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap;
  transition:all 0.15s;
}
.sf-assign-btn:disabled { opacity:0.4; cursor:not-allowed; }

/* Info alerts */
.sf-alert {
  border-radius:10px; padding:12px 16px; font-size:13px; font-weight:500;
  display:flex; align-items:center; gap:10px;
}

/* Summary total */
.sf-total {
  background:linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.05));
  border:1px solid rgba(239,68,68,0.2); border-radius:10px;
  padding:14px 16px; display:flex; justify-content:space-between; align-items:center;
}
.sf-total-label { font-size:13px; color:#94a3b8; }
.sf-total-amount { font-size:22px; font-weight:800; color:#f87171; }

/* Empty / Spinner */
.sf-empty { text-align:center; padding:60px 20px; color:#475569; }
.sf-empty-icon { font-size:48px; margin-bottom:12px; opacity:0.4; }
.sf-spinner-wrap { text-align:center; padding:60px; }
.sf-spinner {
  display:inline-block; width:32px; height:32px;
  border:3px solid rgba(255,255,255,0.08); border-top-color:#ef4444;
  border-radius:50%; animation:spin 0.8s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }
`;

const STATUS = {
  PENDING: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Chờ xác nhận", desc: "Đơn mới, chờ staff xử lý", icon: "⏳" },
  CONFIRMED: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", label: "Đã xác nhận", desc: "Đã xác nhận, chờ sản xuất", icon: "✅" },
  MANUFACTURING: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: "Đang sản xuất", desc: "Đang được sản xuất", icon: "🏭" },
  SHIPPING: { color: "#34d399", bg: "rgba(52,211,153,0.12)", label: "Đang giao", desc: "Đang trên đường giao đến khách", icon: "🚚" },
  DELIVERED: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", label: "Đã giao", desc: "Đã giao thành công", icon: "📦" },
  CANCELLED: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Đã hủy", desc: "Đơn hàng đã bị hủy", icon: "❌" },
  RETURN_PENDING: { color: "#f472b6", bg: "rgba(244,114,182,0.12)", label: "Hoàn hàng", desc: "Đang xử lý hoàn hàng", icon: "🔄" },
};

const FILTERS = ["ALL", "PENDING", "CONFIRMED", "MANUFACTURING", "SHIPPING", "DELIVERED", "RETURN_PENDING"];
const TYPE_ICON = { READY_MADE: "👓", CONTACT_LENS: "👁️", MY_GLASSES: "✨", FRAME: "🕶️", LENS: "🔍" };
const TYPE_LABEL = { READY_MADE: "Kính có sẵn", CONTACT_LENS: "Kính áp tròng", MY_GLASSES: "Kính thiết kế", FRAME: "Gọng kính", LENS: "Tròng kính" };
const TYPE_COLOR = { READY_MADE: "rgba(251,191,36,0.15)//#fbbf24", CONTACT_LENS: "rgba(96,165,250,0.15)//#60a5fa", MY_GLASSES: "rgba(167,139,250,0.15)//#a78bfa", FRAME: "rgba(52,211,153,0.15)//#34d399", LENS: "rgba(251,146,60,0.15)//#fb923c" };

const fmt = n => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
const fmtDate = d => d ? new Date(d).toLocaleString("vi-VN") : "";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [designDetails, setDesignDetails] = useState({});
  const [operations, setOperations] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [selOp, setSelOp] = useState("");
  const [selShip, setSelShip] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) { navigate("/"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/staff/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
    try {
      const accs = await api.get("/admin/accounts").then(r => r.data).catch(() => api.get("/staff/accounts").then(r => r.data));
      const list = Array.isArray(accs) ? accs : [];
      const ops = list.filter(a => a.role === "OPERATION"), ships = list.filter(a => a.role === "SHIPPER");
      setOperations(ops); setShippers(ships);
      if (ops.length) setSelOp(String(ops[0].accountId));
      if (ships.length) setSelShip(String(ships[0].accountId));
    } catch { }
  };

  const fetchDesignDetail = async (order) => {
    const myGlassesItems = (order.items || []).filter(i => i.productType === "MY_GLASSES");
    if (myGlassesItems.length === 0) return;
    const details = { ...designDetails };
    await Promise.all(myGlassesItems.map(async (item) => {
      if (details[item.productId]) return;
      try {
        const res = await api.get(`/api/my-glasses/${item.productId}`);
        details[item.productId] = res.data?.data || res.data;
      } catch (e) { console.error(e); }
    }));
    setDesignDetails({ ...details });
  };

  const act = async (url, body, msg) => {
    setActing(true);
    try {
      await api.put(url, body);
      alert(msg || "Thành công!");
      await fetchAll(); setSelected(null);
    } catch (e) { alert("Lỗi: " + (e.response?.data?.message || e.message)); }
    finally { setActing(false); }
  };

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  const STAT_DATA = [
    { label: "Tổng đơn", value: orders.length, color: "#60a5fa", bg: "#60a5fa" },
    { label: "Chờ xác nhận", value: orders.filter(o => o.status === "PENDING").length, color: "#fbbf24", bg: "#fbbf24" },
    { label: "Đã xác nhận", value: orders.filter(o => o.status === "CONFIRMED").length, color: "#818cf8", bg: "#818cf8" },
    { label: "Sản xuất", value: orders.filter(o => o.status === "MANUFACTURING").length, color: "#a78bfa", bg: "#a78bfa" },
    { label: "Đang giao", value: orders.filter(o => o.status === "SHIPPING").length, color: "#34d399", bg: "#34d399" },
    { label: "Hoàn thành", value: orders.filter(o => o.status === "DELIVERED").length, color: "#4ade80", bg: "#4ade80" },
  ];

  return (
    <div className="sf-page">
      <style>{CSS}</style>

      <nav className="sf-nav">
        <div className="sf-nav-inner">
          <div className="sf-logo" onClick={() => navigate("/")}>
            <div className="sf-logo-icon">👓</div>
            <div>
              <div className="sf-logo-text">GlassesShop</div>
              <div className="sf-logo-sub">Staff Portal</div>
            </div>
          </div>
          <div className="sf-nav-divider" />
          <div className="sf-nav-badge">
            <div className="sf-nav-badge-dot" />
            Quản lý đơn hàng
          </div>
          <div className="sf-nav-right">
            {user.role === "ADMIN" && <button className="sf-refresh" onClick={() => navigate("/admin")}>Admin Panel</button>}
            <button className="sf-refresh" onClick={() => navigate("/staff")}>Dashboard</button>
            <div className="sf-nav-user">
              <div className="sf-nav-user-avatar">{(user?.name || user?.username || "S").charAt(0).toUpperCase()}</div>
              <span className="sf-nav-user-name">{user?.name?.split(" ").pop() || user?.username}</span>
            </div>
            <button className="sf-nav-logout" onClick={() => { logout(); navigate("/"); }}>Đăng xuất</button>
          </div>
        </div>
      </nav>

      <div className="sf-main">
        {/* STATS */}
        <div className="sf-stats">
          {STAT_DATA.map(s => (
            <div key={s.label} className="sf-stat" style={{ borderColor: `${s.color}22` }}>
              <div className="sf-stat-glow" style={{ background: s.bg }} />
              <div className="sf-stat-label">{s.label}</div>
              <div className="sf-stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className={`sf-grid ${selected ? "sf-grid-split" : ""}`}>
          {/* ORDER LIST */}
          <div className="sf-panel">
            <div className="sf-panel-head">
              <span className="sf-panel-title">Danh sách đơn hàng</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div className="sf-filters">
                  {FILTERS.map(f => {
                    const sc = STATUS[f];
                    const cnt = f === "ALL" ? orders.length : orders.filter(o => o.status === f).length;
                    return (
                      <button key={f} className={`sf-filter ${filter === f ? "active" : ""}`}
                        style={filter === f ? { background: sc?.color || "#ef4444", borderColor: "transparent" } : {}}
                        onClick={() => setFilter(f)}>
                        {sc?.icon || "📋"} {sc?.label || "Tất cả"} <span style={{ opacity: 0.7 }}>({cnt})</span>
                      </button>
                    );
                  })}
                </div>
                <button className="sf-refresh" onClick={fetchAll}>↻ Tải lại</button>
              </div>
            </div>

            {loading ? <Spinner /> : filtered.length === 0 ? (
              <div className="sf-empty"><div className="sf-empty-icon">📋</div>Không có đơn hàng nào.</div>
            ) : (
              <div className="sf-list">
                {filtered.map(o => {
                  const sc = STATUS[o.status] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", label: o.status, icon: "📦" };
                  return (
                    <div key={o.orderId} className={`sf-order ${selected?.orderId === o.orderId ? "active" : ""}`}
                      onClick={() => { setSelected(o); fetchDesignDetail(o); }}>
                      <div className="sf-order-top">
                        <span className="sf-order-id">#{o.orderId}</span>
                        <span className="sf-order-badge" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <div className="sf-order-customer">👤 <strong>{o.customerName || "ID " + o.customerId}</strong></div>
                      {o.shippingAddress && <div className="sf-order-addr">📍 {o.shippingAddress}</div>}
                      {(o.items || []).length > 0 && (
                        <div className="sf-order-items">
                          {o.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="sf-order-item-chip">
                              {TYPE_ICON[item.productType] || "📦"} {item.productName || "Sản phẩm"}{item.quantity > 1 ? ` ×${item.quantity}` : ""}
                            </span>
                          ))}
                          {o.items.length > 3 && <span className="sf-order-item-chip">+{o.items.length - 3}</span>}
                        </div>
                      )}
                      <div className="sf-order-bottom">
                        <span className="sf-order-amount">{fmt(o.finalAmount)}</span>
                        <div className="sf-order-meta">
                          <span className={`sf-pay-tag ${o.paymentStatus === "PAID" ? "paid" : "unpaid"}`}>
                            {o.paymentStatus === "PAID" ? "✓ Đã TT" : "⏳ Chưa TT"}
                          </span>
                          {o.paymentMethod === "COD" && o.paymentStatus !== "PAID" && <span className="sf-pay-tag cod">COD</span>}
                          <span className="sf-order-date">{o.orderDate ? new Date(o.orderDate).toLocaleDateString("vi-VN") : ""}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAIL */}
          {selected && (() => {
            const sc = STATUS[selected.status] || { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", label: selected.status, icon: "📦", desc: "" };
            return (
              <div className="sf-detail">
                <div className="sf-detail-head">
                  <div>
                    <div className="sf-detail-title">Đơn hàng #{selected.orderId}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{fmtDate(selected.orderDate)}</div>
                  </div>
                  <button className="sf-close" onClick={() => setSelected(null)}>✕</button>
                </div>

                <div className="sf-detail-body">
                  {/* Status Hero */}
                  <div className="sf-status-hero" style={{ background: sc.bg, border: `1px solid ${sc.color}30` }}>
                    <span className="sf-status-icon">{sc.icon}</span>
                    <div>
                      <div className="sf-status-name" style={{ color: sc.color }}>{sc.label}</div>
                      <div className="sf-status-desc">{sc.desc}</div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="sf-total">
                    <div>
                      <div className="sf-total-label">Tổng thanh toán</div>
                      {selected.discountCode && <div style={{ fontSize: 11, color: "#4ade80", marginTop: 2 }}>🏷️ Mã: {selected.discountCode}</div>}
                    </div>
                    <div className="sf-total-amount">{fmt(selected.finalAmount)}</div>
                  </div>

                  {/* Info */}
                  <div className="sf-section">
                    <div className="sf-section-title">Thông tin đơn</div>
                    <div className="sf-info-grid">
                      {[
                        ["Khách hàng", selected.customerName || "ID " + selected.customerId],
                        ["Địa chỉ giao", selected.shippingAddress],
                        ["Thanh toán", selected.paymentMethod === "COD" ? "💵 Tiền mặt (COD)" : "🏦 Chuyển khoản"],
                        ["Trạng thái TT", selected.paymentStatus === "PAID" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"],
                        ["Tạm tính", fmt(selected.totalAmount)],
                      ].filter(([, v]) => v).map(([l, v]) => (
                        <div key={l} className="sf-info-row">
                          <span className="sf-info-label">{l}</span>
                          <span className="sf-info-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products */}
                  {(selected.items || []).length > 0 && (
                    <div className="sf-section">
                      <div className="sf-section-title">Sản phẩm ({selected.items.length})</div>
                      {selected.items.map((item, i) => {
                        const [bg, color] = (TYPE_COLOR[item.productType] || "rgba(148,163,184,0.15)//#94a3b8").split("//");
                        return (
                          <div key={i} className="sf-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                              <div className="sf-item-left">
                                <span className="sf-item-emoji">{TYPE_ICON[item.productType] || "📦"}</span>
                                <div style={{ minWidth: 0 }}>
                                  <div className="sf-item-name">{item.productName || "Sản phẩm"}</div>
                                  <span className="sf-item-type" style={{ background: bg, color }}>{TYPE_LABEL[item.productType] || item.productType}</span>
                                </div>
                              </div>
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div className="sf-item-price">{fmt((item.price || 0) * (item.quantity || 1))}</div>
                                <div className="sf-item-qty">×{item.quantity} · {fmt(item.price)}</div>
                              </div>
                            </div>
                            {item.productType === "MY_GLASSES" && (() => {
                              const d = designDetails[item.productId];
                              const design = d?.design || d;
                              return (
                                <div style={{ marginTop: 10, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "10px 12px" }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "#fbbf24", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                                    ⚠️ Thông số kính thiết kế
                                  </div>
                                  {!design ? (
                                    <div style={{ fontSize: 12, color: "#64748b" }}>Đang tải thông số...</div>
                                  ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                                      {[
                                        ["Tên thiết kế", design.designName],
                                        ["Khách hàng", design.customerName],
                                        ["Hồ sơ mắt",     design.eyeProfileName],
                                        ["Gọng kính", design.frameName ? `${design.frameName} (${design.frameBrand || ""})` : null],
                                        ["Chất liệu", design.frameMaterial],
                                        ["Màu gọng", design.frameColor],
                                        ["Kích thước", design.frameSize],
                                        ["Kiểu viền", design.frameRimType],
                                        ["Tròng kính", design.lensName],
                                        ["Loại tròng", design.lensType],
                                      ].filter(([, v]) => v).map(([label, val]) => (
                                        <div key={label} style={{ display: "flex", gap: 6, fontSize: 12 }}>
                                          <span style={{ color: "#64748b", flexShrink: 0 }}>{label}:</span>
                                          <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{val}</span>
                                        </div>
                                      ))}
                                      

                                      {/* Thông số mắt từ hồ sơ */}
                                      {(design.prescriptions||[]).length>0&&(
                                        <div style={{gridColumn:"1/-1",marginTop:8,padding:"8px 10px",background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:6}}>
                                          <div style={{fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>
                                            👁️ Thông số mắt
                                          </div>
                                          {design.prescriptions.map((p,i)=>(
                                            <div key={i} style={{fontSize:12,marginBottom:4,display:"flex",gap:12,flexWrap:"wrap"}}>
                                              <span style={{fontWeight:700,color:"#93c5fd",minWidth:60}}>
                                                {p.eyeSide==="RIGHT"?"Mắt phải":"Mắt trái"}:
                                              </span>
                                              {[
                                                p.sph!=null&&`SPH: ${p.sph}`,
                                                p.cyl!=null&&`CYL: ${p.cyl}`,
                                                p.axis!=null&&`Axis: ${p.axis}°`,
                                                p.pd!=null&&`PD: ${p.pd}mm`,
                                                p.add!=null&&p.add!=0&&`ADD: ${p.add}`,
                                              ].filter(Boolean).map((t,j)=>(
                                                <span key={j} style={{color:"#e2e8f0",marginRight:8}}>{t}</span>
                                              ))}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      {(design.selectedOptions || []).length > 0 && (
                                        <div style={{ gridColumn: "1/-1", marginTop: 4 }}>
                                          <span style={{ color: "#64748b", fontSize: 12 }}>Tùy chọn thêm: </span>
                                          <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>
                                            {design.selectedOptions.map(o => o.optionName || o.coating || "Option").join(", ")}
                                          </span>
                                        </div>
                                      )}
                                      <div style={{ gridColumn: "1/-1", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 12, color: "#64748b" }}>Tổng giá thiết kế:</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>{fmt(design.totalPrice)}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="sf-section">
                    <div className="sf-section-title">Hành động</div>
                    <div className="sf-actions">

                      {/* PENDING → Xác nhận + Hủy đơn */}
                      {selected.status === "PENDING" && (
                        <>
                          <button className="sf-action-btn sf-action-btn-blue" disabled={acting}
                            onClick={() => act("/staff/orders/" + selected.orderId + "/confirm", {}, "Đã xác nhận đơn hàng #" + selected.orderId + "!")}>
                            ✅ Xác nhận đơn hàng
                          </button>
                          <button className="sf-action-btn sf-action-btn-red" disabled={acting}
                            onClick={async () => {
                              const reason = window.prompt("Lý do hủy đơn hàng #" + selected.orderId + ":", "Hàng lỗi / không đủ hàng");
                              if (reason === null) return; // user bấm Cancel
                              setActing(true);
                              try {
                                await api.put("/staff/orders/" + selected.orderId + "/reject", { reason });
                                alert("Đã hủy đơn hàng #" + selected.orderId + "! Lý do: " + reason);
                                await fetchAll();
                                setSelected(null);
                              } catch (e) { alert("Lỗi: " + (e.response?.data?.message || e.message)); }
                              finally { setActing(false); }
                            }}>
                            ❌ Hủy đơn hàng
                          </button>
                        </>
                      )}

                      {selected.status === "CONFIRMED" && (
                        <div className="sf-assign">
                          <div className="sf-assign-label">🏭 Giao cho bộ phận sản xuất</div>
                          {operations.length === 0 ? (
                            <div style={{ color: "#f87171", fontSize: 12 }}>⚠️ Không có nhân viên Operation!</div>
                          ) : (
                            <div className="sf-assign-row">
                              <select className="sf-select" value={selOp} onChange={e => setSelOp(e.target.value)}>
                                {operations.map(op => (
                                  <option key={op.accountId} value={op.accountId}>{op.name || op.username}</option>
                                ))}
                              </select>
                              <button className="sf-action-btn sf-action-btn-purple" style={{ width: "auto", padding: "9px 16px", fontSize: 12 }}
                                disabled={acting || !selOp}
                                onClick={() => act("/staff/orders/" + selected.orderId + "/assign-operation", { accountId: parseInt(selOp) }, "🏭 Đã giao cho Operation!")}>
                                Giao SX
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {selected.status === "MANUFACTURING" && (
                        <div className="sf-alert" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", color: "#a78bfa" }}>
                          🏭 Đang sản xuất — Chờ Operation hoàn thành.
                        </div>
                      )}

                      {selected.status === "SHIPPING" && !selected.shipperAssigned && (
                        <div className="sf-assign">
                          <div className="sf-assign-label">🚚 Phân công Shipper giao hàng</div>
                          {shippers.length === 0 ? (
                            <div style={{ color: "#f87171", fontSize: 12 }}>⚠️ Không có Shipper nào!</div>
                          ) : (
                            <div className="sf-assign-row">
                              <select className="sf-select" value={selShip} onChange={e => setSelShip(e.target.value)}>
                                {shippers.map(s => (
                                  <option key={s.accountId} value={s.accountId}>{s.name || s.username}</option>
                                ))}
                              </select>
                              <button className="sf-action-btn sf-action-btn-cyan" style={{ width: "auto", padding: "9px 16px", fontSize: 12 }}
                                disabled={acting || !selShip}
                                onClick={() => act("/staff/orders/" + selected.orderId + "/assign-shipper", { accountId: parseInt(selShip) }, "🚚 Đã phân công Shipper!")}>
                                Giao Ship
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {selected.status === "SHIPPING" && selected.shipperAssigned && (
                        <div className="sf-alert" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>
                          ✅ Đã phân công Shipper — Đang chờ giao hàng.
                        </div>
                      )}

                      {selected.status === "RETURN_PENDING" && (
                        <button className="sf-action-btn sf-action-btn-pink" disabled={acting}
                          onClick={() => act("/staff/orders/" + selected.orderId + "/return", {}, "🔄 Đã xử lý hoàn hàng đơn #" + selected.orderId)}>
                          🔄 Xử lý hoàn hàng
                        </button>
                      )}

                      {["DELIVERED", "CANCELLED"].includes(selected.status) && (
                        <div className="sf-alert" style={{
                          background: selected.status === "DELIVERED" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                          border: `1px solid ${selected.status === "DELIVERED" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                          color: selected.status === "DELIVERED" ? "#4ade80" : "#f87171",
                          justifyContent: "center",
                        }}>
                          {selected.status === "DELIVERED" ? "✅ Đơn hàng đã giao thành công." : "❌ Đơn hàng đã bị hủy."}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return <div className="sf-spinner-wrap"><div className="sf-spinner" /></div>;
}