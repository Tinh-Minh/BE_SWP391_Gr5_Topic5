import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { useToast } from "../components/Toast";
import { getUser } from "../services/authService";
import api from "../services/api";
import "../styles/Cart.css";

const TYPE_LABELS = {
  READY_MADE: "Ready-made Glasses",
  CONTACT_LENS: "Contact Lenses",
  MY_GLASSES: "Custom Glasses",
  FRAME: "Frames",
  LENS: "Lenses",
};

const TYPE_ICONS = {
  READY_MADE: "⌁",
  CONTACT_LENS: "◌",
  MY_GLASSES: "✦",
  FRAME: "▢",
  LENS: "◍",
};

const ROUTE_MAP = {
  READY_MADE: "ready-made",
  CONTACT_LENS: "contact",
  FRAME: "frame",
  LENS: "lens",
};

export default function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user] = useState(() => getUser());

  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [navigate, user]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data);
      await fetchAllProductDetails(response.data?.items || []);
    } catch (error) {
      console.error(error);
      toast({
        message: error.response?.data?.message || "Unable to load your cart right now.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProductDetails = async (items) => {
    const details = {};
    await Promise.all(
      items.map(async (item) => {
        try {
          const endpoint = getDetailEndpoint(item.productType, item.productId);
          if (!endpoint) return;
          const response = await api.get(endpoint);
          details[item.cartItemId] = response.data;
        } catch (error) {
          // Keep cart usable even if a detail endpoint fails.
        }
      })
    );
    setProductDetails(details);
  };

  const getDetailEndpoint = (type, id) => {
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
  };

  const handleRemove = async (cartItemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;

    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      toast({ message: "Item removed from cart.", type: "success" });
      fetchCart();
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to remove this item.",
        type: "error",
      });
    }
  };

  const handleUpdateQty = async (cartItemId, qty) => {
    if (qty < 1) {
      handleRemove(cartItemId);
      return;
    }

    setUpdatingId(cartItemId);
    try {
      await api.put(`/cart/update/${cartItemId}`, { quantity: qty });
      fetchCart();
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Unable to update item quantity.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const getProductDetails = (item, detail) => {
    if (!detail) return [];

    switch (item.productType) {
      case "READY_MADE":
        return [
          ["Brand", detail.brand],
          ["SPH", detail.fixedSph],
          ["CYL", detail.fixedCyl],
          ["Stock", detail.stock],
          ["Status", detail.status === "ACTIVE" ? "In Stock" : "Unavailable"],
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

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="cart-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="cart-main">
        <div className="electro-shell">
          <div className="cart-head">
            <div>
              <h1>Your Cart</h1>
              <p>Review your eyewear selections, update quantities, and continue to checkout.</p>
            </div>
            <button className="cart-home-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>

          {loading ? (
            <div className="cart-empty">Loading your cart...</div>
          ) : items.length === 0 ? (
            <div className="cart-empty cart-empty--center">
              <div className="cart-empty-icon">⌁</div>
              <h2>Your cart is empty</h2>
              <p>Add a few products to get started.</p>
              <button className="cart-primary-btn" onClick={() => navigate("/")}>
                Browse Products
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <section className="cart-items">
                <div className="cart-list-head">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Subtotal</span>
                  <span />
                </div>

                {items.map((item) => {
                  const detail = productDetails[item.cartItemId];
                  const isExpanded = expandedId === item.cartItemId;
                  const detailRows = getProductDetails(item, detail);

                  return (
                    <article key={item.cartItemId} className="cart-item-card">
                      <div className="cart-item-row">
                        <div className="cart-item-main">
                          <div className="cart-item-icon">
                            {detail?.imageUrl
                              ? <img src={detail.imageUrl} alt={item.productName || "product"}
                                  style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:4 }}
                                  onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                                />
                              : null}
                            <span style={{ display: detail?.imageUrl ? "none" : "flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", fontSize:28 }}>
                              {TYPE_ICONS[item.productType] || "⌁"}
                            </span>
                          </div>

                          <div className="cart-item-copy">
                            <h3>{item.productName || "Product"}</h3>
                            <span className="cart-item-badge">{TYPE_LABELS[item.productType] || item.productType}</span>
                            <button
                              className="cart-link-btn"
                              onClick={() => setExpandedId(isExpanded ? null : item.cartItemId)}
                            >
                              {isExpanded ? "Hide details" : "View product details"}
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-price">{formatPrice(item.price)}</div>

                        <div className="cart-qty-control">
                          <button
                            onClick={() => handleUpdateQty(item.cartItemId, item.quantity - 1)}
                            disabled={updatingId === item.cartItemId}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(item.cartItemId, item.quantity + 1)}
                            disabled={updatingId === item.cartItemId}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-subtotal">{formatPrice((item.price || 0) * item.quantity)}</div>

                        <button className="cart-remove-btn" onClick={() => handleRemove(item.cartItemId)}>
                          ×
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="cart-expand-box">
                          <div className="cart-expand-head">
                            <h4>Product Information</h4>
                            {ROUTE_MAP[item.productType] && (
                              <button
                                className="cart-secondary-btn"
                                onClick={() => navigate(`/product/${ROUTE_MAP[item.productType]}/${item.productId}`)}
                              >
                                Open Product Page
                              </button>
                            )}
                          </div>

                          {detailRows.length > 0 ? (
                            <div className="cart-detail-grid">
                              {detailRows.map(([label, value]) => (
                                <div key={label} className="cart-detail-cell">
                                  <span>{label}</span>
                                  <strong>{String(value)}</strong>
                                </div>
                              ))}
                            </div>
                          ) : item.productType === "MY_GLASSES" ? (
                            <p className="cart-muted">This custom glasses item was created from your own design request.</p>
                          ) : (
                            <p className="cart-muted">Loading product information...</p>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>

              <aside className="cart-summary">
                <h2>Order Summary</h2>

                <div className="cart-summary-row">
                  <span>Items</span>
                  <strong>{items.length}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Total Quantity</span>
                  <strong>{totalQuantity}</strong>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <strong className="cart-summary-free">Free</strong>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-row cart-summary-row--total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <button className="cart-primary-btn" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                </button>
                <button className="cart-secondary-btn cart-secondary-btn--full" onClick={() => navigate("/")}>
                  Continue Shopping
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}