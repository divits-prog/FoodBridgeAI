import api from "../api/axios";

const getRecommendations = (prompt = "", category = "", maxPrice = null) => {
    return api.post("/ai/recommend", {
        prompt,
        category,
        maxPrice
    });
};

const chatWithAi = (message) => {
    return api.post("/ai/chat", { message });
};

export default {
    getRecommendations,
    chatWithAi
};
