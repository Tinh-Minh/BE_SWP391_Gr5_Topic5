export const STATUS_MAP = {
  PENDING: { label: "Pending Confirmation", color: "#d97706", bg: "#fef3c7", step: 0 },
  CONFIRMED: { label: "Confirmed", color: "#2563eb", bg: "#dbeafe", step: 1 },
  MANUFACTURING: { label: "In Production", color: "#7c3aed", bg: "#ede9fe", step: 2 },
  SHIPPING: { label: "Shipping", color: "#0891b2", bg: "#cffafe", step: 3 },
  DELIVERED: { label: "Delivered", color: "#16a34a", bg: "#dcfce7", step: 4 },
  CANCELLED: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2", step: -1 },
  RETURN_PENDING: { label: "Return Pending", color: "#db2777", bg: "#fce7f3", step: -1 },
};

export const STEPS = ["Pending Confirmation", "Confirmed", "In Production", "Shipping", "Delivered"];

export const TYPE_LABELS = {
  READY_MADE: "Ready-made Glasses",
  CONTACT_LENS: "Contact Lenses",
  MY_GLASSES: "Custom Glasses",
  FRAME: "Frames",
  LENS: "Lenses",
};

export const TYPE_ICONS = {
  READY_MADE: "⌁",
  CONTACT_LENS: "◌",
  MY_GLASSES: "✦",
  FRAME: "▢",
  LENS: "◍",
};

export const ROUTE_MAP = {
  READY_MADE: "ready-made",
  CONTACT_LENS: "contact",
  FRAME: "frame",
  LENS: "lens",
};

export function getDetailEndpoint(type, id) {
  switch (type) {
    case "READY_MADE":
      return `/admin/rmglasses/public/${id}`;
    case "CONTACT_LENS":
      return `/admin/contactlens/public/${id}`;
    case "FRAME":
      return `/admin/frames/public/${id}`;
    case "LENS":
      return `/admin/lens/public/${id}`;
    default:
      return null;
  }
}

export function parseOrderItemSnapshot(rawValue) {
  if (typeof rawValue !== "string") return null;
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function formatEyeSummary(prefix, eye) {
  if (!eye || typeof eye !== "object") return "";
  const parts = [];
  if (eye.sph != null && eye.sph !== "") parts.push(`SPH ${eye.sph}`);
  if (eye.cyl != null && eye.cyl !== "") parts.push(`CYL ${eye.cyl}`);
  if (eye.axis != null && eye.axis !== "") parts.push(`Axis ${eye.axis}`);
  return parts.length > 0 ? `${prefix}: ${parts.join(" • ")}` : "";
}

export function getOrderItemDisplay(item, detail) {
  const snapshot = parseOrderItemSnapshot(item?.productName);
  const name =
    snapshot?.name
    || (typeof item?.productName === "string" && !item.productName.trim().startsWith("{") ? item.productName : "")
    || detail?.name
    || "Product";

  const summaryParts = [];

  if (snapshot?.fixedSph != null) summaryParts.push(`SPH ${snapshot.fixedSph}`);
  if (snapshot?.fixedCyl != null) summaryParts.push(`CYL ${snapshot.fixedCyl}`);
  if (snapshot?.sph != null) summaryParts.push(`SPH ${snapshot.sph}`);
  if (snapshot?.cyl != null) summaryParts.push(`CYL ${snapshot.cyl}`);
  if (snapshot?.axis != null) summaryParts.push(`Axis ${snapshot.axis}`);
  if (snapshot?.pd != null) summaryParts.push(`PD ${snapshot.pd}`);
  if (snapshot?.add != null) summaryParts.push(`ADD ${snapshot.add}`);

  const rightEyeSummary = formatEyeSummary("R", snapshot?.rightEye);
  const leftEyeSummary = formatEyeSummary("L", snapshot?.leftEye);
  if (rightEyeSummary) summaryParts.push(rightEyeSummary);
  if (leftEyeSummary) summaryParts.push(leftEyeSummary);

  if (summaryParts.length === 0 && detail) {
    if (detail.fixedSph != null) summaryParts.push(`SPH ${detail.fixedSph}`);
    if (detail.fixedCyl != null) summaryParts.push(`CYL ${detail.fixedCyl}`);
    if (detail.minSph != null && detail.maxSph != null) summaryParts.push(`SPH ${detail.minSph} to ${detail.maxSph}`);
  }

  return {
    name,
    imageUrl: detail?.imageUrl || null,
    summary: summaryParts.join(" • "),
  };
}
