import api from "../api/axios";

const getRestaurants = () => api.get("/restaurants");
const createRestaurant = (restaurant) => api.post("/restaurants", restaurant);
const updateRestaurant = (id, restaurant) => api.put(`/restaurants/${id}`, restaurant);
const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);

export default { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant };
