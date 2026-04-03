import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "../components/layout/NavBar";
import { getUser } from "../services/authService";
import { useToast } from "../components/Toast";
import api from "../services/api";
import "../styles/ProductCatalog.css";

const CATEGORY_CONFIG = [
  { key: "READY_MADE", label: "Ready-made", route: "ready-made", type: "READY_MADE" },
  { key: "FRAME", label: "Frames", route: "frame", type: "FRAME" },
  { key: "LENS", label: "Lenses", route: "lens", type: "LENS" },
  { key: "CONTACT", label: "Contacts", route: "contact", type: "CONTACT_LENS" },
];

const SORT_CONFIG = {
  ALL: [
    { key: "PRICE_ASC",  label: "Giá: Thấp → Cao" },
    { key: "PRICE_DESC", label: "Giá: Cao → Thấp" },
  ],
  READY_MADE: [
    { key: "PRICE_ASC",   label: "Giá: Thấp → Cao" },
    { key: "PRICE_DESC",  label: "Giá: Cao → Thấp" },
    { key: "SPH_ASC",     label: "Độ cận SPH: Thấp → Cao" },
    { key: "SPH_DESC",    label: "Độ cận SPH: Cao → Thấp" },
    { key: "CYL_ASC",     label: "Độ loạn CYL: Thấp → Cao" },
    { key: "CYL_DESC",    label: "Độ loạn CYL: Cao → Thấp" },
  ],
  FRAME: [
    { key: "PRICE_ASC",       label: "Giá: Thấp → Cao" },
    { key: "PRICE_DESC",      label: "Giá: Cao → Thấp" },
    { key: "BRAND_AZ",        label: "Thương hiệu: A → Z" },
    { key: "BRAND_ZA",        label: "Thương hiệu: Z → A" },
    { key: "MATERIAL_AZ",     label: "Chất liệu: A → Z" },
    { key: "RIM_TYPE_AZ",     label: "Kiểu viền: A → Z" },
    { key: "FRAME_TYPE_AZ",   label: "Kiểu gọng: A → Z" },
    { key: "COLOR_AZ",        label: "Màu sắc: A → Z" },
    { key: "SIZE_AZ",         label: "Kích thước: A → Z" },
  ],
  LENS: [
    { key: "PRICE_ASC",    label: "Giá: Thấp → Cao" },
    { key: "PRICE_DESC",   label: "Giá: Cao → Thấp" },
    { key: "BRAND_AZ",     label: "Thương hiệu: A → Z" },
    { key: "LENS_TYPE_AZ", label: "Loại tròng: A → Z" },
    { key: "SPH_ASC",      label: "SPH tối thiểu: Thấp → Cao" },
    { key: "SPH_DESC",     label: "SPH tối thiểu: Cao → Thấp" },
    { key: "COLOR_CHANGE", label: "Tròng đổi màu trước" },
  ],
  CONTACT: [
    { key: "PRICE_ASC",        label: "Giá: Thấp → Cao" },
    { key: "PRICE_DESC",       label: "Giá: Cao → Thấp" },
    { key: "BRAND_AZ",         label: "Thương hiệu: A → Z" },
    { key: "CONTACT_TYPE_AZ",  label: "Loại kính: A → Z" },
    { key: "COLOR_AZ",         label: "Màu sắc: A → Z" },
    { key: "SPH_ASC",          label: "SPH tối thiểu: Thấp → Cao" },
    { key: "SPH_DESC",         label: "SPH tối thiểu: Cao → Thấp" },
  ],
};

const DEFAULT_SORT = "PRICE_ASC";
const PRODUCTS_PER_PAGE = 12;

function getValidCategory(category) {
  return CATEGORY_CONFIG.some((item) => item.key === category) ? category : "ALL";
}

