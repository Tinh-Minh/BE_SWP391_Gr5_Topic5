import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../services/authService";
import api from "../services/api";

const PAGE_CSS = `.design-page {
  min-height: 100vh;
  background: #f6f7fb;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #2b2d42;
}

/* NAV */
.design-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #15161d;
  border-bottom: 3px solid #d10024;
  height: 60px;
}
.design-nav-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
}
.design-nav-logo { font-size: 17px; font-weight: 800; color: white; cursor: pointer; flex-shrink: 0; }
.design-nav-title { font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500; }
.design-nav-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 4px;
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  cursor: pointer;
  padding: 6px 14px;
  margin-left: auto;
  transition: background 0.15s;
}
.design-nav-btn:hover { background: rgba(255,255,255,0.18); }

/* CONTAINER */
.design-container { max-width: 1180px; margin: 0 auto; padding: 24px 20px; }

/* STEPPER */
.design-stepper-wrap {
  background: white;
  border-radius: 8px;
  padding: 20px 28px;
  margin-bottom: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
}
.design-stepper { display: flex; align-items: flex-start; justify-content: center; }
.design-step { display: flex; align-items: center; }
.design-step-inner { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
.design-step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s;
  font-weight: 700;
}
.design-step-circle.done     { background: #16a34a; color: white; }
.design-step-circle.current  { background: #d10024; color: white; box-shadow: 0 4px 12px rgba(209,0,36,0.3); }
.design-step-circle.upcoming { background: white; color: #ccc; border: 2px solid #e5e7eb; font-size: 20px; }
.design-step-label { font-size: 11px; white-space: nowrap; font-weight: 500; }
.design-step-label.done    { color: #16a34a; font-weight: 600; }
.design-step-label.current { color: #d10024; font-weight: 700; }
.design-step-label.upcoming{ color: #bbb; }
.design-step-line { width: 60px; height: 2px; margin: 0 6px 22px; transition: background 0.3s; }
.design-step-line.done    { background: #16a34a; }
.design-step-line.upcoming{ background: #e5e7eb; }

/* BODY */
.design-body { display: grid; grid-template-columns: 1fr 260px; gap: 20px; align-items: start; }

/* MAIN PANEL */
.design-main {
  background: white;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
}
.design-panel-head { margin-bottom: 20px; }
.design-panel-title { font-size: 18px; font-weight: 700; color: #15161d; margin: 0 0 4px; }
.design-panel-sub { font-size: 13px; color: #888; margin: 0; }

/* SELECTION CARDS */
.design-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 10px;
}
.design-card {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.18s;
  position: relative;
  background: white;
}
.design-card:hover { border-color: #d10024; background: #fff8f8; }
.design-card.selected { border-color: #d10024; background: #fff8f8; box-shadow: 0 4px 12px rgba(209,0,36,0.12); }
.design-card-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #d10024;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 700;
}
.design-card-icon { font-size: 32px; margin-bottom: 8px; }
.design-card-title { font-weight: 600; font-size: 13px; color: #222; line-height: 1.4; margin-bottom: 4px; }
.design-card-sub { font-size: 11px; color: #999; margin-bottom: 2px; }
.design-card-price { font-size: 14px; font-weight: 700; color: #d10024; margin-top: 8px; }

/* NAVIGATION BUTTONS */
.design-nav-btns {
  display: flex;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
.design-btn-back {
  padding: 10px 22px;
  background: #f3f4f6;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}
.design-btn-back:hover { background: #e5e7eb; }
.design-btn-next {
  padding: 11px 28px;
  background: #d10024;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.15s;
}
.design-btn-next:hover:not(:disabled) { background: #b8001f; }
.design-btn-next:disabled { opacity: 0.45; cursor: not-allowed; }

/* EMPTY STATE */
.design-empty { text-align: center; padding: 48px 0; }
.design-empty-icon { font-size: 52px; margin-bottom: 12px; opacity: 0.5; }
.design-empty-text { color: #888; font-size: 14px; margin-bottom: 16px; }
.design-empty-btn {
  padding: 10px 22px;
  background: #d10024;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* SIDEBAR */
.design-sidebar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  position: sticky;
  top: 76px;
}
.design-sidebar-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: #15161d; }
.design-sidebar-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px; }
.design-sidebar-icon { font-size: 18px; flex-shrink: 0; }
.design-sidebar-key { font-size: 10px; color: #aaa; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 2px; }
.design-sidebar-val { font-size: 13px; font-weight: 600; }
.design-sidebar-val.empty { color: #ccc; }
.design-sidebar-total {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 4px;
  font-size: 14px;
}
.design-sidebar-total strong { color: #d10024; }
.design-sidebar-tip {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
}

/* CONFIRM TABLE */
.design-confirm-table { background: #fafafa; border-radius: 8px; overflow: hidden; border: 1px solid #f0f0f0; }
.design-confirm-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}
.design-confirm-row:last-child { border-bottom: none; }
.design-confirm-label { color: #888; }
.design-confirm-value { font-weight: 600; max-width: 55%; text-align: right; }
.design-confirm-value.empty { color: #ccc; font-weight: 400; }
.design-confirm-total {
  display: flex;
  justify-content: space-between;
  padding: 18px 20px;
  background: #fff5f5;
  font-size: 15px;
  font-weight: 700;
}
.design-confirm-total-price { font-size: 22px; font-weight: 800; color: #d10024; }

/* NAME INPUT */
.design-name-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
  font-family: inherit;
}
.design-name-input:focus { border-color: #d10024; }

/* OPTIONS CARD */
.design-option-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
  margin-bottom: 8px;
  background: white;
}
.design-option-card:hover { border-color: #d10024; background: #fff8f8; }
.design-option-card.selected { border-color: #d10024; background: #fff8f8; }
.design-option-info { display: flex; gap: 12px; align-items: center; }
.design-option-name { font-weight: 600; font-size: 14px; }
.design-option-sub { font-size: 12px; color: #888; margin-top: 2px; }
.design-option-price { font-weight: 700; color: #16a34a; font-size: 15px; }

/* SPINNER */
.design-spinner-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  background: #f6f7fb;
}
.design-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #d10024;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.design-spinner-text { font-size: 13px; color: #888; letter-spacing: 1px; }
@keyframes spin { to { transform: rotate(360deg); } }
`;


