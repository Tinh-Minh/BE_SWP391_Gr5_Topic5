import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import api from "../services/api";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.op-page { min-height:100vh; background:#0f1117; font-family:'Inter',system-ui,sans-serif; color:#e2e8f0; }

/* NAV */
.op-nav {
  position:sticky; top:0; z-index:200;
  background:rgba(15,17,23,0.95); backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(139,92,246,0.2); height:64px;
}
.op-nav-inner { max-width:1400px; margin:0 auto; padding:0 24px; height:100%; display:flex; align-items:center; gap:16px; }
.op-logo { display:flex; align-items:center; gap:10px; cursor:pointer; flex-shrink:0; }
.op-logo-icon {
  width:36px; height:36px; background:linear-gradient(135deg,#8b5cf6,#7c3aed);
  border-radius:10px; display:flex; align-items:center; justify-content:center;
  font-size:18px; box-shadow:0 4px 12px rgba(139,92,246,0.35);
}
.op-logo-text { font-size:16px; font-weight:700; color:#fff; }
.op-logo-sub  { font-size:10px; color:#94a3b8; letter-spacing:1px; text-transform:uppercase; }
.op-nav-divider { width:1px; height:28px; background:rgba(139,92,246,0.3); margin:0 4px; }
.op-nav-badge {
  display:flex; align-items:center; gap:8px; padding:6px 14px;
  background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.25);
  border-radius:20px; font-size:12px; color:#c4b5fd; font-weight:500;
}
.op-nav-badge-dot { width:6px; height:6px; background:#8b5cf6; border-radius:50%; animation:opPulse 2s infinite; }
@keyframes opPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.op-nav-right { margin-left:auto; display:flex; align-items:center; gap:8px; }
.op-nav-user {
  display:flex; align-items:center; gap:8px; padding:6px 14px;
  background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
  border-radius:8px; cursor:default;
}
.op-nav-avatar {
  width:28px; height:28px; background:linear-gradient(135deg,#8b5cf6,#6d28d9);
  border-radius:8px; display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:white;
}
.op-nav-name { font-size:13px; font-weight:500; color:#e2e8f0; }
.op-nav-logout {
  padding:6px 14px; background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2);
  border-radius:8px; color:#c4b5fd; font-size:12px; font-weight:500; cursor:pointer; transition:all 0.15s;
}
.op-nav-logout:hover { background:rgba(139,92,246,0.2); }

/* MAIN */
.op-main { max-width:1400px; margin:0 auto; padding:24px; }

/* STATS */
.op-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
.op-stat {
  border-radius:16px; padding:22px 20px; position:relative; overflow:hidden;
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
  transition:transform 0.15s; cursor:default;
}
.op-stat:hover { transform:translateY(-2px); }
.op-stat-glow {
  position:absolute; width:100px; height:100px; border-radius:50%;
  top:-20px; right:-20px; opacity:0.1; filter:blur(20px);
}
.op-stat-icon { font-size:28px; margin-bottom:10px; }
.op-stat-value { font-size:36px; font-weight:800; line-height:1; margin-bottom:6px; }
.op-stat-label { font-size:12px; color:#64748b; font-weight:500; text-transform:uppercase; letter-spacing:0.5px; }

/* PIPELINE VIEW */
.op-pipeline { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
.op-pipe-col {
  background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07);
  border-radius:14px; overflow:hidden; min-height:200px;
}
.op-pipe-head {
  padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; align-items:center; justify-content:space-between;
}
.op-pipe-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; display:flex; align-items:center; gap:6px; }
.op-pipe-count {
  min-width:22px; height:22px; border-radius:6px; display:flex; align-items:center;
  justify-content:center; font-size:12px; font-weight:700; padding:0 6px;
}
.op-pipe-body { padding:8px; display:flex; flex-direction:column; gap:6px; min-height:80px; }
.op-pipe-card {
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  border-radius:8px; padding:10px 12px; cursor:pointer; transition:all 0.15s;
}
.op-pipe-card:hover { background:rgba(255,255,255,0.09); transform:translateX(2px); }
.op-pipe-card.active { border-color:rgba(139,92,246,0.5); background:rgba(139,92,246,0.08); }
.op-pipe-order-id { font-size:12px; font-weight:700; color:#e2e8f0; margin-bottom:4px; }
.op-pipe-items { display:flex; flex-wrap:wrap; gap:4px; }
.op-pipe-chip {
  font-size:10px; padding:2px 6px; background:rgba(255,255,255,0.06);
  border-radius:4px; color:#94a3b8; display:inline-flex; align-items:center; gap:3px;
}
.op-pipe-amount { font-size:12px; font-weight:700; color:#c4b5fd; margin-top:6px; }

/* GRID */
.op-grid { display:grid; gap:16px; }
.op-grid-split { grid-template-columns:1fr 420px; }

/* PANEL */
.op-panel {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
  border-radius:16px; overflow:hidden;
}
.op-panel-head {
  padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;
}
.op-panel-title { font-size:15px; font-weight:700; color:#f1f5f9; }

/* FILTERS */
.op-filters { display:flex; gap:6px; flex-wrap:wrap; }
.op-filter {
  padding:5px 12px; border:1px solid rgba(255,255,255,0.1); border-radius:20px;
  font-size:11px; font-weight:500; cursor:pointer; background:transparent; color:#94a3b8; transition:all 0.15s;
}
.op-filter:hover { border-color:rgba(255,255,255,0.2); color:#e2e8f0; }
.op-filter.active { background:#7c3aed; border-color:#7c3aed; color:#fff; font-weight:600; }
.op-refresh {
  padding:5px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
  border-radius:8px; color:#94a3b8; font-size:12px; cursor:pointer; transition:all 0.15s;
}
.op-refresh:hover { background:rgba(255,255,255,0.1); color:#e2e8f0; }

/* LIST */
.op-list { max-height:calc(100vh - 330px); overflow-y:auto; }
.op-list::-webkit-scrollbar { width:4px; }
.op-list::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }

.op-order {
  padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.05);
  cursor:pointer; transition:all 0.12s; border-left:3px solid transparent;
}
.op-order:hover { background:rgba(139,92,246,0.04); }
.op-order.active { background:rgba(139,92,246,0.07); border-left-color:#8b5cf6; }
.op-order-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.op-order-id { font-size:14px; font-weight:700; color:#f1f5f9; }
.op-order-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
.op-order-items { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
.op-order-chip {
  display:inline-flex; align-items:center; gap:4px; padding:3px 8px;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
  border-radius:6px; font-size:11px; color:#94a3b8;
}
.op-order-bottom { display:flex; justify-content:space-between; align-items:center; }
.op-order-amount { font-size:14px; font-weight:700; color:#c4b5fd; }
.op-order-date { font-size:11px; color:#475569; }

/* DETAIL */
.op-detail {
  background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
  border-radius:16px; position:sticky; top:80px;
  max-height:calc(100vh - 104px); overflow-y:auto;
}
.op-detail::-webkit-scrollbar { width:4px; }
.op-detail::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.2); border-radius:2px; }
.op-detail-head {
  padding:18px 20px; border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; align-items:center; justify-content:space-between;
  position:sticky; top:0; background:#14161e; z-index:10;
}
.op-detail-title { font-size:16px; font-weight:700; color:#f1f5f9; }
.op-detail-sub { font-size:11px; color:#64748b; margin-top:2px; }
.op-close {
  width:30px; height:30px; background:rgba(255,255,255,0.07); border:none;
  border-radius:8px; color:#94a3b8; font-size:16px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all 0.15s;
}
.op-close:hover { background:rgba(255,255,255,0.12); color:#e2e8f0; }
.op-detail-body { padding:20px; display:flex; flex-direction:column; gap:20px; }

/* Progress Timeline */
.op-timeline { display:flex; flex-direction:column; gap:0; }
.op-tl-step { display:flex; gap:12px; }
.op-tl-line-wrap { display:flex; flex-direction:column; align-items:center; }
.op-tl-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.op-tl-connector { width:2px; flex:1; min-height:20px; margin:2px 0; }
.op-tl-content { padding-bottom:16px; padding-top:4px; flex:1; }
.op-tl-title { font-size:13px; font-weight:600; }
.op-tl-desc  { font-size:11px; color:#64748b; margin-top:2px; }

/* Section */
.op-section { }
.op-section-title {
  font-size:10px; font-weight:700; color:#475569; letter-spacing:1.5px;
  text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px;
}
.op-section-title::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }

/* Info */
.op-info-row {
  display:flex; justify-content:space-between; align-items:start;
  padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); gap:12px;
}
.op-info-row:last-child { border-bottom:none; }
.op-info-label { font-size:12px; color:#64748b; flex-shrink:0; }
.op-info-value { font-size:13px; font-weight:500; color:#e2e8f0; text-align:right; word-break:break-word; max-width:60%; }

/* Item card */
.op-item {
  background:rgba(139,92,246,0.06); border:1px solid rgba(139,92,246,0.15);
  border-radius:10px; padding:12px 14px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between;
}
.op-item:last-child { margin-bottom:0; }
.op-item-warn {
  margin-top:8px; background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.2);
  border-radius:6px; padding:6px 10px; font-size:11px; color:#fbbf24; grid-column:1/-1;
}

/* Action buttons */
.op-actions { display:flex; flex-direction:column; gap:10px; }
.op-btn {
  width:100%; padding:14px 16px; border:none; border-radius:10px;
  font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.op-btn:hover:not(:disabled) { transform:translateY(-1px); filter:brightness(1.1); }
.op-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
.op-btn-start { background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; box-shadow:0 4px 12px rgba(139,92,246,0.3); }
.op-btn-done  { background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; box-shadow:0 4px 12px rgba(34,197,94,0.3); }

/* Alert */
.op-alert { border-radius:10px; padding:13px 16px; font-size:13px; font-weight:500; display:flex; align-items:center; gap:10px; }
.op-alert-inprogress { background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.2); color:#c4b5fd; }
.op-alert-done       { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); color:#4ade80; text-align:center; flex-direction:column; }

/* Empty/Spinner */
.op-empty { text-align:center; padding:60px 20px; color:#475569; }
.op-empty-icon { font-size:48px; margin-bottom:12px; opacity:0.4; }
.op-spinner-wrap { text-align:center; padding:60px; }
.op-spinner {
  display:inline-block; width:32px; height:32px;
  border:3px solid rgba(255,255,255,0.08); border-top-color:#8b5cf6;
  border-radius:50%; animation:opSpin 0.8s linear infinite;
}
@keyframes opSpin { to { transform:rotate(360deg); } }
`;

const MFG = {
  PENDING:     { label:"Chờ sản xuất",  color:"#fbbf24", bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.2)",  icon:"⏳", desc:"Đơn đã được giao, chờ bắt đầu sản xuất" },
  IN_PROGRESS: { label:"Đang sản xuất", color:"#a78bfa", bg:"rgba(167,139,250,0.12)", border:"rgba(167,139,250,0.2)", icon:"🔧", desc:"Đang trong quá trình sản xuất" },
  COMPLETED:   { label:"Hoàn thành SX", color:"#4ade80", bg:"rgba(74,222,128,0.12)",  border:"rgba(74,222,128,0.2)",  icon:"✅", desc:"Sản xuất hoàn tất, chuyển sang giao hàng" },
};

const TYPE_ICON  = { READY_MADE:"👓", CONTACT_LENS:"👁️", MY_GLASSES:"✨", FRAME:"🕶️", LENS:"🔍" };
const TYPE_LABEL = { READY_MADE:"Kính có sẵn", CONTACT_LENS:"Kính áp tròng", MY_GLASSES:"Kính thiết kế", FRAME:"Gọng kính", LENS:"Tròng kính" };

const fmt     = n => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(n||0);
const fmtDate = d => d ? new Date(d).toLocaleString("vi-VN") : "";

export default function OperationDashboard() {
  const navigate  = useNavigate();
  const user      = getUser();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [acting, setActing]     = useState(false);
  const [filter, setFilter]     = useState("ALL");
  const [designDetails, setDesignDetails] = useState({}); // cache design info cho MY_GLASSES

  useEffect(() => {
    if (!user || !["ADMIN","OPERATION"].includes(user.role)) { navigate("/"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/operation/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchDesignDetail = async (order) => {
    const myGlassesItems = (order.items||[]).filter(i => i.productType === "MY_GLASSES");
    if (myGlassesItems.length === 0) return;
    const details = { ...designDetails };
    await Promise.all(myGlassesItems.map(async (item) => {
      if (details[item.productId]) return; // đã cache rồi
      try {
        const res = await api.get(`/api/my-glasses/${item.productId}`);
        const data = res.data?.data || res.data;
        details[item.productId] = data;
      } catch(e) { console.error("Fetch design failed:", e); }
    }));
    setDesignDetails({ ...details });
  };

  const updateStatus = async (orderId, status) => {
    const msgs = { IN_PROGRESS:"Bắt đầu sản xuất đơn này?", COMPLETED:"Xác nhận hoàn thành sản xuất?" };
    if (!window.confirm(msgs[status]||"Cập nhật?")) return;
    setActing(true);
    try {
      await api.put("/operation/orders/"+orderId+"/status", { status });
      await fetchOrders();
      setSelected(prev => prev ? { ...prev, manufacturingStatus:status } : null);
    } catch(e) { alert("Lỗi: "+(e.response?.data?.message||e.message)); }
    finally { setActing(false); }
  };

  const filtered = filter==="ALL" ? orders : orders.filter(o=>(o.manufacturingStatus||"PENDING")===filter);
  const pending    = orders.filter(o=>!o.manufacturingStatus||o.manufacturingStatus==="PENDING");
  const inProgress = orders.filter(o=>o.manufacturingStatus==="IN_PROGRESS");
  const completed  = orders.filter(o=>o.manufacturingStatus==="COMPLETED");

  return (
    <div className="op-page">
      <style>{CSS}</style>

      <nav className="op-nav">
        <div className="op-nav-inner">
          <div className="op-logo" onClick={()=>navigate("/")}>
            <div className="op-logo-icon">🔧</div>
            <div>
              <div className="op-logo-text">GlassesShop</div>
              <div className="op-logo-sub">Operation Portal</div>
            </div>
          </div>
          <div className="op-nav-divider"/>
          <div className="op-nav-badge">
            <div className="op-nav-badge-dot"/>
            Quản lý sản xuất
          </div>
          <div className="op-nav-right">
            <div className="op-nav-user">
              <div className="op-nav-avatar">{(user?.name||user?.username||"O").charAt(0).toUpperCase()}</div>
              <span className="op-nav-name">{user?.name?.split(" ").pop()||user?.username}</span>
            </div>
            <button className="op-refresh" onClick={()=>navigate("/operation")}>Dashboard</button>
            <button className="op-nav-logout" onClick={()=>{logout();navigate("/");}}>Đăng xuất</button>
          </div>
        </div>
      </nav>

      <div className="op-main">
        {/* STATS */}
        <div className="op-stats">
          {[
            { icon:"📦", label:"Tổng đơn được giao", value:orders.length,       color:"#a78bfa", bg:"#8b5cf6" },
            { icon:"⏳", label:"Chờ sản xuất",        value:pending.length,      color:"#fbbf24", bg:"#f59e0b" },
            { icon:"🔧", label:"Đang sản xuất",        value:inProgress.length,  color:"#60a5fa", bg:"#3b82f6" },
            { icon:"✅", label:"Đã hoàn thành",        value:completed.length,   color:"#4ade80", bg:"#22c55e" },
          ].map(s=>(
            <div key={s.label} className="op-stat" style={{borderColor:`${s.color}22`}}>
              <div className="op-stat-glow" style={{background:s.bg}}/>
              <div className="op-stat-icon">{s.icon}</div>
              <div className="op-stat-value" style={{color:s.color}}>{s.value}</div>
              <div className="op-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* KANBAN PIPELINE */}
        {!loading && (
          <div className="op-pipeline">
            {[
              { key:"PENDING",     orders:pending,    ...MFG.PENDING    },
              { key:"IN_PROGRESS", orders:inProgress, ...MFG.IN_PROGRESS },
              { key:"COMPLETED",   orders:completed,  ...MFG.COMPLETED   },
            ].map(col=>(
              <div key={col.key} className="op-pipe-col" style={{borderTopColor:col.color,borderTopWidth:2}}>
                <div className="op-pipe-head">
                  <span className="op-pipe-title" style={{color:col.color}}>
                    {col.icon} {col.label}
                  </span>
                  <span className="op-pipe-count" style={{background:col.bg,color:col.color}}>{col.orders.length}</span>
                </div>
                <div className="op-pipe-body">
                  {col.orders.slice(0,5).map(o=>(
                    <div key={o.orderId} className={`op-pipe-card ${selected?.orderId===o.orderId?"active":""}`}
                      onClick={()=>{ setSelected(o); fetchDesignDetail(o); }}>
                      <div className="op-pipe-order-id">Đơn #{o.orderId}</div>
                      <div className="op-pipe-items">
                        {(o.items||[]).slice(0,2).map((item,i)=>(
                          <span key={i} className="op-pipe-chip">{TYPE_ICON[item.productType]||"📦"} {(item.productName||"SP").substring(0,14)}</span>
                        ))}
                      </div>
                      <div className="op-pipe-amount">{fmt(o.finalAmount)}</div>
                    </div>
                  ))}
                  {col.orders.length>5&&<div style={{fontSize:11,color:"#475569",textAlign:"center",padding:"8px 0"}}>+{col.orders.length-5} đơn nữa</div>}
                  {col.orders.length===0&&<div style={{fontSize:12,color:"#334155",textAlign:"center",padding:"20px 0"}}>Trống</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={`op-grid ${selected?"op-grid-split":""}`}>
          {/* ORDER LIST */}
          <div className="op-panel">
            <div className="op-panel-head">
              <span className="op-panel-title">Danh sách đơn hàng</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div className="op-filters">
                  {[
                    {key:"ALL",label:"Tất cả"},
                    {key:"PENDING",label:"⏳ Chờ SX"},
                    {key:"IN_PROGRESS",label:"🔧 Đang SX"},
                    {key:"COMPLETED",label:"✅ Xong"},
                  ].map(f=>(
                    <button key={f.key} className={`op-filter ${filter===f.key?"active":""}`} onClick={()=>setFilter(f.key)}>
                      {f.label}
                    </button>
                  ))}
                </div>
                <button className="op-refresh" onClick={fetchOrders}>↻</button>
              </div>
            </div>

            {loading ? <div className="op-spinner-wrap"><div className="op-spinner"/></div>
            : filtered.length===0 ? (
              <div className="op-empty"><div className="op-empty-icon">🏭</div>Không có đơn hàng nào!</div>
            ) : (
              <div className="op-list">
                {filtered.map(order=>{
                  const mfg=MFG[order.manufacturingStatus||"PENDING"];
                  return(
                    <div key={order.orderId} className={`op-order ${selected?.orderId===order.orderId?"active":""}`}
                      onClick={()=>{ setSelected(order); fetchDesignDetail(order); }}>
                      <div className="op-order-top">
                        <span className="op-order-id">Đơn #{order.orderId}</span>
                        <span className="op-order-badge" style={{background:mfg.bg,color:mfg.color}}>{mfg.icon} {mfg.label}</span>
                      </div>
                      <div className="op-order-items">
                        {(order.items||[]).map((item,i)=>(
                          <span key={i} className="op-order-chip">
                            {TYPE_ICON[item.productType]||"📦"} {item.productName||"Sản phẩm"} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                      <div className="op-order-bottom">
                        <span className="op-order-amount">{fmt(order.finalAmount)}</span>
                        <span className="op-order-date">{order.orderDate?new Date(order.orderDate).toLocaleDateString("vi-VN"):""}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAIL */}
          {selected&&(()=>{
            const mfg=MFG[selected.manufacturingStatus||"PENDING"];
            const tlSteps=[
              { key:"PENDING",     done:true,                                             ...MFG.PENDING     },
              { key:"IN_PROGRESS", done:["IN_PROGRESS","COMPLETED"].includes(selected.manufacturingStatus||"PENDING"), ...MFG.IN_PROGRESS },
              { key:"COMPLETED",   done:selected.manufacturingStatus==="COMPLETED",       ...MFG.COMPLETED   },
            ];
            return(
              <div className="op-detail">
                <div className="op-detail-head">
                  <div>
                    <div className="op-detail-title">Đơn #{selected.orderId}</div>
                    <div className="op-detail-sub">{fmtDate(selected.orderDate)}</div>
                  </div>
                  <button className="op-close" onClick={()=>setSelected(null)}>✕</button>
                </div>

                <div className="op-detail-body">
                  {/* Current Status */}
                  <div style={{background:mfg.bg,border:`1px solid ${mfg.border}`,borderRadius:12,padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
                    <span style={{fontSize:28}}>{mfg.icon}</span>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:mfg.color}}>{mfg.label}</div>
                      <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>{mfg.desc}</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="op-section">
                    <div className="op-section-title">Tiến trình sản xuất</div>
                    <div className="op-timeline">
                      {tlSteps.map((step,i)=>(
                        <div key={step.key} className="op-tl-step">
                          <div className="op-tl-line-wrap">
                            <div className="op-tl-dot" style={{background:step.done?step.bg:"rgba(255,255,255,0.05)",border:`2px solid ${step.done?step.color:"rgba(255,255,255,0.1)"}`}}>
                              <span style={{fontSize:12}}>{step.done?step.icon:"○"}</span>
                            </div>
                            {i<tlSteps.length-1&&<div className="op-tl-connector" style={{background:step.done?"linear-gradient(180deg,"+step.color+"44,rgba(255,255,255,0.07))":"rgba(255,255,255,0.05)"}}/>}
                          </div>
                          <div className="op-tl-content">
                            <div className="op-tl-title" style={{color:step.done?step.color:"#475569"}}>{step.label}</div>
                            <div className="op-tl-desc">{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="op-section">
                    <div className="op-section-title">Thông tin đơn</div>
                    {[
                      ["Mã đơn",     "#"+selected.orderId],
                      ["Khách hàng", selected.customerName||"ID "+selected.customerId],
                      ["Địa chỉ",    selected.shippingAddress],
                      ["Tổng tiền",  fmt(selected.finalAmount)],
                    ].filter(([,v])=>v).map(([l,v])=>(
                      <div key={l} className="op-info-row">
                        <span className="op-info-label">{l}</span>
                        <span className="op-info-value">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Products */}
                  {(selected.items||[]).length>0&&(
                    <div className="op-section">
                      <div className="op-section-title">Sản phẩm cần sản xuất</div>
                      {selected.items.map((item,i)=>(
                        <div key={i} className="op-item" style={{flexDirection:"column",alignItems:"stretch"}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                              <span style={{fontSize:22,flexShrink:0}}>{TYPE_ICON[item.productType]||"📦"}</span>
                              <div style={{minWidth:0}}>
                                <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9"}}>{item.productName||"Sản phẩm"}</div>
                                <span style={{fontSize:10,background:"rgba(139,92,246,0.15)",color:"#a78bfa",padding:"2px 7px",borderRadius:4,fontWeight:600}}>
                                  {TYPE_LABEL[item.productType]||item.productType}
                                </span>
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontWeight:700,color:"#c4b5fd"}}>×{item.quantity}</div>
                              <div style={{fontSize:11,color:"#64748b"}}>{fmt(item.price)}/cái</div>
                            </div>
                          </div>

                          {/* MY_GLASSES: hiển thị chi tiết thiết kế */}
                          {item.productType==="MY_GLASSES"&&(()=>{
                            const d = designDetails[item.productId];
                            const design = d?.design || d;
                            return (
                              <div style={{marginTop:10,background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:8,padding:"10px 12px"}}>
                                <div style={{fontSize:11,fontWeight:700,color:"#fbbf24",letterSpacing:1,marginBottom:8,textTransform:"uppercase"}}>
                                  ⚠️ Thông số kính thiết kế — cần sản xuất thủ công
                                </div>
                                {!design ? (
                                  <div style={{fontSize:12,color:"#64748b"}}>Đang tải thông số...</div>
                                ) : (
                                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 16px"}}>
                                    {[
                                      ["Tên thiết kế", design.designName],
                                      ["Khách hàng",   design.customerName],
                                        ["Hồ sơ mắt",     design.eyeProfileName],
                                      ["Gọng kính",    design.frameName ? `${design.frameName} (${design.frameBrand||""})` : null],
                                      ["Chất liệu gọng",design.frameMaterial],
                                      ["Màu gọng",     design.frameColor],
                                      ["Kích thước",   design.frameSize],
                                      ["Kiểu viền",    design.frameRimType],
                                      ["Tròng kính",   design.lensName],
                                      ["Loại tròng",   design.lensType],
                                    ].filter(([,v])=>v).map(([label,val])=>(
                                      <div key={label} style={{display:"flex",gap:6,fontSize:12}}>
                                        <span style={{color:"#64748b",flexShrink:0}}>{label}:</span>
                                        <span style={{fontWeight:600,color:"#e2e8f0"}}>{val}</span>
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
                                      {(design.selectedOptions||[]).length>0&&(
                                      <div style={{gridColumn:"1/-1",marginTop:4}}>
                                        <span style={{color:"#64748b",fontSize:12}}>Tùy chọn thêm: </span>
                                        <span style={{fontSize:12,fontWeight:600,color:"#a78bfa"}}>
                                          {design.selectedOptions.map(o=>o.optionName||o.coating||"Option").join(", ")}
                                        </span>
                                      </div>
                                    )}
                                    <div style={{gridColumn:"1/-1",marginTop:6,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between"}}>
                                      <span style={{fontSize:12,color:"#64748b"}}>Tổng giá thiết kế:</span>
                                      <span style={{fontSize:13,fontWeight:700,color:"#fbbf24"}}>{fmt(design.totalPrice)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="op-section">
                    <div className="op-section-title">Cập nhật tiến độ</div>
                    <div className="op-actions">
                      {(!selected.manufacturingStatus||selected.manufacturingStatus==="PENDING")&&(
                        <button className="op-btn op-btn-start" disabled={acting}
                          onClick={()=>updateStatus(selected.orderId,"IN_PROGRESS")}>
                          🔧 Bắt đầu sản xuất
                        </button>
                      )}
                      {selected.manufacturingStatus==="IN_PROGRESS"&&(
                        <>
                          <div className="op-alert op-alert-inprogress">🔧 Đang tiến hành sản xuất...</div>
                          <button className="op-btn op-btn-done" disabled={acting}
                            onClick={()=>updateStatus(selected.orderId,"COMPLETED")}>
                            ✅ Hoàn thành — Chuyển giao hàng
                          </button>
                        </>
                      )}
                      {selected.manufacturingStatus==="COMPLETED"&&(
                        <div className="op-alert op-alert-done" style={{justifyContent:"center",flexDirection:"column",gap:4}}>
                          <span style={{fontSize:24}}>✅</span>
                          <div>Sản xuất hoàn thành!</div>
                          <div style={{fontSize:12,fontWeight:400,color:"#86efac"}}>Đơn hàng đang được chuyển sang giao hàng.</div>
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