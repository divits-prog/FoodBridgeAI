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

        e.preventDefault();

        const credentials = {
            email: email,
            password: password
        };

        setError("");
        setIsSubmitting(true);
        UserService.loginUser(credentials)
            .then(({ data }) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("fullName", data.fullName || "Food lover");
                localStorage.setItem("email", data.email || email);
                localStorage.setItem("role", data.role || "USER");
                navigate("/browse");
            })
            .catch(() => setError("We couldn't sign you in with those details."))
            .finally(() => setIsSubmitting(false));
    };


    return (

        <main className="auth-page">
            <section className="auth-panel">
                <Link className="brand" to="/">FoodBridge<span>AI</span></Link>
                <p className="eyebrow">WELCOME BACK</p>
                <h1>Your next favorite meal is waiting.</h1>
                <p className="auth-copy">Sign in to discover local kitchens and order something worth staying in for.</p>
                <form className="form-stack" onSubmit={handleLogin}>
                    <label>Email<input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
                    <label>Password<input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                    {error && <p className="form-error">{error}</p>}
                    <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</button>
                </form>
                <p className="switch-auth">New to FoodBridge? <Link to="/register">Create an account</Link></p>
            </section>
            <aside className="auth-aside"><span>01 / 03</span><strong>Good food<br />travels farther.</strong><p>One bridge between thoughtful cooks and hungry people.</p></aside>
        </main>
    );
}

export default Login;