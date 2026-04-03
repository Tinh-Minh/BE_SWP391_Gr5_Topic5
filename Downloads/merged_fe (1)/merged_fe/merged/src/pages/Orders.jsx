import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { useToast } from "../components/Toast";
import { getUser } from "../services/authService";
import api from "../services/api";
import {
  STATUS_MAP,
  TYPE_ICONS,
  getDetailEndpoint,
  getOrderItemDisplay,
} from "../utils/orderDisplay";
import "../styles/Orders.css";

function OrderThumb({ imageUrl, fallback }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return <img src={imageUrl} alt="" onError={() => setImgError(true)} />;
  }

  return <div className="orders-preview-fallback">{fallback}</div>;
}

export default function Orders() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [previewDetails, setPreviewDetails] = useState({});

  const [showPayModal, setShowPayModal] = useState(false);
  const [payOrder, setPayOrder] = useState(null);
  const [payInfo, setPayInfo] = useState(null);
  const [fakePaying, setFakePaying] = useState(false);
  const [fakePaid, setFakePaid] = useState(false);
  const [fakeTxnId, setFakeTxnId] = useState("");
  const [fakeForm, setFakeForm] = useState({ accountNumber: "", accountName: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [navigate, user]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const fetchPreviewDetails = async (ordersData) => {
    const detailMap = {};
    const uniqueItems = new Map();

    ordersData.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = `${item.productType}_${item.productId}`;
        if (!uniqueItems.has(key)) uniqueItems.set(key, item);
      });
    });

    await Promise.all(
      Array.from(uniqueItems.values()).map(async (item) => {
        try {
          const endpoint = getDetailEndpoint(item.productType, item.productId);
          if (!endpoint) return;
          const response = await api.get(endpoint);
          detailMap[`${item.productType}_${item.productId}`] = response.data;
        } catch {
          // Keep order list usable even if preview detail fails.
        }
      })
    );

    setPreviewDetails(detailMap);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders/my-orders");
      const data = Array.isArray(response.data) ? response.data : [];
      const sorted = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(sorted);
      fetchPreviewDetails(sorted);
    } catch (error) {
      console.error(error);
      toast({
        message: error.response?.data?.message || "Unable to load your orders right now.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    const order = orders.find((item) => item.orderId === orderId);
    const isPaid = order?.paymentStatus === "PAID";
    const isBanking = order?.paymentMethod === "BANKING";

    let confirmMessage = `Are you sure you want to cancel order #${orderId}?\n\n`;
    if (isPaid && isBanking) {
      confirmMessage += "This order has already been paid by bank transfer.\n";
      confirmMessage += "Your refund will be returned to the original account within 3-5 business days.";
    } else if (!isPaid && isBanking) {
      confirmMessage += "This banking order has not been paid yet.\nNo refund is needed if you cancel now.";
    } else {
      confirmMessage += "This cash-on-delivery order will be cancelled.";
    }

    if (!window.confirm(confirmMessage)) return;

    setCancellingId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((item) =>
          item.orderId === orderId
            ? { ...item, status: "CANCELLED", paymentStatus: isPaid ? "REFUNDED" : "CANCELLED" }
            : item
        )
      );

      toast({
        message: isPaid && isBanking
          ? `Order #${orderId} was cancelled. Refund processing has started.`
          : `Order #${orderId} was cancelled successfully.`,
        type: "success",
        duration: 4500,
      });
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to cancel this order.",
        type: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleOpenPay = async (order, event) => {
    event.stopPropagation();
    setPayOrder(order);
    setFakePaid(false);
    setFakeForm({ accountNumber: "", accountName: "" });
    setFakeTxnId("");
    try {
      const response = await api.get(`/payment/order/${order.orderId}`);
      setPayInfo(response.data);
    } catch {
      setPayInfo({ paidAmount: order.finalAmount });
    }
    setShowPayModal(true);
  };

  const handleFakeTransfer = async () => {
    if (!fakeForm.accountNumber.trim() || !fakeForm.accountName.trim()) {
      toast({ message: "Please complete your banking information.", type: "warning" });
      return;
    }

    setFakePaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await api.post(`/payment/confirm/${payOrder.orderId}`);
      setFakeTxnId(`TXN${Date.now().toString().slice(-8).toUpperCase()}`);
      setFakePaid(true);

      setOrders((prev) =>
        prev.map((item) =>
          item.orderId === payOrder.orderId ? { ...item, paymentStatus: "PAID" } : item
        )
      );
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to confirm payment right now.",
        type: "error",
      });
    } finally {
      setFakePaying(false);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const formatDate = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "");

  const needsPay = (order) =>
    order.paymentMethod === "BANKING" && order.paymentStatus === "PENDING" && order.status !== "CANCELLED";

  return (
    <div className="orders-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="orders-main">
        <div className="electro-shell">
          <div className="orders-head">
            <div>
              <h1>My Orders</h1>
            </div>
          </div>

          {loading ? (
            <div className="orders-empty">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="orders-empty orders-empty--center">
              <div className="orders-empty-icon">⌁</div>
              <h2>You do not have any orders yet</h2>
              <button className="orders-primary-btn" onClick={() => navigate("/")}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list orders-list--single">
              {orders.map((order) => {
                const status = STATUS_MAP[order.status] || { label: order.status, color: "#666", bg: "#f3f4f6" };
                const unpaid = needsPay(order);

                return (
                  <article
                    key={order.orderId}
                    className="orders-card"
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                  >
                    <div className="orders-card-top">
                      <div>
                        <strong>Order #{order.orderId}</strong>
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                      <em style={{ background: status.bg, color: status.color }}>{status.label}</em>
                    </div>

                    <div className="orders-card-preview orders-card-preview--stack">
                      {(order.items || []).slice(0, 2).map((item, index) => {
                        const detail = previewDetails[`${item.productType}_${item.productId}`];
                        const display = getOrderItemDisplay(item, detail);

                        return (
                          <div key={`${item.productId}_${index}`} className="orders-preview-item">
                            <div className="orders-preview-media">
                              <OrderThumb imageUrl={display.imageUrl} fallback={TYPE_ICONS[item.productType] || "⌁"} />
                            </div>

                            <div className="orders-preview-copy">
                              <strong>{display.name}</strong>
                              <span>{display.summary || "Tap to view order details"}</span>
                            </div>
                          </div>
                        );
                      })}

                      {(order.items || []).length > 2 && (
                        <div className="orders-preview-more">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="orders-card-bottom">
                      <strong>{formatPrice(order.finalAmount)}</strong>
                      <span className={order.paymentStatus === "PAID" ? "paid" : "pending"}>
                        {order.paymentStatus === "PAID" ? "Paid" : "Pending Payment"}
                      </span>
                    </div>

                    {unpaid && (
                      <div className="orders-alert">
                        <span>Payment is still pending for this banking order.</span>
                        <button className="orders-pay-btn" onClick={(event) => handleOpenPay(order, event)}>
                          Pay Now
                        </button>
                      </div>
                    )}

                    {order.status === "PENDING" && (
                      <button
                        className="orders-cancel-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleCancel(order.orderId);
                        }}
                        disabled={cancellingId === order.orderId}
                      >
                        {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showPayModal && (
        <div className="orders-modal-overlay" onClick={(event) => event.target === event.currentTarget && !fakePaying && setShowPayModal(false)}>
          <div className="orders-modal">
            {!fakePaid ? (
              <>
                <div className="orders-modal-head">
                  <div>
                    <strong>GlassesBank Internet Banking</strong>
                    <span>Secure online payment gateway</span>
                  </div>
                  <em>DEMO</em>
                </div>

                <div className="orders-transfer-box">
                  {[
                    ["Bank", "VCB - Vietcombank"],
                    ["Account Number", "9999 9999 9999"],
                    ["Account Name", "GLASSES SHOP CO., LTD"],
                    ["Amount", formatPrice(payInfo?.paidAmount || payOrder?.finalAmount || 0)],
                    ["Transfer Note", `Payment for order #${payOrder?.orderId}`],
                  ].map(([label, value]) => (
                    <div key={label} className="orders-transfer-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="orders-bank-form">
                  <label>
                    <span>Source Account Number</span>
                    <input
                      value={fakeForm.accountNumber}
                      disabled={fakePaying}
                      onChange={(event) => setFakeForm({ ...fakeForm, accountNumber: event.target.value })}
                    />
                  </label>

                  <label>
                    <span>Account Holder Name</span>
                    <input
                      value={fakeForm.accountName}
                      disabled={fakePaying}
                      onChange={(event) => setFakeForm({ ...fakeForm, accountName: event.target.value.toUpperCase() })}
                    />
                  </label>
                </div>

                <button className="orders-pay-big-btn" onClick={handleFakeTransfer} disabled={fakePaying}>
                  {fakePaying ? "Processing Payment..." : `Confirm Payment ${formatPrice(payInfo?.paidAmount || payOrder?.finalAmount || 0)}`}
                </button>

                {fakePaying && (
                  <div className="orders-progress">
                    <div className="orders-progress-bar" />
                    <p>Connecting to bank gateway...</p>
                  </div>
                )}

                {!fakePaying && (
                  <button className="orders-modal-close-btn" onClick={() => setShowPayModal(false)}>
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <div className="orders-modal-success">
                <div className="orders-modal-success-icon">✓</div>
                <h2>Payment Successful</h2>

                <div className="orders-transfer-box">
                  {[
                    ["Order", `#${payOrder?.orderId}`],
                    ["Transaction ID", fakeTxnId],
                    ["Amount", formatPrice(payInfo?.paidAmount || payOrder?.finalAmount || 0)],
                    ["Account", fakeForm.accountNumber],
                    ["Account Holder", fakeForm.accountName],
                    ["Status", "Success"],
                  ].map(([label, value]) => (
                    <div key={label} className="orders-transfer-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <button
                  className="orders-primary-btn"
                  onClick={() => {
                    setShowPayModal(false);
                    fetchOrders();
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}