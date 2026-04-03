import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { useToast } from "../components/Toast";
import { getUser } from "../services/authService";
import api from "../services/api";
import {
  ROUTE_MAP,
  STATUS_MAP,
  STEPS,
  TYPE_ICONS,
  TYPE_LABELS,
  getDetailEndpoint,
  getOrderItemDisplay,
} from "../utils/orderDisplay";
import "../styles/OrderDetail.css";

function OrderThumb({ imageUrl, fallback }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return <img src={imageUrl} alt="" onError={() => setImgError(true)} />;
  }

  return <div className="order-detail-thumb-fallback">{fallback}</div>;
}

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const toast = useToast();
  const [user] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({});
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [navigate, user, orderId]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders/my-orders");
      const data = Array.isArray(response.data) ? response.data : [];
      const found = data.find((item) => String(item.orderId) === String(orderId));

      if (!found) {
        navigate("/orders");
        return;
      }

      setOrder(found);
      fetchItemDetails(found);
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to load this order right now.",
        type: "error",
      });
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async (targetOrder) => {
    const details = {};
    await Promise.all(
      (targetOrder.items || []).map(async (item) => {
        try {
          const endpoint = getDetailEndpoint(item.productType, item.productId);
          if (!endpoint) return;
          const response = await api.get(endpoint);
          details[`${item.productId}_${item.productType}`] = response.data;
        } catch {
          // Continue rendering even if one preview fails.
        }
      })
    );
    setItemDetails(details);
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!window.confirm(`Are you sure you want to cancel order #${order.orderId}?`)) return;

    setCancelling(true);
    try {
      await api.put(`/orders/${order.orderId}/cancel`);
      toast({ message: `Order #${order.orderId} was cancelled successfully.`, type: "success" });
      fetchOrder();
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to cancel this order.",
        type: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const formatDate = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "");

  const detailRowsForItem = (item) => {
    const detail = itemDetails[`${item.productId}_${item.productType}`];
    if (!detail) return [];

    switch (item.productType) {
      case "READY_MADE":
        return [
          ["Brand", detail.brand],
          ["SPH", detail.fixedSph],
          ["CYL", detail.fixedCyl],
          ["Stock", detail.stock],
        ].filter(([, value]) => value != null);
      case "CONTACT_LENS":
        return [
          ["Lens Type", detail.contactType],
          ["Color", detail.color],
          ["SPH Range", detail.minSph != null && detail.maxSph != null ? `${detail.minSph} to ${detail.maxSph}` : null],
          ["Stock", detail.stock],
        ].filter(([, value]) => value != null);
      case "FRAME":
        return [
          ["Brand", detail.brand],
          ["Material", detail.material],
          ["Size", detail.size],
          ["Color", detail.color],
          ["Rim Type", detail.rimType],
        ].filter(([, value]) => value != null);
      case "LENS":
        return [
          ["Lens Type", detail.lensType],
          ["SPH Range", detail.minSph != null && detail.maxSph != null ? `${detail.minSph} to ${detail.maxSph}` : null],
          ["Photochromic", detail.colorChange ? "Yes" : "No"],
        ].filter(([, value]) => value != null);
      default:
        return [];
    }
  };

  const savedAmount = useMemo(() => {
    if (!order) return 0;
    if (order.discountAmount > 0) return order.discountAmount;
    const delta = order.totalAmount - order.finalAmount;
    return delta > 0 ? delta : 0;
  }, [order]);

  if (loading) {
    return (
      <div className="order-detail-page">
        <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />
        <main className="order-detail-main">
          <div className="electro-shell">
            <div className="order-detail-empty">Loading order details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!order) return null;

  const status = STATUS_MAP[order.status] || { label: order.status, color: "#666", bg: "#f3f4f6", step: -1 };

  return (
    <div className="order-detail-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="order-detail-main">
        <div className="electro-shell">
          <div className="order-detail-head">
            <div>
              <h1>Order #{order.orderId}</h1>
              <p>{formatDate(order.orderDate)}</p>
            </div>
            <div className="order-detail-head-actions">
              <button className="order-detail-secondary-btn" onClick={() => navigate("/orders")}>
                Back to Orders
              </button>
              {order.status === "PENDING" && (
                <button className="order-detail-danger-btn" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>

          <section className="order-detail-summary-card">
            <div className="order-detail-summary-grid">
              <div>
                <span>Status</span>
                <strong style={{ color: status.color }}>{status.label}</strong>
              </div>
              <div>
                <span>Payment</span>
                <strong>{order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus}</strong>
              </div>
              <div>
                <span>Shipping Address</span>
                <strong>{order.shippingAddress}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatPrice(order.finalAmount)}</strong>
              </div>
            </div>
          </section>

          {!["CANCELLED", "RETURN_PENDING"].includes(order.status) && (
            <section className="order-detail-section">
              <h2>Order Progress</h2>
              <div className="order-detail-steps">
                {STEPS.map((stepLabel, index) => {
                  const done = index <= status.step;
                  const current = index === status.step;
                  return (
                    <div key={stepLabel} className="order-detail-step">
                      <div className={`order-detail-step-dot ${done ? "done" : ""} ${current ? "current" : ""}`} />
                      <span className={done ? "done" : ""}>{stepLabel}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="order-detail-section">
            <h2>Products</h2>
            <div className="order-detail-item-list">
              {(order.items || []).map((item, index) => {
                const detail = itemDetails[`${item.productId}_${item.productType}`];
                const display = getOrderItemDisplay(item, detail);
                const detailRows = detailRowsForItem(item);

                return (
                  <article key={`${item.productId}_${index}`} className="order-detail-item-card">
                    <div className="order-detail-item-top">
                      <div className="order-detail-item-media">
                        <OrderThumb imageUrl={display.imageUrl} fallback={TYPE_ICONS[item.productType] || "⌁"} />
                      </div>

                      <div className="order-detail-item-copy">
                        <div className="order-detail-item-meta">
                          <span className="order-detail-item-badge">{TYPE_LABELS[item.productType] || item.productType}</span>
                          <span>Qty {item.quantity}</span>
                        </div>
                        <h3>{display.name}</h3>
                        {display.summary && <p>{display.summary}</p>}
                        <strong>{formatPrice((item.price || 0) * (item.quantity || 1))}</strong>
                      </div>

                      {ROUTE_MAP[item.productType] && (
                        <button
                          className="order-detail-secondary-btn"
                          onClick={() => navigate(`/product/${ROUTE_MAP[item.productType]}/${item.productId}`)}
                        >
                          View Product
                        </button>
                      )}
                    </div>

                    {detailRows.length > 0 && (
                      <div className="order-detail-item-specs">
                        {detailRows.map(([label, value]) => (
                          <div key={label} className="order-detail-item-spec">
                            <span>{label}</span>
                            <strong>{String(value)}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="order-detail-section">
            <h2>Payment Summary</h2>
            <div className="order-detail-info-grid">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
              <div>
                <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
                <strong>{savedAmount > 0 ? formatPrice(savedAmount) : "Not Applied"}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>Free</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatPrice(order.finalAmount)}</strong>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}