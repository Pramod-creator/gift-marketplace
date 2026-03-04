import api from "./axios";

export const getMyOrders = () => api.get("/orders");
export const checkout = () => api.post("/orders/checkout");
