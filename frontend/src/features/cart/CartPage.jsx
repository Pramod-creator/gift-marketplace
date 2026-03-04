import { useEffect, useState, useContext } from "react";
import { getCart, updateCartItem, removeCartItem } from "../../api/cart.api";
import { checkout as checkoutApi } from "../../api/orders.api";
import { useNavigate } from "react-router-dom";
import "../../styles/cart.css";
import { AuthContext } from "../../auth/AuthContext";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCartItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem({ product_id: productId, quantity });

      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      // remove by cart item id
      await removeCartItem(cartItemId);

      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + price * item.quantity;
  }, 0);

  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "400px" }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container text-center py-4">
        <h2>Your Cart is Empty</h2>
        <p className="text-gray-600 mb-4">Add some gifts to get started!</p>
        <a href="/" className="btn-primary" style={{ display: "inline-block" }}>Continue Shopping</a>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2>Shopping Cart</h2>

      <div className="grid grid-2" style={{ marginTop: "2rem" }}>
        <div>
              {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.product?.image_url ? (
                  <img
                    src={`http://localhost:5000/uploads/products/${item.product.image_url}`}
                    alt={item.product?.name}
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </div>

              <div className="cart-item-content">
                <h4>{item.product?.name}</h4>
                <p className="text-sm text-gray-600">by {item.product?.User?.name}</p>
                <p className="text-lg font-bold text-primary">Rs {parseFloat(item.product?.price).toLocaleString()}</p>
              </div>

              <div className="cart-item-controls">
                <div className="qty-control">
                  <label htmlFor={`qty-${item.id}`}>Quantity:</label>
                  <input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.product_id, Number(e.target.value))
                    }
                  />
                </div>
                <button
                  className="btn-danger"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="cart-summary">

            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs {totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>Rs {totalPrice.toFixed(2)}</span>
            </div>

            <button
              className="btn-primary"
              onClick={async () => {
                if (processing) return;
                setProcessing(true);
                try {
                  const res = await checkoutApi();
                  navigate("/order/success", { state: { order: res.data } });
                } catch (err) {
                  alert(err.response?.data?.message || "Checkout failed");
                } finally {
                  setProcessing(false);
                }
              }}
              disabled={processing}
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              {processing ? "Processing..." : "Proceed to Checkout"}
            </button>

            <a href="/" className="btn-secondary" style={{ width: "100%", marginTop: "1rem", display: "block", textAlign: "center" }}>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}