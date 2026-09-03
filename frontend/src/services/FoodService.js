import api from "../api/axios";

const getRestaurants = () => api.get("/restaurants");
const getFoods = () => api.get("/foods");
const createFood = (food) => api.post("/foods", food);
const updateFood = (id, food) => api.put(`/foods/${id}`, food);
const deleteFood = (id) => api.delete(`/foods/${id}`);

export default { getRestaurants, getFoods, createFood, updateFood, deleteFood };
