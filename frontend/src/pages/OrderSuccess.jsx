import { useLocation, Link } from "react-router-dom";
import "../styles/success.css";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order || null;

  return (
    <div className="container py-4">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p className="text-gray-600">Thank you for your purchase.</p>
        
        {order ? (
          <div className="order-details">
            <div className="detail-row">
              <span>Order ID:</span>
              <span className="font-bold">#{order.id}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span className="font-bold text-primary">Rs {parseFloat(order.total_price).toLocaleString()}</span>
            </div>
            {order.shipping_address && (
              <div className="detail-row">
                <span>Shipping Address:</span>
                <span className="font-bold">{order.shipping_address}</span>
              </div>
            )}
            {order.phone && (
              <div className="detail-row">
                <span>Phone:</span>
                <span className="font-bold">{order.phone}</span>
              </div>
            )}
            <div className="detail-row">
              <span>Status:</span>
              <span className="font-bold text-success">{order.status || "Pending"}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-4">Your order was created successfully.</p>
        )}

        <div className="action-buttons">
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
