import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        if (e) e.preventDefault();

        const credentials = {
            email: email.trim(),
            password: password
        };

        setError("");
        setIsSubmitting(true);
        UserService.loginUser(credentials)
            .then(({ data }) => {
                if (!data.token) {
                    setError(data.message || "Invalid email or password.");
                    return;
                }
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", String(data.userId));
                localStorage.setItem("fullName", data.fullName || "Food lover");
                localStorage.setItem("email", data.email || email);
                localStorage.setItem("role", data.role || "USER");

                if (data.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/browse");
                }
            })
            .catch((err) => {
                const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response?.data : null);
                setError(msg || "Invalid email or password. Please try again.");
            })
            .finally(() => setIsSubmitting(false));
    };

    const fillDemo = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setError("");
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
                    <h2>Welcome Back</h2>
                    <p>Sign in to discover local kitchens and order your favorite dishes.</p>
                </div>

                <div className="demo-credentials-box">
                    <span className="demo-hint-title">⚡ Quick Sign-In (Demo Credentials):</span>
                    <div className="demo-chips-cluster">
                        <button
                            type="button"
                            className="demo-pill-btn"
                            onClick={() => fillDemo("divit@gmail.com", "password123")}
                        >
                            <span className="role-tag-pill green">Customer</span>
                            <span>divit@gmail.com</span>
                        </button>
                        <button
                            type="button"
                            className="demo-pill-btn"
                            onClick={() => fillDemo("test123@gmail.com", "admin123")}
                        >
                            <span className="role-tag-pill orange">Admin</span>
                            <span>test123@gmail.com</span>
                        </button>
                    </div>
                </div>

                <form className="auth-form-fields" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-alert-banner">{error}</div>}

                    <button className="auth-submit-btn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign In to Your Account"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    New to FoodBridge? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
