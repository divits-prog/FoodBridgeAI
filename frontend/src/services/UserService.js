import api from "../api/axios";

// =========================
// REGISTER USER
// =========================

const registerUser = (user) => {
    return api.post("/users/register", user);
};


// =========================
// LOGIN USER
// =========================

const loginUser = (credentials) => {
    return api.post("/users/login", credentials);
};


// =========================
// GET ALL USERS
// =========================

const getAllUsers = () => {
    return api.get("/users");
};


// =========================
// GET USER BY ID
// =========================

const getUserById = (id) => {
    return api.get(`/users/${id}`);
};


// =========================
// UPDATE USER
// =========================

const updateUser = (id, user) => {
    return api.put(`/users/${id}`, user);
};


// =========================
// DELETE USER
// =========================

const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};


export default {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};