import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ cartCount = 0, onOpenCart, onOpenAi }) {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const isSignedIn = Boolean(token && token !== "null");
    const role = localStorage.getItem("role") || "USER";
    const fullName = localStorage.getItem("fullName") || "Food lover";
    const firstName = fullName.split(" ")[0];

    const handleSignOut = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <header className="navbar-container">
            <div className="navbar-inner">
                <Link className="brand-logo" to="/">
                    <span className="brand-icon">🍲</span>
                    <span className="brand-title">FoodBridge</span>
                    <span className="brand-ai-badge">AI</span>
                </Link>

                <nav className="nav-menu">
                    <Link
                        to="/browse"
                        className={`nav-item ${location.pathname === "/browse" ? "active" : ""}`}
                    >
                        Explore Menu
                    </Link>
                    {isSignedIn && (
                        <Link
                            to="/orders"
                            className={`nav-item ${location.pathname === "/orders" ? "active" : ""}`}
                        >
                            My Orders
                        </Link>
                    )}
                    {isSignedIn && role === "ADMIN" && (
                        <Link
                            to="/admin"
                            className={`nav-item admin-tab ${location.pathname === "/admin" ? "active" : ""}`}
                        >
                            <span>⚙</span> Admin Portal
                        </Link>
                    )}
                </nav>

                <div className="nav-right-actions">
                    <button
                        type="button"
                        className="ai-sparkle-button"
                        onClick={onOpenAi}
                        title="Open FoodBridge AI Culinary Assistant"
                    >
                        <span className="sparkle-icon">✦</span>
                        <span className="ai-btn-text">Ask AI</span>
                    </button>

                    {isSignedIn ? (
                        <>
                            {onOpenCart && (
                                <button
                                    type="button"
                                    className="modern-cart-pill"
                                    onClick={onOpenCart}
                                    aria-label="View Cart"
                                >
                                    <span className="cart-icon">🛒</span>
                                    <span className="cart-label">Cart</span>
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </button>
                            )}

                            <div className="user-profile-chip" title={`Signed in as ${fullName} (${role})`}>
                                <div className="user-initial">{firstName.charAt(0)}</div>
                                <span className="user-firstname">{firstName}</span>
                                {role === "ADMIN" && <span className="admin-chip">Admin</span>}
                            </div>

                            <button type="button" className="modern-signout-btn" onClick={handleSignOut} title="Sign Out">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <div className="auth-nav-buttons">
                            <Link className="btn-secondary-nav" to="/login">
                                Sign In
                            </Link>
                            <Link className="btn-primary-nav" to="/register">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
