import api from "./axios";

// My products
export const getMyProducts = () => api.get("/seller/products");
export const createProduct = (data) =>
  api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// My orders
export const getMyOrders = () => api.get("/seller/orders");
