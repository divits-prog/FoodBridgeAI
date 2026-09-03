import api from "../api/axios";

const getUserCart = (userId) => api.get(`/cart/user/${userId}`);
const addToCart = (foodId, userId, quantity = 1) => api.post("/cart", {
    food: { id: foodId },
    user: { id: userId },
    quantity
});
const updateCart = (id, foodId, userId, quantity) => api.put(`/cart/${id}`, {
    food: { id: foodId },
    user: { id: userId },
    quantity
});
const removeFromCart = (id) => api.delete(`/cart/${id}`);

export default { getUserCart, addToCart, updateCart, removeFromCart };
