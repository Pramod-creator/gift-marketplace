import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { addToCart } from "../api/cart.api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // load products and refetch when category or search changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");
        const opts = {};
        if (selectedCategory) opts.category = selectedCategory;
        if (searchQuery) opts.search = searchQuery;
        const res = await getProducts(opts);
        const productList = Array.isArray(res.data?.products)
          ? res.data.products
          : [];
        setProducts(productList);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // initialize from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    const search = params.get("search") || "";
    if (cat) setSelectedCategory(cat);
    if (search) setSearchQuery(search);
  }, [location.search]);

  // fetch categories on mount
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    loadCats();
  }, []);

  const handleAddToCart = async (productId, productName) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await addToCart({ product_id: productId, quantity: 1 });
      setSuccessMsg(`${productName} added to cart!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "400px" }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container text-center py-4">
        <h2>No Products Found</h2>
        <p className="text-gray-600">Check back soon for new gift items!</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* category filter */}
      <div className="flex gap-2 items-center mb-4">
        <label htmlFor="cat" className="text-secondary font-semibold">Category:</label>
        <select
          id="cat"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select-category"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {successMsg && <div className="alert alert-success mb-4">{successMsg}</div>}
      
      <div className="grid grid-3">
        {products.map((p) => (
          <div key={p.id} className="card product-card">
            <div className="product-image">
              {p.image_url ? (
                <img
                  src={`http://localhost:5000/uploads/products/${p.image_url}`}
                  alt={p.name}
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>

            <div className="product-content">
              <h3>{p.name}</h3>
              {p.Category && <span className="text-sm text-secondary">{p.Category.name}</span>}
              <p className="text-gray-600 text-sm mb-2">{p.description}</p>
              <p className="text-xl font-bold text-primary mb-2">Rs {parseFloat(p.price).toLocaleString()}</p>
              <p className="text-sm text-gray-500">by {p.User?.name}</p>
            </div>

            {user?.role === "customer" && (
              <>
                <button
                  className="btn-primary"
                  onClick={() => handleAddToCart(p.id, p.name)}
                  disabled={addingToCart[p.id]}
                  style={{ width: "100%", marginTop: "auto" }}
                >
                  {addingToCart[p.id] ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  className="btn-secondary mt-2"
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    navigate("/checkout", {
                      state: { prefillItem: { product: p, quantity: 1 } }
                    });
                  }}
                  style={{ width: "100%" }}
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}