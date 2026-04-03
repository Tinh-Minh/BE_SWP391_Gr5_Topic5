import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/authService";
import { useToast } from "../components/Toast";
import api from "../services/api";
import "../styles/Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user] = useState(() => getUser());
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderDone, setOrderDone] = useState(null);
  const [form, setForm] = useState({
    shippingAddress: user?.address || "",
    paymentMethod: "COD",
    discountCode: "",
  });

  const [fakePaying, setFakePaying] = useState(false);
  const [fakePaid, setFakePaid] = useState(false);
  const [fakeTxnId, setFakeTxnId] = useState("");
  const [fakeForm, setFakeForm] = useState({ accountNumber: "", accountName: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api
      .get("/cart")
      .then((response) => setCart(response.data))
      .catch((error) => {
        console.error(error);
        toast({ message: "Unable to load checkout details right now.", type: "error" });
      })
      .finally(() => setLoading(false));
  }, [navigate, toast, user]);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const handleSubmit = async () => {
    if (!form.shippingAddress.trim()) {
      toast({ message: "Please enter your shipping address.", type: "error" });
      return;
    }

    if (items.length === 0) {
      toast({ message: "Your cart is empty.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const orderRes = await api.post("/orders/place", {
        shippingAddress: form.shippingAddress,
        paymentMethod: form.paymentMethod,
        ...(form.discountCode ? { discountCode: form.discountCode } : {}),
      });

      const order = orderRes.data;
      let payment = null;

      if (form.paymentMethod === "BANKING") {
        const paymentRes = await api.get(`/payment/order/${order.orderId}`);
        payment = paymentRes.data;
      }

      setOrderDone({ order, payment });
      toast({ message: "Order placed successfully.", type: "success" });
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to place your order right now.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFakeTransfer = async () => {
    if (!fakeForm.accountNumber.trim() || !fakeForm.accountName.trim()) {
      toast({ message: "Please complete your banking information.", type: "error" });
      return;
    }

    setFakePaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      await api.post(`/payment/confirm/${orderDone.order.orderId}`);
      setFakeTxnId("TXN" + Date.now().toString().slice(-8).toUpperCase());
      setFakePaid(true);
      toast({ message: "Payment confirmed successfully.", type: "success" });
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to confirm this payment right now.",
        type: "error",
      });
    } finally {
      setFakePaying(false);
    }
  };

  const renderHeader = (showSecureTag = false) => (
    <header className="checkout-header">
      <div className="checkout-header-inner">
        <div className="checkout-header-brand">
          <button className="checkout-logo" onClick={() => navigate("/")}>
            👓 GlassesShop
          </button>
          <span className="checkout-header-divider" />
          <strong className="checkout-header-title">Checkout</strong>
        </div>
        <div className="checkout-header-actions">
          {showSecureTag && <span className="checkout-header-note">Secure checkout</span>}
          <button className="checkout-back-btn" onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </div>
      </div>
    </header>
  );

  if (orderDone && form.paymentMethod === "COD") {
    return (
      <div className="checkout-page">
        {renderHeader()}
        <main className="checkout-main checkout-main--centered">
          <div className="checkout-shell">
            <section className="checkout-success-card">
              <div className="checkout-success-icon">✓</div>
              <h1>Order placed successfully</h1>
              <p className="checkout-success-copy">
                Your order has been created successfully.
              </p>
              <div className="checkout-success-meta">
                <span>Order ID</span>
                <strong>#{orderDone.order.orderId}</strong>
              </div>
              <div className="checkout-cod-box">
                <strong>Cash on Delivery</strong>
                <p>Please prepare the exact amount when your order arrives.</p>
                <span>{formatVND(orderDone.order.finalAmount)}</span>
              </div>
              <button className="checkout-primary-btn" onClick={() => navigate("/orders")}>
                View My Orders
              </button>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (orderDone && form.paymentMethod === "BANKING") {
    return (
      <div className="checkout-page">
        {renderHeader(true)}
        <main className="checkout-main checkout-main--centered">
          <div className="checkout-shell">
            {!fakePaid ? (
              <section className="checkout-bank-card">
                <div className="checkout-bank-header">
                  <div>
                    <span className="checkout-bank-kicker">Demo payment</span>
                    <h1>Internet Banking</h1>
                    <p>Review the transfer details below and confirm the payment.</p>
                  </div>
                  <span className="checkout-bank-badge">Demo</span>
                </div>

                <div className="checkout-bank-box">
                  <h2>Receiver Information</h2>
                  <div className="checkout-bank-row">
                    <span>Bank</span>
                    <strong>VCB - Vietcombank</strong>
                  </div>
                  <div className="checkout-bank-row">
                    <span>Account Number</span>
                    <strong>9999 9999 9999</strong>
                  </div>
                  <div className="checkout-bank-row">
                    <span>Account Name</span>
                    <strong>GLASSES SHOP CO., LTD</strong>
                  </div>
                  <div className="checkout-bank-row">
                    <span>Amount</span>
                    <strong className="checkout-bank-amount">
                      {formatVND(orderDone.payment?.paidAmount || 0)}
                    </strong>
                  </div>
                  <div className="checkout-bank-row">
                    <span>Transfer Note</span>
                    <strong>Payment for order #{orderDone.order.orderId}</strong>
                  </div>
                </div>

                <div className="checkout-bank-form">
                  <h2>Your Banking Information</h2>
                  <div className="checkout-field">
                    <label htmlFor="bank-account-number">Source Account Number *</label>
                    <input
                      id="bank-account-number"
                      placeholder="Example: 1234 5678 9012"
                      value={fakeForm.accountNumber}
                      disabled={fakePaying}
                      onChange={(event) =>
                        setFakeForm({
                          ...fakeForm,
                          accountNumber: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="bank-account-name">Account Holder Name *</label>
                    <input
                      id="bank-account-name"
                      placeholder="Example: NGUYEN VAN A"
                      value={fakeForm.accountName}
                      disabled={fakePaying}
                      onChange={(event) =>
                        setFakeForm({
                          ...fakeForm,
                          accountName: event.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                </div>

                <button className="checkout-primary-btn checkout-primary-btn--full" onClick={handleFakeTransfer} disabled={fakePaying}>
                  {fakePaying
                    ? "Processing payment..."
                    : `Transfer ${formatVND(orderDone.payment?.paidAmount || 0)}`}
                </button>

                {fakePaying && (
                  <div className="checkout-loading-state">
                    <div className="checkout-loading-bar">
                      <div className="checkout-loading-fill" />
                    </div>
                    <p>Connecting to the bank...</p>
                  </div>
                )}

                <button className="checkout-secondary-btn checkout-secondary-btn--full" onClick={() => navigate("/orders")}>
                  Cancel Transaction
                </button>
              </section>
            ) : (
              <section className="checkout-success-card">
                <div className="checkout-success-icon">✓</div>
                <h1>Payment successful</h1>
                <p className="checkout-success-copy">
                  Your banking transfer has been confirmed successfully.
                </p>
                <div className="checkout-transaction-box">
                  <div className="checkout-transaction-row">
                    <span>Order ID</span>
                    <strong>#{orderDone.order.orderId}</strong>
                  </div>
                  <div className="checkout-transaction-row">
                    <span>Transaction ID</span>
                    <strong>{fakeTxnId}</strong>
                  </div>
                  <div className="checkout-transaction-row">
                    <span>Amount</span>
                    <strong>{formatVND(orderDone.payment?.paidAmount || 0)}</strong>
                  </div>
                  <div className="checkout-transaction-row">
                    <span>Source Account</span>
                    <strong>{fakeForm.accountNumber}</strong>
                  </div>
                  <div className="checkout-transaction-row">
                    <span>Account Holder</span>
                    <strong>{fakeForm.accountName}</strong>
                  </div>
                  <div className="checkout-transaction-row">
                    <span>Status</span>
                    <strong className="checkout-transaction-success">Successful</strong>
                  </div>
                </div>
                <button className="checkout-primary-btn" onClick={() => navigate("/orders")}>
                  View My Orders
                </button>
              </section>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {renderHeader()}

      <main className="checkout-main">
        <div className="checkout-shell">
          <div className="checkout-page-head">
            <h1>Checkout</h1>
          </div>

          {loading ? (
            <div className="checkout-empty">Loading checkout details...</div>
          ) : (
            <div className="checkout-layout">
              <div className="checkout-content">
                <section className="checkout-card">
                  <div className="checkout-card-head">
                    <h2>Shipping Address</h2>
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="shipping-address">Delivery Address</label>
                    <input
                      id="shipping-address"
                      placeholder="Street, district, city..."
                      value={form.shippingAddress}
                      onChange={(event) => setForm({ ...form, shippingAddress: event.target.value })}
                    />
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-head">
                    <h2>Payment Method</h2>
                  </div>
                  <div className="checkout-method-list">
                    {[
                      {
                        value: "COD",
                        icon: "💵",
                        label: "Cash on Delivery",
                        sub: "Pay only when your order arrives.",
                      },
                      {
                        value: "BANKING",
                        icon: "🏦",
                        label: "Bank Transfer",
                        sub: "Use the demo Internet Banking flow.",
                      },
                    ].map((method) => (
                      <button
                        key={method.value}
                        className={
                          "checkout-method-card" +
                          (form.paymentMethod === method.value ? " checkout-method-card--active" : "")
                        }
                        onClick={() => setForm({ ...form, paymentMethod: method.value })}
                      >
                        <span className="checkout-method-icon">{method.icon}</span>
                        <span className="checkout-method-copy">
                          <strong>{method.label}</strong>
                          <em>{method.sub}</em>
                        </span>
                        <span className="checkout-method-indicator" />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="checkout-card">
                  <div className="checkout-card-head">
                    <h2>Discount Code</h2>
                  </div>
                  <div className="checkout-discount-row">
                    <input
                      placeholder="Enter discount code"
                      value={form.discountCode}
                      onChange={(event) => setForm({ ...form, discountCode: event.target.value })}
                    />
                    <button className="checkout-secondary-btn" type="button">
                      Apply
                    </button>
                  </div>
                </section>
              </div>

              <aside className="checkout-summary">
                <div className="checkout-summary-head">
                  <h2>Order Summary</h2>
                  <span>{items.length} items</span>
                </div>

                <div className="checkout-summary-items">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="checkout-summary-item">
                      <div>
                        <strong>{item.productName || "Product"}</strong>
                        <span>
                          {item.productType} x{item.quantity}
                        </span>
                      </div>
                      <em>{formatVND((item.price || 0) * (item.quantity || 1))}</em>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <strong>{formatVND(subtotal)}</strong>
                </div>
                <div className="checkout-summary-row">
                  <span>Shipping</span>
                  <strong className="checkout-summary-free">Free</strong>
                </div>
                <div className="checkout-summary-row checkout-summary-row--total">
                  <span>Total</span>
                  <strong>{formatVND(subtotal)}</strong>
                </div>

                <button className="checkout-primary-btn checkout-primary-btn--full" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Processing..." : "Place Order"}
                </button>

                <p className="checkout-summary-note">Your checkout information is secured.</p>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
