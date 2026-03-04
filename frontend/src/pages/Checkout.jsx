import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkout as checkoutApi, buyNow } from "../api/orders.api";
import { getCart } from "../api/cart.api";
import "../styles/checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const { fromCart, prefillItem } = location.state || {};

  useEffect(() => {
    const load = async () => {
      try {
        if (fromCart) {
          const res = await getCart();
          setItems(Array.isArray(res.data) ? res.data : []);
        } else if (prefillItem) {
          setItems([prefillItem]);
        }
      } catch (err) {
        setError("Failed to load items for checkout");
      } finally {
        setLoadingItems(false);
      }
    };
    load();
  }, [fromCart, prefillItem]);

  const totalPrice = items.reduce((sum, i) => {
    const price = i.product ? parseFloat(i.product.price) : parseFloat(i.price || 0);
    const qty = i.quantity || 1;
    return sum + price * qty;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!shippingAddress) {
      setError("Please enter a shipping address");
      return;
    }
    setProcessing(true);
    try {
      let res;
      if (fromCart) {
        res = await checkoutApi({ shipping_address: shippingAddress, phone });
      } else {
        // buy single product
        const item = items[0];
        res = await buyNow({
          product_id: item.product_id || item.id,
          quantity: item.quantity || 1,
          shipping_address: shippingAddress,
          phone
        });
      }
      navigate("/order/success", { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loadingItems) {
    return (
      <div className="flex-center" style={{ minHeight: "400px" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2>Checkout</h2>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="grid grid-2">
        <div>
          <div className="checkout-items">
            {items.map((item, idx) => (
              <div key={idx} className="checkout-item">
                <div className="item-info">
                  <h4>{item.product?.name || item.name}</h4>
                  <p>
                    Rs {parseFloat(item.product?.price || item.price).toLocaleString()} x {item.quantity || 1}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-row summary-total">
            <span>Total:</span>
            <span>Rs {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                rows="4"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button className="btn-primary" disabled={processing}>
              {processing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
