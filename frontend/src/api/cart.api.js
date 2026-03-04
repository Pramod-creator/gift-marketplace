import api from "./axios"; // your configured axios instance

// Get current user's cart
export const getCart = () => {
  return api.get("/cart");
};

// Add item to cart
export const addToCart = (data) => {
  return api.post("/cart", data);
};

// Update cart item quantity
export const updateCartItem = (data) => {
  return api.put("/cart", data);
};

// Remove item from cart
export const removeCartItem = (cartItemId) => {
  return api.delete(`/cart/${cartItemId}`);
};