export default function ProductCatalog() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = getValidCategory(searchParams.get("category"));

  const [user] = useState(() => getUser());
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const sortOptions = SORT_CONFIG[selectedCategory] || SORT_CONFIG.ALL;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
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

  // Sync searchParams khi selectedCategory thay đổi (chỉ 1 chiều: state -> URL)
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (selectedCategory === "ALL") {
        next.delete("category");
      } else {
        next.set("category", selectedCategory);
      }
      return next;
    }, { replace: true });
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
    setSortBy(DEFAULT_SORT);
  }, [selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, keyword]);

  const requireLogin = () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    // Search is applied live by keyword state on this page.
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
          category: "READY_MADE",
          categoryLabel: "Ready-made",
          meta: [item.brand || "Ready-made", item.fixedSph != null && `SPH ${item.fixedSph}`, item.fixedCyl != null && `CYL ${item.fixedCyl}`]
            .filter(Boolean)
            .join(" • "),
          canAdd: true,
          // raw fields for sorting
          fixedSph: item.fixedSph ?? 0,
          fixedCyl: item.fixedCyl ?? 0,
        };
      case "FRAME":
        return {
          id: item.frameId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || null,
          type: "FRAME",
          route: "frame",
          category: "FRAME",
          categoryLabel: "Frames",
          meta: [item.brand, item.material, item.size && `Size ${item.size}`].filter(Boolean).join(" • "),
          canAdd: false,
          brand: item.brand || "",
          material: item.material || "",
          rimType: item.rimType || "",
          frameType: item.frameType || "",
          color: item.color || "",
          size: item.size || "",
        };
      case "LENS":
        return {
          id: item.lensId,
          name: item.name,
          price: item.basePrice,
          imageUrl: item.imageUrl || null,
          type: "LENS",
          route: "lens",
          category: "LENS",
          categoryLabel: "Lenses",
          meta: [item.lensType, item.brand, item.minSph != null && `SPH ${item.minSph} ~ ${item.maxSph}`].filter(Boolean).join(" • "),
          canAdd: false,
          brand: item.brand || "",
          lensType: item.lensType || "",
          minSph: item.minSph ?? 0,
          colorChange: item.colorChange ?? false,
        };
      case "CONTACT":
        return {
          id: item.contactLensId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl || null,
          type: "CONTACT_LENS",
          route: "contact",
          category: "CONTACT",
          categoryLabel: "Contacts",
          meta: [item.brand, item.contactType, item.minSph != null && `SPH ${item.minSph} ~ ${item.maxSph}`].filter(Boolean).join(" • "),
          canAdd: true,
          brand: item.brand || "",
          contactType: item.contactType || "",
          color: item.color || "",
          minSph: item.minSph ?? 0,
        };
      default:
        return null;
    }
  };

  const collections = useMemo(
    () => ({
      READY_MADE: data.readyMade.map((item) => normalizeProduct(item, "READY_MADE")),
      FRAME: data.frames.map((item) => normalizeProduct(item, "FRAME")),
      LENS: data.lenses.map((item) => normalizeProduct(item, "LENS")),
      CONTACT: data.contactLens.map((item) => normalizeProduct(item, "CONTACT")),
    }),
    [data]
  );

  const allProducts = useMemo(
    () => [...collections.READY_MADE, ...collections.FRAME, ...collections.LENS, ...collections.CONTACT],
    [collections]
  );

  const visibleProducts = selectedCategory === "ALL" ? allProducts : collections[selectedCategory] || [];
  const sortFn = (a, b) => {
    switch (sortBy) {
      case "PRICE_DESC":     return (b.price || 0) - (a.price || 0);
      case "SPH_ASC":        return (a.fixedSph ?? a.minSph ?? 0) - (b.fixedSph ?? b.minSph ?? 0);
      case "SPH_DESC":       return (b.fixedSph ?? b.minSph ?? 0) - (a.fixedSph ?? a.minSph ?? 0);
      case "CYL_ASC":        return (a.fixedCyl ?? 0) - (b.fixedCyl ?? 0);
      case "CYL_DESC":       return (b.fixedCyl ?? 0) - (a.fixedCyl ?? 0);
      case "BRAND_AZ":       return (a.brand || "").localeCompare(b.brand || "", "vi");
      case "BRAND_ZA":       return (b.brand || "").localeCompare(a.brand || "", "vi");
      case "MATERIAL_AZ":    return (a.material || "").localeCompare(b.material || "", "vi");
      case "RIM_TYPE_AZ":    return (a.rimType || "").localeCompare(b.rimType || "", "vi");
      case "FRAME_TYPE_AZ":  return (a.frameType || "").localeCompare(b.frameType || "", "vi");
      case "COLOR_AZ":       return (a.color || "").localeCompare(b.color || "", "vi");
      case "SIZE_AZ":        return (a.size || "").localeCompare(b.size || "", "vi");
      case "LENS_TYPE_AZ":   return (a.lensType || "").localeCompare(b.lensType || "", "vi");
      case "CONTACT_TYPE_AZ":return (a.contactType || "").localeCompare(b.contactType || "", "vi");
      case "COLOR_CHANGE":   return (b.colorChange ? 1 : 0) - (a.colorChange ? 1 : 0);
      default:               return (a.price || 0) - (b.price || 0); // PRICE_ASC
    }
  };

  const filteredProducts = visibleProducts
    .filter((product) =>
      !keyword.trim()
      || [product.name, product.meta, product.categoryLabel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword.trim().toLowerCase())
    )
    .sort(sortFn);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const selectedCategoryLabel = CATEGORY_CONFIG.find((item) => item.key === selectedCategory)?.label || "";
  return (
    <div className="catalog-page">
      <NavBar keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />

      <main className="catalog-main">
        <div className="electro-shell">
          <div className="catalog-head">
            <div>
              <h1>Product Catalog</h1>
              <p>Browse all eyewear products, narrow results by category, and sort by price.</p>
            </div>
            <button className="catalog-home-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>

          <div className="catalog-toolbar">
            <div className="catalog-toolbar-actions">
              <div className="catalog-menu">
                <button
                  className="catalog-toolbar-btn"
                  onClick={() => {
                    setFilterOpen((prev) => !prev);
                    setSortOpen(false);
                  }}
                >
                  Filter
                </button>

                {filterOpen && (
                  <div className="catalog-dropdown">
                    <button
                      className={`catalog-dropdown-item ${selectedCategory === "ALL" ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setFilterOpen(false);
                      }}
                    >
                      All Products
                    </button>
                    {CATEGORY_CONFIG.map((category) => (
                      <button
                        key={category.key}
                        className={`catalog-dropdown-item ${selectedCategory === category.key ? "active" : ""}`}
                        onClick={() => {
                          setSelectedCategory(category.key);
                          setFilterOpen(false);
                        }}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="catalog-menu">
                <button
                  className="catalog-toolbar-btn"
                  onClick={() => {
                    setSortOpen((prev) => !prev);
                    setFilterOpen(false);
                  }}
                >
                  Sort
                </button>

                {sortOpen && (
                  <div className="catalog-dropdown">
                    {sortOptions.map((option) => (
                      <button
                        key={option.key}
                        className={`catalog-dropdown-item ${sortBy === option.key ? "active" : ""}`}
                        onClick={() => {
                          setSortBy(option.key);
                          setSortOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedCategory !== "ALL" && (
                <button
                  className="catalog-chip"
                  onClick={() => setSelectedCategory("ALL")}
                >
                  <span>{selectedCategoryLabel}</span>
                  <strong>x</strong>
                </button>
              )}
            </div>
          </div>

          <div className="catalog-results-head">
            <h2>{selectedCategory === "ALL" ? "All Products" : selectedCategoryLabel}</h2>
            <span>
              {loading
                ? "Loading..."
                : `${filteredProducts.length} products${filteredProducts.length > 0 ? ` - Page ${currentPage} of ${totalPages}` : ""}`}
            </span>
          </div>

          {loading ? (
            <div className="catalog-empty">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="catalog-empty">No products match your current search.</div>
          ) : (
            <>
              <div className="electro-product-grid catalog-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={`${product.category}-${product.id}`}
                    product={product}
                    formatPrice={formatPrice}
                    onDetail={() => navigate(`/product/${product.route}/${product.id}`)}
                    onAdd={(e) => handleAddToCart(e, product.type, product.id, product.name)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="catalog-pagination">
                  <button
                    className="catalog-page-btn"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      className={`catalog-page-btn ${page === currentPage ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="catalog-page-btn"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
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
        <span>{product.categoryLabel}</span>
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