import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus, getAllOrders, deactivateProduct } from "../../api/admin.api";
import "../../styles/dashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
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
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
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

  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>

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
      ) : (
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
                      <h4>Order #{order.id}</h4>
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
      )}
    </div>
  );
}