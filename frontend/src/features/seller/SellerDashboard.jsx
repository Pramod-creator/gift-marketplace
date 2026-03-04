import { useEffect, useState } from "react";
import { getMyProducts, createProduct, updateProduct, deleteProduct } from "../../api/seller.api";
import { getMyOrders } from "../../api/orders.api";
import "../../styles/dashboard.css";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (activeTab === "products") {
        const res = await getMyProducts();
        setProducts(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === "orders") {
        const res = await getMyOrders();
        setOrders(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError("Name and price are required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    if (formData.image) data.append("image", formData.image);

    try {
      await createProduct(data);
      setSuccess("Product added successfully");
      setTimeout(() => setSuccess(""), 3000);
      setFormData({ name: "", description: "", price: "", image: null });
      setShowProductForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(productId);
      setSuccess("Product deleted");
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="container py-4">
      <h2>Seller Dashboard</h2>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          My Products
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "400px" }}>
          <div className="loader"></div>
        </div>
      ) : activeTab === "products" ? (
        <div>
          <div className="flex-between mb-4">
            <h3>My Products ({products.length})</h3>
            <button
              className="btn-primary"
              onClick={() => setShowProductForm(!showProductForm)}
            >
              {showProductForm ? "Cancel" : "+ Add Product"}
            </button>
          </div>

          {showProductForm && (
            <div className="card mb-4">
              <h4>Add New Product</h4>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Gift name"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Price in Rs"
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Add Product
                </button>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <p className="text-tertiary">No products yet. Add your first gift!</p>
          ) : (
            <div className="grid grid-3">
              {products.map((product) => (
                <div key={product.id} className="card">
                  {product.image_url && (
                    <img
                      src={`http://localhost:5000/uploads/products/${product.image_url}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "0.5rem",
                        marginBottom: "1rem"
                      }}
                    />
                  )}
                  <h4>{product.name}</h4>
                  <p className="text-tertiary text-sm mb-2">{product.description}</p>
                  <p className="text-lg font-bold text-primary mb-4">Rs {parseFloat(product.price).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3>My Orders</h3>
          {orders.length === 0 ? (
            <p className="text-tertiary">No orders yet</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="card order-card">
                  <div className="order-header">
                    <div>
                      <h4>Order #{order.id}</h4>
                      <p className="text-tertiary">Customer: {order.User?.name}</p>
                    </div>
                    <div className="order-meta">
                      <p className="text-xl font-bold text-primary">
                        Rs {parseFloat(order.total_price).toLocaleString()}
                      </p>
                      <p className={`status ${order.status === "pending" ? "pending" : "completed"}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>

                  <div className="order-items">
                    {order.OrderItems?.map((item) => (
                      <div key={item.id} className="order-item">
                        <span>{item.Product?.name}</span>
                        <span className="text-tertiary">x{item.quantity}</span>
                        <span className="text-primary">Rs {item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}