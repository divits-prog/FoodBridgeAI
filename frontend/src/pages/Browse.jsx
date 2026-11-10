import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodService from "../services/FoodService";
import CartService from "../services/CartService";
import AiAssistantModal from "../components/AiAssistantModal";
import CheckoutModal from "../components/CheckoutModal";

function Browse() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("All");
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isSignedIn = Boolean(token && token !== "null" && userId);

    useEffect(() => {
        loadData();
    }, [userId]);

    const loadData = () => {
        setIsLoading(true);
        setError("");

        Promise.all([
            FoodService.getRestaurants().catch(() => ({ data: [] })),
            FoodService.getFoods().catch(() => ({ data: [] })),
            isSignedIn && userId ? CartService.getUserCart(userId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ])
            .then(([restRes, foodRes, cartRes]) => {
                setRestaurants(restRes.data || []);
                setFoods(foodRes.data || []);
                setCart(cartRes.data || []);
            })
            .catch(() => {
                setError("We couldn't load the menu. Please ensure the backend server is running on port 8080.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const categories = [
        { label: "All", icon: "✨" },
        { label: "Biryani", icon: "🍛" },
        { label: "Main Course", icon: "🥘" },
        { label: "Pizza", icon: "🍕" },
        { label: "Italian", icon: "🍝" },
        { label: "Healthy", icon: "🥗" },
        { label: "Dessert", icon: "🍰" },
        { label: "Beverage", icon: "🥤" },
        { label: "Appetizer", icon: "🥟" }
    ];

    // Filter dishes by Category, Restaurant, and Search Query
    const visibleFoods = foods.filter((food) => {
        const matchesCategory = category === "All" || (food.category && food.category.toLowerCase() === category.toLowerCase());
        const matchesRestaurant = !selectedRestaurantId || (food.restaurant && food.restaurant.id === selectedRestaurantId);
        const matchesSearch = !searchQuery.trim() ||
            (food.foodName && food.foodName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (food.category && food.category.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesRestaurant && matchesSearch;
    });

    // Compute cart total
    const total = cart.reduce((sum, item) => {
        const itemPrice = item.totalPrice || (item.food?.price ? item.food.price * item.quantity : 0);
        return sum + Number(itemPrice);
    }, 0);

    const cartTotalCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

    const showToast = (msg) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(""), 3500);
    };

    const handleAddToCart = (food) => {
        if (!isSignedIn || !userId) {
            navigate("/login");
            return;
        }

        CartService.addToCart(food.id, userId, 1)
            .then(() => {
                CartService.getUserCart(userId).then(({ data }) => {
                    setCart(data || []);
                    showToast(`Added "${food.foodName}" to cart!`);
                });
            })
            .catch(() => {
                showToast("Could not add dish to cart. Please try again.");
            });
    };

    const handleUpdateQuantity = (cartItem, newQty) => {
        if (newQty <= 0) {
            handleRemoveItem(cartItem.id);
            return;
        }

        CartService.updateCart(cartItem.id, cartItem.food.id, userId, newQty)
            .then(() => {
                CartService.getUserCart(userId).then(({ data }) => setCart(data || []));
            })
            .catch(() => showToast("Could not update item quantity."));
    };

    const handleRemoveItem = (cartId) => {
        CartService.removeFromCart(cartId)
            .then(() => {
                setCart((prev) => prev.filter((item) => item.id !== cartId));
                showToast("Dish removed from cart.");
            })
            .catch(() => showToast("Could not remove item."));
    };

    const handleClearCart = () => {
        if (!userId) return;
        CartService.clearCart(userId)
            .then(() => {
                setCart([]);
                showToast("Cart emptied.");
            })
            .catch(() => showToast("Could not clear cart."));
    };

    const handleCheckoutSuccess = () => {
        setCart([]);
        showToast("Your order was placed successfully!");
    };

    return (
        <div className="browse-layout">
            <Navbar
                cartCount={cartTotalCount}
                onOpenCart={() => setIsCartOpen(!isCartOpen)}
                onOpenAi={() => setIsAiOpen(true)}
            />

            {actionMessage && <div className="modern-toast">{actionMessage}</div>}

            <main className="browse-main-content">
                {/* Browse Header & Search */}
                <div className="browse-hero-bar">
                    <div className="browse-title-area">
                        <h1>Discover Local Menus</h1>
                        <p>Fresh, crafted dishes from passionate community kitchens nearby.</p>
                    </div>

                    <div className="browse-search-wrapper">
                        <span className="search-symbol">🔍</span>
                        <input
                            type="text"
                            placeholder="Search dishes, ingredients, or cuisines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-search-btn"
                                onClick={() => setSearchQuery("")}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter by Kitchen Horizontal Strip */}
                <section className="kitchen-filter-section">
                    <div className="kitchen-filter-header">
                        <span className="filter-title">Select Kitchen</span>
                        {selectedRestaurantId && (
                            <button
                                type="button"
                                className="reset-filter-link"
                                onClick={() => setSelectedRestaurantId(null)}
                            >
                                Clear filter
                            </button>
                        )}
                    </div>

                    <div className="kitchen-chips-scroll">
                        <button
                            type="button"
                            className={`modern-kitchen-chip ${selectedRestaurantId === null ? "active" : ""}`}
                            onClick={() => setSelectedRestaurantId(null)}
                        >
                            <span className="chip-avatar-all">✦</span>
                            <div className="chip-text">
                                <strong>All Kitchens</strong>
                                <small>Full Menu</small>
                            </div>
                        </button>

                        {restaurants.map((rest) => (
                            <button
                                type="button"
                                className={`modern-kitchen-chip ${selectedRestaurantId === rest.id ? "active" : ""}`}
                                key={rest.id}
                                onClick={() =>
                                    setSelectedRestaurantId(
                                        selectedRestaurantId === rest.id ? null : rest.id
                                    )
                                }
                            >
                                <div className="chip-avatar">
                                    {rest.restaurantName?.charAt(0) || "R"}
                                </div>
                                <div className="chip-text">
                                    <strong>{rest.restaurantName}</strong>
                                    <small>{rest.city} • ★ {rest.rating || 4.7}</small>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Categories Tab Bar */}
                <div className="modern-category-tabs">
                    {categories.map((cat) => (
                        <button
                            type="button"
                            key={cat.label}
                            className={`cat-pill ${category === cat.label ? "active" : ""}`}
                            onClick={() => setCategory(cat.label)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Food Grid */}
                {isLoading && (
                    <div className="loading-card-state">
                        <div className="pulse-spinner"></div>
                        <p>Loading fresh neighborhood dishes...</p>
                    </div>
                )}

                {error && <div className="error-alert-banner">{error}</div>}

                {!isLoading && !error && (
                    <section className="food-listing-section">
                        <div className="results-count-bar">
                            <span>Showing <strong>{visibleFoods.length}</strong> delicious dishes</span>
                            <button
                                type="button"
                                className="ai-assist-inline-btn"
                                onClick={() => setIsAiOpen(true)}
                            >
                                <span>✦</span> Ask AI for Recommendations
                            </button>
                        </div>

                        <div className="modern-food-grid">
                            {visibleFoods.map((food) => (
                                <article className="elevated-food-card" key={food.id}>
                                    <div
                                        className="card-media-wrapper"
                                        style={{
                                            backgroundImage: `url(${food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"})`
                                        }}
                                    >
                                        <div className="card-top-badges">
                                            <span className="badge-category">{food.category || "Dish"}</span>
                                            {food.restaurant && (
                                                <span className="badge-restaurant">
                                                    {food.restaurant.restaurantName}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-content-wrapper">
                                        <div className="card-titles">
                                            <h3>{food.foodName}</h3>
                                            <p>{food.description || "Freshly crafted with authentic ingredients."}</p>
                                        </div>

                                        <div className="card-action-bar">
                                            <div className="price-display">
                                                <span className="currency">₹</span>
                                                <span className="amount">{Number(food.price || 0).toFixed(0)}</span>
                                            </div>

                                            <button
                                                type="button"
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(food)}
                                                title={`Add ${food.foodName} to order`}
                                            >
                                                <span>+ Add</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {visibleFoods.length === 0 && (
                            <div className="empty-results-box">
                                <span className="empty-emoji">🔍</span>
                                <h3>No matching dishes found</h3>
                                <p>Try adjusting your search query or selecting a different category.</p>
                                <button
                                    type="button"
                                    className="btn-outline-reset"
                                    onClick={() => {
                                        setCategory("All");
                                        setSelectedRestaurantId(null);
                                        setSearchQuery("");
                                    }}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* Slide-Up / Floating Modern Cart Drawer */}
            <aside className={`modern-cart-sheet ${isCartOpen ? "open" : ""}`}>
                <div className="cart-sheet-header">
                    <div>
                        <h2>Your Order</h2>
                        <span className="cart-item-count">{cartTotalCount} items selected</span>
                    </div>
                    <div className="cart-header-actions">
                        {cart.length > 0 && (
                            <button type="button" className="btn-clear-cart" onClick={handleClearCart}>
                                Empty Cart
                            </button>
                        )}
                        <button type="button" className="btn-close-sheet" onClick={() => setIsCartOpen(false)}>
                            ✕
                        </button>
                    </div>
                </div>

                <div className="cart-sheet-body">
                    {cart.length === 0 ? (
                        <div className="cart-empty-placeholder">
                            <span className="empty-cart-icon">🛒</span>
                            <h3>Your cart is empty</h3>
                            <p>Select delicious dishes from local kitchens to build your order.</p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map((item) => {
                                const dishName = item.food?.foodName || "Selected dish";
                                const unitPrice = item.food?.price || (item.totalPrice / (item.quantity || 1)) || 0;
                                return (
                                    <div className="modern-cart-row" key={item.id}>
                                        <div className="cart-row-details">
                                            <strong>{dishName}</strong>
                                            <span className="unit-cost">₹{Number(unitPrice).toFixed(0)} each</span>
                                        </div>

                                        <div className="modern-stepper">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item, (item.quantity || 1) - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="stepper-val">{item.quantity || 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item, (item.quantity || 1) + 1)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="cart-row-right">
                                            <strong className="row-total">
                                                ₹{Number(item.totalPrice || unitPrice * (item.quantity || 1)).toFixed(2)}
                                            </strong>
                                            <button
                                                type="button"
                                                className="btn-delete-row"
                                                onClick={() => handleRemoveItem(item.id)}
                                                title="Remove"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-sheet-footer">
                        <div className="bill-breakdown">
                            <div className="bill-row">
                                <span>Estimated Delivery</span>
                                <span className="free-badge">FREE</span>
                            </div>
                            <div className="bill-row grand-total">
                                <span>Total Amount</span>
                                <strong>₹{total.toFixed(2)}</strong>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="checkout-primary-cta"
                            onClick={() => setIsCheckoutOpen(true)}
                        >
                            Proceed to Checkout • ₹{total.toFixed(2)} <span>→</span>
                        </button>
                    </div>
                )}
            </aside>

            {/* Floating Quick Cart Pill when Sheet is Closed */}
            {!isCartOpen && cart.length > 0 && (
                <button
                    type="button"
                    className="floating-cart-bar"
                    onClick={() => setIsCartOpen(true)}
                >
                    <div className="floating-cart-left">
                        <span className="float-badge">{cartTotalCount}</span>
                        <span>View Order</span>
                    </div>
                    <strong className="float-total">₹{total.toFixed(2)} →</strong>
                </button>
            )}

            {/* AI Assistant Modal */}
            <AiAssistantModal
                isOpen={isAiOpen}
                onClose={() => setIsAiOpen(false)}
                onAddToCart={(dish) => {
                    handleAddToCart(dish);
                    setIsAiOpen(false);
                }}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cartItems={cart}
                totalAmount={total}
                userId={userId}
                onSuccess={handleCheckoutSuccess}
            />
        </div>
    );
}

export default Browse;
