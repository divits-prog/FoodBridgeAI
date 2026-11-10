import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FoodService from "../services/FoodService";
import AiAssistantModal from "../components/AiAssistantModal";

function Landing() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [heroQuery, setHeroQuery] = useState("");
    const token = localStorage.getItem("token");
    const isSignedIn = Boolean(token && token !== "null");

    useEffect(() => {
        Promise.all([
            FoodService.getRestaurants().catch(() => ({ data: [] })),
            FoodService.getFoods().catch(() => ({ data: [] }))
        ]).then(([restRes, foodRes]) => {
            setRestaurants(restRes.data || []);
            setFoods(foodRes.data || []);
        });
    }, []);

    const handleHeroAiSearch = (e) => {
        e.preventDefault();
        setIsAiOpen(true);
    };

    return (
        <div className="landing-wrapper">
            <Navbar onOpenAi={() => setIsAiOpen(true)} />

            {/* Hero Section */}
            <section className="modern-hero">
                <div className="hero-grid">
                    <div className="hero-text-col">
                        <div className="hero-pill-badge">
                            <span className="sparkle">✦</span>
                            <span>Neighborhood Food Meets Smart AI</span>
                        </div>

                        <h1 className="hero-headline">
                            Craving Something <span className="highlight-text">Delicious?</span><br />
                            Let AI Match Your Taste.
                        </h1>

                        <p className="hero-description">
                            Discover passionate neighborhood kitchens, wholesome home-style recipes,
                            and chef specials. Tell FoodBridge AI your mood, diet, or budget and get
                            instantly matched dishes.
                        </p>

                        {/* Interactive Hero AI Input Bar */}
                        <form className="hero-ai-search-card" onSubmit={handleHeroAiSearch}>
                            <span className="search-icon">✨</span>
                            <input
                                type="text"
                                placeholder="e.g. 'Spicy paneer dinner under ₹200' or 'Healthy grain bowl'..."
                                value={heroQuery}
                                onChange={(e) => setHeroQuery(e.target.value)}
                            />
                            <button type="submit" className="hero-search-btn">
                                Ask AI <span>↗</span>
                            </button>
                        </form>

                        <div className="hero-stats-row">
                            <div className="stat-pill">
                                <span className="stat-icon">⚡</span>
                                <div>
                                    <strong>30-40 min</strong>
                                    <small>Average Delivery</small>
                                </div>
                            </div>
                            <div className="stat-pill">
                                <span className="stat-icon">★</span>
                                <div>
                                    <strong>4.8 / 5.0</strong>
                                    <small>Community Rating</small>
                                </div>
                            </div>
                            <div className="stat-pill">
                                <span className="stat-icon">🌱</span>
                                <div>
                                    <strong>Zero Waste</strong>
                                    <small>Freshly Crafted</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual Right Side */}
                    <div className="hero-visual-col">
                        <div className="visual-card-stack">
                            <div className="main-featured-card">
                                <img
                                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
                                    alt="Specialty Dum Biryani"
                                    className="main-card-img"
                                />
                                <div className="card-badge-top">★ 4.9 Top Pick</div>
                                <div className="main-card-meta">
                                    <div className="card-dish-name">
                                        <h3>Hyderabadi Chicken Biryani</h3>
                                        <p>Food Paradise Kitchen • 1.2 km away</p>
                                    </div>
                                    <div className="card-price-pill">₹200</div>
                                </div>
                            </div>

                            <div className="floating-mini-card top-float">
                                <span className="mini-icon">🥗</span>
                                <div>
                                    <strong>Fresh Green Goddess Bowl</strong>
                                    <small>High Protein • Under ₹160</small>
                                </div>
                            </div>

                            <div className="floating-mini-card bottom-float">
                                <span className="mini-icon">🍕</span>
                                <div>
                                    <strong>Artisan Sourdough Pizza</strong>
                                    <small>The Rustic Oven • Handcrafted</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section-container">
                <div className="section-header-center">
                    <span className="sub-badge">SMART & SUSTAINABLE</span>
                    <h2>How FoodBridge AI Bridges Flavor & Community</h2>
                    <p>A fresh, intelligent way to discover food made right in your neighborhood.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-box orange-box">✨</div>
                        <h3>1. Share Your Craving</h3>
                        <p>Ask our AI assistant for anything—from spicy late-night comfort to calorie-conscious vegan bowls or specific budget caps.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-box purple-box">🧠</div>
                        <h3>2. Real-Time Menu Match</h3>
                        <p>FoodBridge AI connects directly with local kitchens to recommend exact dishes ready to be prepared, complete with match reasons.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-box green-box">🍲</div>
                        <h3>3. Fresh, Hot & Zero-Waste</h3>
                        <p>Dishes are crafted fresh upon your order, supporting independent cooks and minimizing commercial food waste.</p>
                    </div>
                </div>
            </section>

            {/* Featured Neighborhood Kitchens */}
            {restaurants.length > 0 && (
                <section className="section-container bg-white-rounded">
                    <div className="section-header-row">
                        <div>
                            <span className="sub-badge">LOCAL HEROES</span>
                            <h2>Neighborhood Kitchens</h2>
                        </div>
                        <Link to="/browse" className="link-arrow">
                            Explore all kitchens <span>→</span>
                        </Link>
                    </div>

                    <div className="kitchens-grid">
                        {restaurants.map((rest) => (
                            <div className="kitchen-card" key={rest.id}>
                                <div
                                    className="kitchen-cover-img"
                                    style={{
                                        backgroundImage: `url(${rest.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"})`
                                    }}
                                >
                                    <span className="kitchen-rating-tag">★ {rest.rating || 4.8}</span>
                                </div>
                                <div className="kitchen-info">
                                    <h3>{rest.restaurantName}</h3>
                                    <p className="kitchen-sub">{rest.city} • Local Partner Kitchen</p>
                                    <div className="kitchen-bottom-row">
                                        <span className="delivery-time-tag">⚡ 25-35 mins</span>
                                        <Link to="/browse" className="view-menu-btn">
                                            View Menu
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Trending Menu Preview */}
            {foods.length > 0 && (
                <section className="section-container">
                    <div className="section-header-row">
                        <div>
                            <span className="sub-badge">TODAY'S SELECTION</span>
                            <h2>Popular Dishes Made Nearby</h2>
                        </div>
                        <Link to="/browse" className="link-arrow">
                            See full menu ({foods.length}) <span>→</span>
                        </Link>
                    </div>

                    <div className="dish-cards-grid">
                        {foods.slice(0, 4).map((food) => (
                            <div className="modern-dish-card" key={food.id}>
                                <div
                                    className="dish-card-img"
                                    style={{
                                        backgroundImage: `url(${food.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"})`
                                    }}
                                >
                                    <span className="dish-category-pill">{food.category || "Specialty"}</span>
                                </div>
                                <div className="dish-card-body">
                                    <div className="dish-main-meta">
                                        <h4>{food.foodName}</h4>
                                        <p>{food.description || "Prepared fresh with hand-selected ingredients."}</p>
                                    </div>
                                    <div className="dish-card-footer">
                                        <strong className="dish-price">₹{Number(food.price).toFixed(0)}</strong>
                                        <Link to="/browse" className="order-pill-btn">
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="modern-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <span className="brand-icon">🍲</span>
                            <span className="brand-title">FoodBridge</span>
                            <span className="brand-ai-badge">AI</span>
                        </div>
                        <p>Bridging local kitchens with hungry neighbors through intelligent dining recommendations.</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-col">
                            <h4>Platform</h4>
                            <Link to="/browse">Explore Menu</Link>
                            <Link to="/orders">Order Tracking</Link>
                            <Link to="/admin">Partner Dashboard</Link>
                        </div>
                        <div className="footer-col">
                            <h4>AI Features</h4>
                            <a href="#ai" onClick={() => setIsAiOpen(true)}>Ask FoodBridge AI</a>
                            <a href="#meal-planning" onClick={() => setIsAiOpen(true)}>Smart Meal Planner</a>
                            <a href="#diet" onClick={() => setIsAiOpen(true)}>Dietary Matcher</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 FoodBridge AI Inc. All rights reserved.</span>
                    <span>Crafted for community kitchens & food lovers.</span>
                </div>
            </footer>

            {/* AI Assistant Modal */}
            <AiAssistantModal
                isOpen={isAiOpen}
                onClose={() => setIsAiOpen(false)}
                onAddToCart={(dish) => {
                    setIsAiOpen(false);
                    navigate("/browse");
                }}
            />
        </div>
    );
}

export default Landing;
