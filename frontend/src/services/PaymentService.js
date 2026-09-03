import api from "../api/axios";

const createPayment = (orderId, amount, paymentMethod = "CASH") => api.post("/payments", {
    order: { id: orderId },
    amount,
    paymentMethod,
    paymentStatus: "PENDING"
});

export default { createPayment };
