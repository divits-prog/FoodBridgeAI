import { useState } from "react";
import AiService from "../services/AiService";

function AiAssistantModal({ isOpen, onClose, onAddToCart }) {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const suggestions = [
        { label: "🌶️ Spicy comfort dinner", prompt: "Spicy comfort dinner with rice or bread" },
        { label: "🥗 Healthy high-protein", prompt: "Healthy high-protein options" },
        { label: "💰 Budget dishes under ₹180", prompt: "Best value dishes under ₹180" },
        { label: "👨‍🍳 Chef's top-rated", prompt: "Chef's top-rated specials" },
        { label: "🍰 Sweet treat", prompt: "Sweet artisanal desserts" }
    ];

    const handleAsk = (promptText) => {
        const textToSearch = promptText || query;
        if (!textToSearch.trim()) return;

        setIsLoading(true);
        setError("");

        AiService.getRecommendations(textToSearch)
            .then(({ data }) => {
                setAiResponse(data);
            })
            .catch(() => {
                setError("Unable to connect to FoodBridge AI engine. Ensure the backend is active on port 8080.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAsk();
        }
    };

    return (
        <div className="modal-backdrop-blur" onClick={onClose}>
            <div className="modern-ai-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="ai-modal-top">
                    <div className="ai-brand-group">
                        <div className="ai-glow-avatar">✦</div>
                        <div>
                            <h3>FoodBridge AI Assistant</h3>
                            <p>Smart neighborhood culinary recommendations</p>
                        </div>
                    </div>
                    <button type="button" className="modal-close-icon" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="ai-modal-content">
                    {/* Prompt input */}
                    <div className="ai-input-card">
                        <input
                            type="text"
                            placeholder="Ask for high-protein, spicy, Italian, quick lunch under ₹150..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="button"
                            className="ai-submit-button"
                            onClick={() => handleAsk()}
                            disabled={isLoading}
                        >
                            {isLoading ? "Analyzing..." : "Ask AI ↗"}
                        </button>
                    </div>

                    {/* Quick suggestion pills */}
                    <div className="ai-quick-pills">
                        <span className="pills-title">Popular prompts:</span>
                        {suggestions.map((item) => (
                            <button
                                key={item.label}
                                type="button"
                                className="ai-chip"
                                onClick={() => {
                                    setQuery(item.prompt);
                                    handleAsk(item.prompt);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {error && <div className="error-alert-banner">{error}</div>}

                    {isLoading && (
                        <div className="ai-thinking-box">
                            <div className="glowing-spinner"></div>
                            <h4>Analyzing Neighborhood Kitchens</h4>
                            <p>Comparing fresh ingredients, verified reviews, and flavor profiles...</p>
                        </div>
                    )}

                    {!isLoading && aiResponse && (
                        <div className="ai-results-wrapper">
                            <div className="ai-response-message">
                                <div className="ai-tag-pill">✦ AI Curation</div>
                                <p>{aiResponse.reply}</p>
                            </div>

                            {aiResponse.dishes && aiResponse.dishes.length > 0 && (
                                <div className="ai-dishes-deck">
                                    {aiResponse.dishes.map((dish) => (
                                        <div className="ai-card" key={dish.id}>
                                            <div
                                                className="ai-card-image"
                                                style={{
                                                    backgroundImage: `url(${dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"})`
                                                }}
                                            >
                                                <span className="ai-category-pill">{dish.category || "Dish"}</span>
                                                <span className="ai-rating-pill">★ {dish.rating || 4.7}</span>
                                            </div>

                                            <div className="ai-card-content">
                                                <h4>{dish.foodName}</h4>
                                                <span className="ai-kitchen-tag">From <strong>{dish.restaurantName}</strong></span>
                                                <div className="ai-reason-quote">
                                                    "{dish.matchReason}"
                                                </div>

                                                <div className="ai-card-footer">
                                                    <span className="ai-dish-cost">₹{Number(dish.price || 0).toFixed(0)}</span>
                                                    <button
                                                        type="button"
                                                        className="ai-add-dish-btn"
                                                        onClick={() => onAddToCart && onAddToCart(dish)}
                                                    >
                                                        + Add to Order
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {aiResponse.aiInsights && (
                                <div className="ai-insights-card">
                                    <span className="insight-badge">🌱 Community & Nutrition Tip</span>
                                    <p>{aiResponse.aiInsights}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AiAssistantModal;
