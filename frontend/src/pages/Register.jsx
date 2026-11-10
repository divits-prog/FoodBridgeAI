import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

function Register() {
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "USER"
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        UserService.registerUser(user)
            .then(() => {
                navigate("/login");
            })
            .catch((err) => {
                const msg = err.response?.data?.message || err.response?.data || "That email may already be registered.";
                setError(typeof msg === "string" ? msg : "Registration failed. Please try again.");
            })
            .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="auth-modern-wrapper">
            <div className="auth-floating-card">
                <div className="auth-card-top">
                    <Link className="brand-logo centered-brand" to="/">
                        <span className="brand-icon">🍲</span>
                        <span className="brand-title">FoodBridge</span>
                        <span className="brand-ai-badge">AI</span>
                    </Link>
                    <h2>Create an Account</h2>
                    <p>Join FoodBridge AI to explore artisanal meals and local kitchens.</p>
                </div>

                <form className="auth-form-fields" onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Alex Morgan"
                            value={user.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="At least 6 characters"
                            value={user.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>I want to join as:</label>
                        <select
                            name="role"
                            value={user.role}
                            onChange={handleChange}
                            className="role-selector-input"
                        >
                            <option value="USER">Customer (Order & Taste)</option>
                            <option value="ADMIN">Kitchen Partner / Administrator</option>
                        </select>
                    </div>

                    {error && <div className="error-alert-banner">{error}</div>}

                    <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Complete Registration"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
