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
            .then(() => navigate("/login"))
            .catch(() => setError("That email may already be registered."))
            .finally(() => setIsSubmitting(false));
    };


    return (

        <main className="auth-page">
            <section className="auth-panel">
                <Link className="brand" to="/">FoodBridge<span>AI</span></Link>
                <p className="eyebrow">JOIN THE TABLE</p>
                <h1>Make room for better food.</h1>
                <p className="auth-copy">Create your account and find the people putting care back into every plate.</p>
                <form className="form-stack" onSubmit={handleRegister}>
                    <label>Full name<input type="text" name="fullName" placeholder="Alex Morgan" value={user.fullName} onChange={handleChange} required /></label>
                    <label>Email<input type="email" name="email" placeholder="you@example.com" value={user.email} onChange={handleChange} required /></label>
                    <label>Password<input type="password" name="password" placeholder="At least 8 characters" value={user.password} onChange={handleChange} minLength="8" required /></label>
                    {error && <p className="form-error">{error}</p>}
                    <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
                </form>
                <p className="switch-auth">Already have an account? <Link to="/login">Sign in</Link></p>
            </section>
            <aside className="auth-aside register-aside"><span>02 / 03</span><strong>Local flavor.<br />Shared freely.</strong><p>Every order helps a neighborhood kitchen grow.</p></aside>
        </main>
    );
}

export default Register;