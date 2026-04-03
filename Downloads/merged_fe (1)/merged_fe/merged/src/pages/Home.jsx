import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/authService";
import { useToast } from "../components/Toast";
import api from "../services/api";
import NavBar from "../components/layout/NavBar";
import "../styles/Home.css";

const CATEGORY_CONFIG = [
  { key: "READY_MADE", label: "Ready-made", route: "ready-made", type: "READY_MADE" },
  { key: "FRAME", label: "Frames", route: "frame", type: "FRAME" },
  { key: "LENS", label: "Lenses", route: "lens", type: "LENS" },
  { key: "CONTACT", label: "Contacts", route: "contact", type: "CONTACT_LENS" },
];

const COLLECTION_BANNERS = [
  {
    title: "Frames Collection",
    subtitle: "Shop frames",
    fallbackImage: "/banner/vooglam-eyewear-PLm5ZYZn6qk-unsplash.jpg",
    action: "FRAME",
  },
  {
    title: "Prescription Lenses",
    subtitle: "Built for your vision",
    fallbackImage: "/banner/bartosz-sujkowski-oFF-5I-yXCM-unsplash.jpg",
    action: "LENS",
  },
  {
    title: "Contact Lenses",
    subtitle: "Daily comfort",
    fallbackImage: "/banner/10737-contacts.jpg",
    action: "CONTACT",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const [user] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("READY_MADE");
  const [data, setData] = useState({
    readyMade: [],
    frames: [],
    lenses: [],
    contactLens: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [readyMadeRes, framesRes, lensesRes, contactsRes] = await Promise.all([
          api.get("/admin/rmglasses/public/all"),
          api.get("/admin/frames/public/all"),
          api.get("/admin/lens/public/all"),
          api.get("/admin/contactlens/public/all"),
        ]);

        setData({
          readyMade: Array.isArray(readyMadeRes.data) ? readyMadeRes.data : [],
          frames: Array.isArray(framesRes.data) ? framesRes.data : [],
          lenses: Array.isArray(lensesRes.data) ? lensesRes.data : [],
          contactLens: Array.isArray(contactsRes.data) ? contactsRes.data : [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await api.get("/search?keyword=" + encodeURIComponent(keyword));
      setSearchResults(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleAddToCart = async (e, productType, productId, name) => {
    e.stopPropagation();
    if (!requireLogin()) return;

    try {
      await api.post("/cart/add", { productType, productId, quantity: 1 });
      toast({ message: `"${name}" was added to cart.`, type: "success" });
    } catch (error) {
      toast({
        message: error.response?.data?.message || "Failed to update your cart.",
        type: "error",
      });
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const normalizeProduct = (item, categoryKey) => {
    switch (categoryKey) {
      case "READY_MADE":
        return {
          id: item.readyGlassesId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || null,
          type: "READY_MADE",
          route: "ready-made",
          meta: [item.brand, item.fixedSph != null && `SPH ${item.fixedSph}`, item.fixedCyl != null && `CYL ${item.fixedCyl}`]
            .filter(Boolean)
            .join(" • "),
          canAdd: true,
        };
      case "FRAME":
        return {
          id: item.frameId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || null,
          type: "FRAME",
          route: "frame",
          meta: [item.brand, item.material, item.size && `Size ${item.size}`].filter(Boolean).join(" • "),
          canAdd: false,
        };
      case "LENS":
        return {
          id: item.lensId,
          name: item.name,
          price: item.basePrice,
          imageUrl: item.imageUrl || null,
          type: "LENS",
          route: "lens",
          meta: [item.lensType, item.minSph != null && `SPH ${item.minSph} ~ ${item.maxSph}`].filter(Boolean).join(" • "),
          canAdd: false,
        };
      case "CONTACT":
        return {
          id: item.contactLensId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || null,
          type: "CONTACT_LENS",
          route: "contact",
          meta: [item.brand, item.contactType, item.minSph != null && `SPH ${item.minSph} ~ ${item.maxSph}`].filter(Boolean).join(" • "),
          canAdd: true,
        };
      default:
        return null;
    }
  };

  const collections = {
    READY_MADE: data.readyMade.map((item) => normalizeProduct(item, "READY_MADE")),
    FRAME: data.frames.map((item) => normalizeProduct(item, "FRAME")),
    LENS: data.lenses.map((item) => normalizeProduct(item, "LENS")),
    CONTACT: data.contactLens.map((item) => normalizeProduct(item, "CONTACT")),
  };

  const newProducts = collections[activeTab]?.slice(0, 4) || [];

  const searchSections = [
    { key: "readyMadeGlasses", label: "Ready-made", route: "ready-made", type: "READY_MADE", idKey: "readyGlassesId", priceKey: "price", canAdd: true },
    { key: "frames", label: "Frames", route: "frame", type: "FRAME", idKey: "frameId", priceKey: "price", canAdd: false },
    { key: "lenses", label: "Lenses", route: "lens", type: "LENS", idKey: "lensId", priceKey: "basePrice", canAdd: false },
    { key: "contactLenses", label: "Contacts", route: "contact", type: "CONTACT_LENS", idKey: "contactLensId", priceKey: "price", canAdd: true },
  ];

  return (
    <div className="electro-page">
      <NavBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
      />

      <main className="electro-main">
        <div className="electro-shell">
          {!searchResults && (
            <>
              <section className="electro-collections">
                {COLLECTION_BANNERS.map((banner) => (
                  <button
                    key={banner.title}
                    className="electro-collection-card"
                    onClick={() => setActiveTab(banner.action)}
                    style={{
                      backgroundImage: `linear-gradient(90deg, rgba(209, 0, 36, 0.88), rgba(209, 0, 36, 0.72)), url(${collections[banner.action]?.[0]?.imageUrl || banner.fallbackImage})`,
                    }}
                  >
                    <span>{banner.subtitle}</span>
                    <h3>{banner.title}</h3>
                  </button>
                ))}
              </section>

              <section className="electro-section">
                <div className="electro-section-head">
                  <h2>New Products</h2>
                </div>

                <div className="electro-tab-row">
                  <div className="electro-tab-links">
                    {CATEGORY_CONFIG.map((category) => (
                      <button
                        key={category.key}
                        className={category.key === activeTab ? "active" : ""}
                        onClick={() => setActiveTab(category.key)}
                      >
                        <span>{category.label}</span>
                        <em>{collections[category.key]?.length || 0}</em>
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="electro-empty">Loading products...</div>
                ) : (
                  <>
                    <div className="electro-product-grid">
                      {newProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          formatPrice={formatPrice}
                          onDetail={() => navigate(`/product/${product.route}/${product.id}`)}
                          onAdd={(e) => handleAddToCart(e, product.type, product.id, product.name)}
                        />
                      ))}
                    </div>
                    <div className="electro-show-all-wrap">
                      <button className="electro-show-all-btn" onClick={() => navigate(`/catalog?category=${activeTab}`)}>
                        Show All
                      </button>
                    </div>
                  </>
                )}
              </section>

            </>
          )}

          {searchResults && (
            <section className="electro-section">
              <div className="electro-section-head">
                <h2>Search Results</h2>
                <button className="electro-clear-search" onClick={() => { setSearchResults(null); setKeyword(""); }}>
                  Clear Search
                </button>
              </div>

              {searchLoading ? (
                <div className="electro-empty">Searching...</div>
              ) : (
                searchSections.map((section) =>
                  searchResults[section.key]?.length > 0 ? (
                    <div key={section.key} className="electro-search-block">
                      <h3>{section.label}</h3>
                      <div className="electro-product-grid">
                        {searchResults[section.key].map((item) => {
                          const product = {
                            id: item[section.idKey],
                            name: item.name,
                            price: item[section.priceKey],
                            imageUrl: item.imageUrl || null,
                            type: section.type,
                            route: section.route,
                            meta: item.brand || item.lensType || item.contactType || "Search result",
                            canAdd: section.canAdd,
                          };

                          return (
                            <ProductCard
                              key={product.id}
                              product={product}
                              formatPrice={formatPrice}
                              onDetail={() => navigate(`/product/${product.route}/${product.id}`)}
                              onAdd={(e) => handleAddToCart(e, product.type, product.id, product.name)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : null
                )
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="electro-footer">
        <div className="electro-shell electro-footer-grid">
          <div>
            <h4>About Us</h4>
            <p>GlassesShop is an online eyewear platform that enables customers to purchase ready-made glasses, place pre-orders for unavailable products, and request prescription-based custom lenses with end-to-end order support.</p>
            <ul>
              <li>17 Princess Road, London</li>
              <li>+84 123 456 789</li>
              <li>support@glassesshop.com</li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h4>Service</h4>
            <ul>
              <li>My Account</li>
              <li>View Cart</li>
              <li>Wishlist</li>
              <li>Track My Order</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductThumb({ imageUrl, name }) {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && !imgError) {
    return <img src={imageUrl} alt={name} onError={() => setImgError(true)} />;
  }

  return <div className="electro-thumb-fallback">⌁</div>;
}

function ProductCard({ product, formatPrice, onDetail, onAdd }) {
  return (
    <article className="electro-product-card" onClick={onDetail}>
      <div className="electro-product-badges">
        <span>NEW</span>
        {product.canAdd && <span className="sale">SALE</span>}
      </div>

      <div className="electro-product-media">
        <ProductThumb imageUrl={product.imageUrl} name={product.name} />
      </div>

      <div className="electro-product-body">
        <small>{product.meta || "Product collection"}</small>
        <h3>{product.name}</h3>
        <div className="electro-product-price-row">
          <strong>{formatPrice(product.price)}</strong>
          <span>{formatPrice((product.price || 0) * 1.15)}</span>
        </div>
      </div>

      <div className="electro-product-footer">
        {product.canAdd ? (
          <button
            className="electro-add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(e);
            }}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="electro-add-btn electro-add-btn--ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDetail();
            }}
          >
            View Details
          </button>
        )}
      </div>
    </article>
  );
}
