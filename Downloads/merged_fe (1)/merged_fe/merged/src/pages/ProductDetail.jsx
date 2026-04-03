import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { getUser } from "../services/authService";
import { useToast } from "../components/Toast";
import api from "../services/api";
import "../styles/ProductDetail.css";

const TYPE_LABELS = {
  "ready-made": "Ready-made Glasses",
  frame: "Frames",
  lens: "Lenses",
  contact: "Contact Lenses",
};

function ProductThumb({ imageUrl, name }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return <img src={imageUrl} alt={name} onError={() => setImgError(true)} />;
  }

  return <div className="product-detail-thumb-fallback">⌁</div>;
}

export default function ProductDetail() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const user = getUser();
  const toast = useToast();

  const [keyword, setKeyword] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const ENDPOINTS = {
    "ready-made": `/admin/rmglasses/public/${id}`,
    frame: `/admin/frames/public/${id}`,
    lens: `/admin/lens/public/${id}`,
    contact: `/admin/contactlens/public/${id}`,
  };

  useEffect(() => {
    const ep = ENDPOINTS[type];
    if (!ep) {
      navigate("/");
      return;
    }

    api
      .get(ep)
      .then((response) => setProduct(response.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [type, id, navigate]);

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/catalog?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const getPrice = () => product?.price || product?.basePrice || 0;

  const canAddToCart = ["ready-made", "contact", "frame", "lens"].includes(type);

  const getProductType = () =>
    ({
      "ready-made": "READY_MADE",
      contact: "CONTACT_LENS",
      frame: "FRAME",
      lens: "LENS",
    })[type];

  const getProductId = () =>
    ({
      "ready-made": product?.readyGlassesId,
      frame: product?.frameId,
      lens: product?.lensId,
      contact: product?.contactLensId,
    })[type];

  const handleAddToCart = async (buyNow = false) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAdding(true);
    try {
      await api.post("/cart/add", {
        productType: getProductType(),
        productId: getProductId(),
        quantity: qty,
      });
      toast({ message: `"${product.name}" was added to cart.`, type: "success" });
      if (buyNow) navigate("/cart");
    } catch (error) {
      toast({ message: error.response?.data?.message || "Failed to add product to cart.", type: "error" });
    } finally {
      setAdding(false);
    }
  };

  const detailRows = useMemo(() => {
    if (!product) return [];

    const val   = (v) => (v != null && v !== "" ? String(v) : "-");
    const range = (min, max) => (min != null && max != null ? `${min} ~ ${max}` : "-");

    switch (type) {
      case "ready-made":
        // ReadyMadeGlasses: name, frameId, lensId, fixedSph, fixedCyl, price, stock, status
        return [
          ["Độ cận (SPH)",  val(product.fixedSph)],
          ["Độ loạn (CYL)", val(product.fixedCyl)],
          ["Tồn kho",       val(product.stock)],
          ["Trạng thái",    product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"],
        ];
      case "frame":
        // Frame: name, brand, material, size, rimType, frameType, color, price, stock, status
        return [
          ["Thương hiệu", val(product.brand)],
          ["Chất liệu",   val(product.material)],
          ["Kích thước",  val(product.size)],
          ["Kiểu viền",   val(product.rimType)],
          ["Kiểu gọng",   val(product.frameType)],
          ["Màu sắc",     val(product.color)],
          ["Tồn kho",     val(product.stock)],
          ["Trạng thái",  product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"],
        ];
      case "lens":
        // Lens: name, lensType, colorChange, minSph, maxSph, stock, status
        return [
          ["Loại tròng",    val(product.lensType)],
          ["Khoảng SPH",    range(product.minSph, product.maxSph)],
          ["Tròng đổi màu", product.colorChange ? "Có" : "Không"],
          ["Tồn kho",       val(product.stock)],
          ["Trạng thái",    product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"],
        ];
      case "contact":
        // ContactLens: name, brand, contactType, color, minSph, maxSph, minCyl, maxCyl, price, stock, status
        return [
          ["Thương hiệu", product.brand || "-"],
          ["Loại kính",   product.contactType || "-"],
          ["Màu sắc",     product.color || "-"],
          ["Khoảng SPH",  range(product.minSph, product.maxSph)],
          ["Khoảng CYL",  range(product.minCyl, product.maxCyl)],
          ["Tồn kho",     product.stock ?? "-"],
          ["Trạng thái",  product.status === "ACTIVE" ? "Còn hàng" : "Hết hàng"],
        ];
      default:
        return [];
    }
  }, [product, type]);

  const descriptionLines = useMemo(() => {
    if (!product) return [];

    const lines = [
      `${product.name} is part of the GlassesShop collection, designed for customers who want a smoother online eyewear buying experience.`,
    ];

    if (type === "ready-made") {
      lines.push("This ready-made model is ideal for quick purchase and can be added directly to your cart.");
    }
    if (type === "frame") {
      lines.push(`This frame features a ${product.material || "refined"} build with a ${product.rimType || "modern"} silhouette.`);
    }
    if (type === "lens") {
      lines.push(`This lens option supports prescription needs with ${product.lensType || "custom"} specifications.`);
    }
    if (type === "contact") {
      lines.push("This contact lens option is built for comfort, convenience, and daily wear.");
    }

    lines.push("Our team supports ready-made purchases, pre-orders, and prescription-based requests from consultation through fulfillment.");

    return lines;
  }, [product, type]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />
        <main className="product-detail-main">
          <div className="electro-shell">
            <div className="product-detail-empty">Loading product details...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="product-detail-main">
        <div className="electro-shell">
          <div className="product-detail-breadcrumb">
            <button onClick={() => navigate(`/catalog${type ? `?category=${type === "ready-made" ? "READY_MADE" : type.toUpperCase()}` : ""}`)}>
              {TYPE_LABELS[type]}
            </button>
            <span>/</span>
            <strong>{product?.name}</strong>
          </div>

          <section className="product-detail-card">
            <div className="product-detail-media-panel">
              <div className="product-detail-media">
                <ProductThumb imageUrl={product?.imageUrl} name={product?.name} />
              </div>
            </div>

            <div className="product-detail-info">
              <div className="product-detail-badges">
                <span>{TYPE_LABELS[type]}</span>
                <span className={product?.status === "ACTIVE" ? "in-stock" : "out-stock"}>
                  {product?.status === "ACTIVE" ? "In Stock" : "Unavailable"}
                </span>
              </div>

              <h1>{product?.name}</h1>

              <div className="product-detail-rating">
                <span>★★★★★</span>
                <small>Designed for online eyewear ordering and personalized prescription support.</small>
              </div>

              <div className="product-detail-price-box">
                <strong>{formatPrice(getPrice())}</strong>
                <span>{formatPrice(getPrice() * 1.2)}</span>
              </div>



              <div className="product-detail-specs">
                <h3>Technical Details</h3>
                <div className="product-detail-spec-grid">
                  {detailRows.map(([label, value]) => (
                    <div key={label} className="product-detail-spec-item">
                      <span>{label}</span>
                      <strong>{String(value)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {canAddToCart && (
                <div className="product-detail-buy-box">
                  <div className="product-detail-quantity-row">
                    <span>Quantity</span>
                    <div className="product-detail-quantity">
                      <button onClick={() => setQty((current) => Math.max(1, current - 1))}>-</button>
                      <input readOnly value={qty} />
                      <button onClick={() => setQty((current) => current + 1)}>+</button>
                    </div>
                    <small>{product?.stock || 0} items available</small>
                  </div>

                  <div className="product-detail-actions">
                    <button className="product-detail-btn product-detail-btn--ghost" onClick={() => handleAddToCart(false)} disabled={adding}>
                      Add to Cart
                    </button>
                    <button className="product-detail-btn" onClick={() => handleAddToCart(true)} disabled={adding}>
                      Buy Now
                    </button>
                  </div>
                </div>
              )}

              <div className="product-detail-policies">
                <span>Nationwide delivery support</span>
                <span>Prescription-friendly ordering flow</span>
                <span>30-day return support</span>
              </div>
            </div>
          </section>

          <section className="product-detail-description">
            <h2>Product Overview</h2>
            <div>
              {descriptionLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}