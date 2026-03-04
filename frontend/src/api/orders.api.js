import api from "./axios";

export const getMyOrders = () => api.get("/orders");
// payload may contain shipping_address, phone
export const checkout = (payload) => api.post("/orders/checkout", payload);
// buy now for a single product
export const buyNow = (payload) => api.post("/orders/buy", payload);
