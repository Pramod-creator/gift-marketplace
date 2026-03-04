import api from "./axios";

// Users management
export const getAllUsers = () => api.get("/admin/users");
export const toggleUserStatus = (userId) => api.put(`/admin/users/${userId}/toggle`);

// Orders management
export const getAllOrders = () => api.get("/admin/orders");

// Products management
export const deactivateProduct = (productId) => api.put(`/admin/products/${productId}/deactivate`);
