import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FoodService from "./services/FoodService";
import CartService from "./services/CartService";
import OrderService from "./services/OrderService";
import "./App.css";
import "./index.css";

function Landing() {
    const navigate = useNavigate();
    const isSignedIn = Boolean(localStorage.getItem("token"));
    return <main className="landing-page">
        <nav className="topbar"><Link className="brand" to="/">FoodBridge<span>AI</span></Link><div className="nav-actions">{isSignedIn ? <button className="text-button" onClick={() => navigate("/browse")}>Open menu <span>↗</span></button> : <><Link className="text-button" to="/login">Sign in</Link><Link className="nav-cta" to="/register">Join FoodBridge <span>↗</span></Link></>}</div></nav>
        <section className="landing-hero"><div className="hero-copy"><p className="eyebrow">FOOD, WITH A LITTLE MORE HEART</p><h1>Good food.<br /><em>Better bridges.</em></h1><p>Discover local kitchens, thoughtful dishes, and the people who make your neighborhood taste like home.</p><Link className="primary-button hero-button" to={isSignedIn ? "/browse" : "/register"}>{isSignedIn ? "Explore the menu" : "Find your table"} <span>↗</span></Link></div><div className="hero-art"><div className="art-card art-main"><span>Today's table</span><strong>Made for<br />sharing.</strong><small>Freshly prepared · Nearby</small></div><div className="art-note">✦ <span>Local kitchens<br />you'll love</span></div><div className="art-stamp">EST.<br /><b>2026</b></div></div></section>
        <section className="landing-foot"><span>01 / A better way to eat local</span><span>Scroll to discover <b>↓</b></span><span>Thoughtful food, made close</span></section>
    </main>;
}

function Browse() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);
    const [cart, setCart] = useState([]);
    const [category, setCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const name = localStorage.getItem("fullName") || "Food lover";
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/login", { replace: true }); return; }
        Promise.all([FoodService.getRestaurants(), FoodService.getFoods(), userId ? CartService.getUserCart(userId) : Promise.resolve({ data: [] })]).then(([restaurantResponse, foodResponse, cartResponse]) => {
            setRestaurants(restaurantResponse.data); setFoods(foodResponse.data);
            setCart(cartResponse.data || []);
        }).catch(() => setError("We couldn't load the menu. Make sure the backend is running on port 8080.")).finally(() => setIsLoading(false));
    }, [navigate, userId]);
    const categories = ["All", ...new Set(foods.map((food) => food.category).filter(Boolean))];
    const visibleFoods = category === "All" ? foods : foods.filter((food) => food.category === category);
    const total = cart.reduce((sum, food) => sum + Number(food.price || 0), 0);
    const signOut = () => { localStorage.clear(); navigate("/"); };
    const addToCart = (food) => {
        setActionError("");
        CartService.addToCart(food.id, userId).then(({ data }) => setCart((current) => [...current, data])).catch(() => setActionError("That dish could not be added to your cart."));
    };
    const checkout = () => {
        if (!cart.length || !userId) return;
        setIsCheckingOut(true); setActionError("");
        OrderService.createOrder(userId, total).then(() => { setCart([]); }).catch(() => setActionError("Your order could not be created. Please try again.")).finally(() => setIsCheckingOut(false));
    };
    return <main className="browse-page">
        <nav className="topbar browse-nav"><Link className="brand" to="/">FoodBridge<span>AI</span></Link><div className="welcome">Good to see you, <strong>{name.split(" ")[0]}</strong></div><button className="cart-button" onClick={() => document.querySelector(".cart-drawer")?.scrollIntoView({ behavior: "smooth" })}>Cart <b>{cart.length}</b></button><button className="signout" onClick={signOut}>Sign out</button></nav>
        <section className="browse-intro"><div><p className="eyebrow">YOUR LOCAL TABLE</p><h1>What's calling<br /><em>your name?</em></h1></div><p>Browse dishes made nearby<br />and bring something beautiful home.</p></section>
        <section className="restaurant-strip"><div className="section-label">Restaurants <span>{restaurants.length}</span></div>{restaurants.slice(0, 4).map((restaurant) => <article className="restaurant-chip" key={restaurant.id}><div className="restaurant-avatar">{restaurant.restaurantName?.charAt(0) || "R"}</div><div><strong>{restaurant.restaurantName}</strong><small>{restaurant.city || "Local kitchen"} · ★ {restaurant.rating || "New"}</small></div></article>)}{restaurants.length === 0 && !isLoading && <p className="muted">Restaurants will appear here once added by an admin.</p>}</section>
        <section className="menu-section"><div className="menu-heading"><div><p className="eyebrow">THE MENU</p><h2>Made nearby</h2></div><div className="category-tabs">{categories.map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item || "Other"}</button>)}</div></div>{isLoading && <div className="loading-state">Preparing the menu...</div>}{error && <div className="error-state">{error}</div>} {!isLoading && !error && <div className="food-grid">{visibleFoods.map((food) => <article className="food-card" key={food.id}><div className="food-image" style={{ backgroundImage: `url(${food.imageUrl || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80"})` }}><span>{food.category || "Dish"}</span></div><div className="food-info"><div><h3>{food.foodName}</h3><p>{food.description || "Prepared with care by a local kitchen."}</p></div><div className="food-bottom"><strong>${Number(food.price || 0).toFixed(2)}</strong><button aria-label={`Add ${food.foodName} to cart`} onClick={() => addToCart(food)}>+</button></div></div></article>)}{visibleFoods.length === 0 && <p className="muted">No dishes in this category yet.</p>}</div>}</section>
        <aside className="cart-drawer"><div><span className="eyebrow">YOUR ORDER</span><h2>On the bridge <span>{cart.length}</span></h2></div>{actionError && <p className="error-state">{actionError}</p>}{cart.length === 0 ? <p className="muted">Your cart is waiting for something delicious.</p> : <><div className="cart-lines">{cart.slice(-3).map((food, index) => <div className="cart-line" key={`${food.id}-${index}`}><span>{food.foodName}</span><b>${Number(food.price || 0).toFixed(2)}</b></div>)}</div><div className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><button className="primary-button checkout-button" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? "Creating order..." : "Create order"} <span>↗</span></button></>}</aside>
    </main>;
}

function App() { return <BrowserRouter><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/browse" element={<Browse />} /></Routes></BrowserRouter>; }
export default App;
