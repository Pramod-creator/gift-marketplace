import { useEffect, useState, useContext } from "react";
import { getMyOrders } from "../../api/orders.api";
import { AuthContext } from "../../auth/AuthContext";
import "../../styles/dashboard.css";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(false);
      setError("");
      const res = await getMyOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>My Account</h2>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Role:</span>
              <span className="badge badge-customer">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Statistics</h3>
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Total Orders:</span>
              <span className="value text-primary font-bold">{orders.length}</span>
            </div>
            <div className="info-row">
              <span className="label">Total Spent:</span>
              <span className="value text-primary font-bold">
                Rs {orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <h3>Order History</h3>

      {loading ? (
        <div className="flex-center" style={{ minHeight: "400px" }}>
          <div className="loader"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center">
          <p className="text-tertiary">No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="card order-card">
              <div className="order-header">
                <div>
                  <h4>Order #{order.id}</h4>
                  <p className="text-tertiary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-meta">
                  <p className="text-xl font-bold text-primary">
                    Rs {parseFloat(order.total_price).toLocaleString()}
                  </p>
                  <p className={`status ${order.status === "pending" ? "pending" : "completed"}`}>
                    {order.status || "Pending"}
                  </p>
                </div>
              </div>

              <div className="order-items">
                {order.OrderItems?.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-details">
                      {item.Product?.image_url && (
                        <img
                          src={`http://localhost:5000/uploads/products/${item.Product.image_url}`}
                          alt={item.Product?.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "0.25rem",
                            marginRight: "1rem"
                          }}
                        />
                      )}
                      <div>
                        <span className="font-semibold">{item.Product?.name}</span>
                        <p className="text-tertiary text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-primary font-bold">Rs {item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