const STEPS = [
  { key:0, label:"Hồ sơ mắt", icon:"👁️" },
  { key:1, label:"Gọng kính", icon:"🕶️" },
  { key:2, label:"Tròng kính", icon:"🔍" },
  { key:3, label:"Tùy chọn",  icon:"⚙️" },
  { key:4, label:"Xác nhận",  icon:"✅" },
];

const fmt = n => new Intl.NumberFormat("vi-VN", { style:"currency", currency:"VND" }).format(n||0);

export default function DesignGlasses() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();

  const [step, setStep]             = useState(0);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eyeProfiles, setEyeProfiles] = useState([]);
  const [frames, setFrames]           = useState([]);
  const [lenses, setLenses]           = useState([]);
  const [lensOptions, setLensOptions] = useState([]);

  const [selected, setSelected] = useState({
    eyeProfileId: location.state?.eyeProfileId || null,
    frameId:      null,
    lensId:       null,
    selectedOptionIds: [],
    designName:   "",
  });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const epRes = await api.get("/api/eye-profiles/me");
      const raw = epRes.data;
      const profiles = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.content) ? raw.content : [];
      setEyeProfiles(profiles.filter(p => p.status === "ACTIVE"));

      const [frRes, lnRes] = await Promise.all([
        api.get("/admin/frames/public/all"),
        api.get("/admin/lens/public/all"),
      ]);
      setFrames(Array.isArray(frRes.data) ? frRes.data.filter(f => f.status==="ACTIVE") : []);
      setLenses(Array.isArray(lnRes.data) ? lnRes.data.filter(l => l.status==="ACTIVE") : []);

      try {
        const loRes = await api.get("/admin/lensoption/public/all");
        setLensOptions(Array.isArray(loRes.data) ? loRes.data : []);
      } catch { setLensOptions([]); }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const canNext = () => {
    if (step === 0) return !!selected.eyeProfileId;
    if (step === 1) return !!selected.frameId;
    if (step === 2) return !!selected.lensId;
    return true;
  };

  const toggleOption = id => setSelected(prev => ({
    ...prev,
    selectedOptionIds: prev.selectedOptionIds.includes(id)
      ? prev.selectedOptionIds.filter(x => x !== id)
      : [...prev.selectedOptionIds, id],
  }));

  const selectedFrame   = frames.find(f => f.frameId === selected.frameId);
  const selectedLens    = lenses.find(l => l.lensId  === selected.lensId);
  const selectedProfile = eyeProfiles.find(p => p.eyeProfileId === selected.eyeProfileId);
  const selectedOpts    = lensOptions.filter(o => selected.selectedOptionIds.includes(o.lensOptionId));
  const totalPrice      = (selectedFrame?.price||0) + (selectedLens?.basePrice||0)
    + selectedOpts.reduce((s,o) => s+(o.extraPrice||0), 0);

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const designRes = await api.post("/api/glasses-designs", {
        eyeProfileId:      selected.eyeProfileId,
        frameId:           selected.frameId,
        lensId:            selected.lensId,
        selectedOptionIds: selected.selectedOptionIds,
        designName:        selected.designName || "Thiết kế của tôi",
      });
      const design    = designRes.data?.data || designRes.data;
      const snapRes   = await api.post("/api/glasses-designs/"+design.designId+"/snapshot");
      const myGlasses = snapRes.data?.data || snapRes.data;
      await api.post("/cart/add", { productType:"MY_GLASSES", productId:myGlasses.myGlassesId, quantity:1 });
      alert("Đã thêm kính thiết kế vào giỏ hàng!");
      navigate("/cart");
    } catch(e) { alert("Lỗi: " + (e.response?.data?.message || e.message)); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="design-spinner-wrap">
      <div className="design-spinner" />
      <span className="design-spinner-text">Đang tải dữ liệu...</span>
    </div>
  );

  return (
    <div className="design-page">
      <style>{PAGE_CSS}</style>
      {/* NAV */}
      <nav className="design-nav">
        <div className="design-nav-inner">
          <div className="design-nav-logo" onClick={() => navigate("/")}>👓 GlassesShop</div>
          <span className="design-nav-title">Thiết Kế Kính Theo Yêu Cầu</span>
          <button className="design-nav-btn" onClick={() => navigate("/eye-profile")}>Hồ sơ mắt</button>
          <button className="design-nav-btn" onClick={() => navigate("/cart")}>Giỏ hàng</button>
        </div>
      </nav>

      <div className="design-container">
        {/* STEPPER */}
        <div className="design-stepper-wrap">
          <div className="design-stepper">
            {STEPS.map((s, i) => (
              <div key={s.key} className="design-step">
                <div className="design-step-inner" onClick={() => i < step && setStep(i)}>
                  <div className={`design-step-circle ${i < step ? "done" : i === step ? "current" : "upcoming"}`}>
                    {i < step ? "✓" : s.icon}
                  </div>
                  <span className={`design-step-label ${i < step ? "done" : i === step ? "current" : "upcoming"}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length-1 && (
                  <div className={`design-step-line ${i < step ? "done" : "upcoming"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="design-body">
          <div className="design-main">

            {/* STEP 0 — EYE PROFILE */}
            {step === 0 && (
              <Panel title="Chọn Hồ Sơ Mắt" sub="Chọn hồ sơ mắt phù hợp với đơn thuốc của bạn">
                {eyeProfiles.length === 0 ? (
                  <div className="design-empty">
                    <div className="design-empty-icon">👁️</div>
                    <p className="design-empty-text">Bạn chưa có hồ sơ mắt nào!</p>
                    <button className="design-empty-btn" onClick={() => navigate("/eye-profile")}>+ Tạo hồ sơ mắt</button>
                  </div>
                ) : (
                  <div className="design-grid">
                    {eyeProfiles.map(p => (
                      <div key={p.eyeProfileId}
                        className={`design-card ${selected.eyeProfileId===p.eyeProfileId?"selected":""}`}
                        onClick={() => setSelected(s => ({ ...s, eyeProfileId:p.eyeProfileId }))}>
                        {selected.eyeProfileId===p.eyeProfileId && <div className="design-card-check">✓</div>}
                        <div className="design-card-icon">👁️</div>
                        <div className="design-card-title">{p.profileName}</div>
                        <div className="design-card-sub">{p.source==="MANUAL"?"Nhập tay":"Upload"}</div>
                        {p.prescriptions?.length > 0 && (
                          <div style={{ marginTop:8, fontSize:11, background:"#f5f5f5", borderRadius:4, padding:"4px 8px", textAlign:"left" }}>
                            {p.prescriptions.map(rx => (
                              <div key={rx.prescriptionId} style={{ color:"#555" }}>
                                {rx.eyeSide==="RIGHT"?"P":"T"}: SPH {rx.sph??0} / CYL {rx.cyl??0}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {/* STEP 1 — FRAME */}
            {step === 1 && (
              <Panel title="Chọn Gọng Kính" sub="Chọn gọng kính phù hợp với phong cách của bạn">
                {frames.length === 0 ? (
                  <div className="design-empty"><div className="design-empty-icon">🕶️</div><p className="design-empty-text">Chưa có gọng kính nào trong hệ thống</p></div>
                ) : (
                  <div className="design-grid">
                    {frames.map(f => (
                      <div key={f.frameId} className={`design-card ${selected.frameId===f.frameId?"selected":""}`}
                        onClick={() => setSelected(s => ({ ...s, frameId:f.frameId }))}>
                        {selected.frameId===f.frameId && <div className="design-card-check">✓</div>}
                        {f.imageUrl
                          ? <img src={f.imageUrl} alt={f.name} style={{ width:64, height:64, objectFit:"cover", borderRadius:4, marginBottom:8 }} />
                          : <div className="design-card-icon">🕶️</div>
                        }
                        <div className="design-card-title">{f.name}</div>
                        <div className="design-card-sub">{f.brand}</div>
                        <div className="design-card-sub">{f.material} · Size {f.size}</div>
                        <div className="design-card-sub">{f.color}</div>
                        <div className="design-card-price">{fmt(f.price)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {/* STEP 2 — LENS */}
            {step === 2 && (
              <Panel title="Chọn Tròng Kính" sub="Chọn tròng kính phù hợp với độ mắt của bạn">
                {lenses.length === 0 ? (
                  <div className="design-empty"><div className="design-empty-icon">🔍</div><p className="design-empty-text">Chưa có tròng kính nào trong hệ thống</p></div>
                ) : (
                  <div className="design-grid">
                    {lenses.map(l => (
                      <div key={l.lensId} className={`design-card ${selected.lensId===l.lensId?"selected":""}`}
                        onClick={() => setSelected(s => ({ ...s, lensId:l.lensId }))}>
                        {selected.lensId===l.lensId && <div className="design-card-check">✓</div>}
                        {l.imageUrl
                          ? <img src={l.imageUrl} alt={l.name} style={{ width:64, height:64, objectFit:"cover", borderRadius:4, marginBottom:8 }} />
                          : <div className="design-card-icon">🔍</div>
                        }
                        <div className="design-card-title">{l.name}</div>
                        <div className="design-card-sub">{l.lensType}</div>
                        <div className="design-card-sub">SPH: {l.minSph} ~ {l.maxSph}</div>
                        {l.colorChange && <div className="design-card-sub" style={{ color:"#7c3aed" }}>✨ Đổi màu</div>}
                        <div className="design-card-price">{fmt(l.basePrice)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {/* STEP 3 — OPTIONS */}
            {step === 3 && (
              <Panel title="Tùy Chọn Thêm" sub="Chọn thêm các tính năng bổ sung (không bắt buộc)">
                {lensOptions.length === 0 ? (
                  <div className="design-empty">
                    <div className="design-empty-icon">⚙️</div>
                    <p className="design-empty-text">Không có tùy chọn thêm nào</p>
                    <p style={{ color:"#ccc", fontSize:12 }}>Bạn có thể tiếp tục mà không cần chọn</p>
                  </div>
                ) : (
                  lensOptions.map(o => {
                    const active = selected.selectedOptionIds.includes(o.lensOptionId);
                    return (
                      <div key={o.lensOptionId} className={`design-option-card ${active?"selected":""}`}
                        onClick={() => toggleOption(o.lensOptionId)}>
                        {active && <div className="design-card-check">✓</div>}
                        <div className="design-option-info">
                          <span style={{ fontSize:24 }}>⚙️</span>
                          <div>
                            <div className="design-option-name">{o.optionName || (o.indexValue+" Index")}</div>
                            <div className="design-option-sub">
                              {o.indexValue && <span>Chiết suất: {o.indexValue}</span>}
                              {o.coating && <span style={{ marginLeft:8 }}>Lớp phủ: {o.coating}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="design-option-price">+ {fmt(o.extraPrice)}</div>
                      </div>
                    );
                  })
                )}
                <div style={{ marginTop:20 }}>
                  <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#444", marginBottom:8 }}>Tên thiết kế (tùy chọn)</label>
                  <input className="design-name-input" placeholder="VD: Kính cận của tôi"
                    value={selected.designName}
                    onChange={e => setSelected(s => ({ ...s, designName:e.target.value }))} />
                </div>
              </Panel>
            )}

            {/* STEP 4 — CONFIRM */}
            {step === 4 && (
              <Panel title="Xác Nhận Thiết Kế" sub="Kiểm tra lại trước khi thêm vào giỏ hàng">
                <div className="design-confirm-table">
                  {[
                    ["Hồ sơ mắt",  selectedProfile?.profileName],
                    ["Gọng kính",  selectedFrame ? `${selectedFrame.name} (${selectedFrame.brand})` : null],
                    ["Tròng kính", selectedLens?.name],
                    ["Tùy chọn",   selectedOpts.length > 0 ? selectedOpts.map(o => o.optionName||o.coating||"Option").join(", ") : "Không có"],
                    ["Tên thiết kế", selected.designName || "Thiết kế của tôi"],
                  ].map(([l, v]) => (
                    <div key={l} className="design-confirm-row">
                      <span className="design-confirm-label">{l}</span>
                      <span className={`design-confirm-value ${!v?"empty":""}`}>{v || "Chưa chọn"}</span>
                    </div>
                  ))}
                  <div className="design-confirm-total">
                    <span>Tổng giá ước tính</span>
                    <span className="design-confirm-total-price">{fmt(totalPrice)}</span>
                  </div>
                </div>
              </Panel>
            )}

            {/* NAVIGATION */}
            <div className="design-nav-btns">
              {step > 0 && <button className="design-btn-back" onClick={() => setStep(step-1)}>← Quay lại</button>}
              <button className="design-btn-next" disabled={!canNext() || submitting}
                onClick={() => step < STEPS.length-1 ? setStep(step+1) : handleFinish()}>
                {submitting ? "Đang xử lý..." : step < STEPS.length-1 ? "Tiếp theo →" : "🛒 Thêm vào giỏ hàng"}
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="design-sidebar">
            <div className="design-sidebar-title">Thiết kế hiện tại</div>
            {[
              { icon:"👁️", key:"HỒ SƠ MẮT",  val:selectedProfile?.profileName },
              { icon:"🕶️", key:"GỌNG KÍNH",  val:selectedFrame?.name },
              { icon:"🔍", key:"TRÒNG KÍNH", val:selectedLens?.name },
              { icon:"⚙️", key:"TÙY CHỌN",   val:selectedOpts.length > 0 ? selectedOpts.length+" lựa chọn" : null },
            ].map(item => (
              <div key={item.key} className="design-sidebar-row">
                <span className="design-sidebar-icon">{item.icon}</span>
                <div>
                  <div className="design-sidebar-key">{item.key}</div>
                  <div className={`design-sidebar-val ${!item.val?"empty":""}`}>{item.val||"Chưa chọn"}</div>
                </div>
              </div>
            ))}
            {totalPrice > 0 && (
              <div className="design-sidebar-total">
                <span>Tạm tính</span>
                <strong>{fmt(totalPrice)}</strong>
              </div>
            )}
            <div className="design-sidebar-tip">
              💡 Kính thiết kế theo yêu cầu được làm thủ công chất lượng cao, thời gian sản xuất 3–5 ngày làm việc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <div>
      <div className="design-panel-head">
        <h2 className="design-panel-title">{title}</h2>
        <p className="design-panel-sub">{sub}</p>
      </div>
      {children}
    </div>
  );
}