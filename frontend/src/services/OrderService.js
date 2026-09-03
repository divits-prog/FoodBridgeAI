import api from "../api/axios";

const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
const createOrder = (userId, totalAmount) => api.post("/orders", {
    user: { id: userId },
    totalAmount,
    orderStatus: "PLACED"
});

export default { getUserOrders, createOrder };
