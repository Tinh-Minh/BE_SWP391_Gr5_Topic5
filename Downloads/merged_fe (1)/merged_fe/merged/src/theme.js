export const T = {
  navy:     "#0f1f3d",
  navyMid:  "#1a2f52",
  gold:     "#c9a84c",
  goldLight:"#e8c97a",
  cream:    "#f8f4ee",
  creamDark:"#ede8df",
  white:    "#ffffff",
  gray:     "#6b7280",
  grayLight:"#d1d5db",
  text:     "#1a1a2e",
  textLight:"#4a4a6a",
  red:      "#dc2626",
  green:    "#16a34a",
};

export const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');`;

export const baseCSS = `
  ${fonts}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Jost', sans-serif; background: #f8f4ee; color: #1a1a2e; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #f8f4ee; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
`;

export const fmt = n => new Intl.NumberFormat("vi-VN", { style:"currency", currency:"VND" }).format(n||0);
export const fmtDate = d => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

// Shared nav component CSS
export const navCSS = `
  .lux-nav { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(15,31,61,0.97); backdrop-filter:blur(12px); border-bottom:1px solid rgba(201,168,76,0.2); height:68px; }
  .lux-nav-inner { max-width:1280px; margin:0 auto; padding:0 32px; height:100%; display:flex; align-items:center; gap:24px; }
  .nav-link-sm { background:none; border:none; color:rgba(255,255,255,0.65); font-size:12px; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; font-weight:400; transition:color 0.2s; padding:0; }
  .nav-link-sm:hover { color:#c9a84c; }
  .gold-btn { background:#c9a84c; color:#0f1f3d; border:none; padding:9px 22px; font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:all 0.2s; }
  .gold-btn:hover { background:#e8c97a; }
  .outline-btn { background:transparent; color:#0f1f3d; border:1.5px solid #0f1f3d; padding:9px 22px; font-size:11px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:all 0.2s; }
  .outline-btn:hover { background:#0f1f3d; color:white; }
  .danger-btn { background:transparent; color:#dc2626; border:1.5px solid #dc2626; padding:7px 18px; font-size:11px; font-weight:500; letter-spacing:1px; text-transform:uppercase; cursor:pointer; font-family:'Jost',sans-serif; transition:all 0.2s; }
  .danger-btn:hover { background:#dc2626; color:white; }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
`;