import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus, getAllOrders, deactivateProduct } from "../../api/admin.api";
import { getCategories, createCategory, deleteCategory } from "../../api/categories.api";
import "../../styles/dashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (activeTab === "users") {
        const res = await getAllUsers();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === "orders") {
        const res = await getAllOrders();
        setOrders(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === "categories") {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return setError("Category name is required");
    try {
      await createCategory({ name: newCategory.trim() });
      setSuccess("Category created");
      setNewCategory("");
      setTimeout(() => setSuccess(""), 2500);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Remove this category?")) return;
    try {
      await deleteCategory(id);
      setSuccess("Category removed");
      setTimeout(() => setSuccess(""), 2500);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove category");
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await toggleUserStatus(userId);
      setSuccess("User status updated");
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle user");
    }
  };

  const handleDeactivateProduct = async (productId) => {
    if (!window.confirm("Deactivate this product?")) return;
    try {
      await deactivateProduct(productId);
      setSuccess("Product deactivated");
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate product");
    }
  };

  const userCount = users.length;
  const orderCount = orders.length;

  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{userCount}</p>
        </div>
        <div className="stat-card">
          <h4>Total Orders</h4>
          <p>{orderCount}</p>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "400px" }}>
          <div className="loader"></div>
        </div>
      ) : activeTab === "users" ? (
        <div className="dashboard-table">
          <h3>User Management</h3>
          {users.length === 0 ? (
            <p className="text-tertiary">No users found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status ${user.is_active ? "active" : "inactive"}`}>
                        {user.is_active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={user.is_active ? "btn-danger" : "btn-success"}
                        onClick={() => handleToggleUser(user.id)}
                      >
                        {user.is_active ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : activeTab === "orders" ? (
        <div className="dashboard-table">
          <h3>All Orders</h3>
          {orders.length === 0 ? (
            <p className="text-tertiary">No orders found</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="card order-card">
                  <div className="order-header">
                    <div>
                      <p className="text-tertiary">Customer: {order.User?.name}</p>
                    </div>
                    <div className="order-meta">
                      <p className="text-xl font-bold text-primary">Rs {parseFloat(order.total_price).toLocaleString()}</p>
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
      ) : (
        <div className="dashboard-table">
          <h3>Categories</h3>
          <div className="mb-4 card">
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1"
              />
              <button className="btn-primary">Create</button>
            </form>
          </div>

          {categories.length === 0 ? (
            <p className="text-tertiary">No categories found</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.name}</td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteCategory(c.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}