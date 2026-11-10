import api from "../api/axios";

const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);

const getAllOrders = () => api.get("/orders");

const createOrder = (orderData) => {
    if (typeof orderData === "object" && !orderData.userId) {
        return api.post("/orders", orderData);
    }
    return api.post("/orders", {
        user: { id: orderData.userId || orderData },
        totalAmount: orderData.totalAmount || 0,
        orderStatus: "PLACED",
        deliveryAddress: orderData.deliveryAddress || "Home Address",
        itemsSummary: orderData.itemsSummary || "",
        paymentMethod: orderData.paymentMethod || "CASH"
    });
};

const updateOrderStatus = (orderId, status) => {
    const payload = {
        status: status,
        orderStatus: status
    };
    return api.patch(`/orders/${orderId}/status`, payload)
        .catch(() => api.put(`/orders/${orderId}/status`, payload));
};

const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);

export default {
    getUserOrders,
    getAllOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder
};
