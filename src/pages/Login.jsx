import { useState } from "react";
import { api } from "../services/api";

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            let data;

            if (isRegister) {
                // Register
                data = await api.register({
                    name,
                    email,
                    password,
                });
            } else {
                // Login
                data = await api.login({
                    email,
                    password,
                });
            }

            // Save authentication data
            localStorage.setItem(
                "learnflow_token",
                data.token
            );

            localStorage.setItem(
                "learnflow_user",
                JSON.stringify(data.user)
            );

            // Update application state
            onLogin(data.user);

        } catch (err) {
            setError(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Logo */}
                <div className="auth-logo">

                    <div className="auth-logo-icon">
                        ✦
                    </div>

                    <h1>
                        LearnFlow AI
                    </h1>

                    <p>
                        Your intelligent learning companion
                    </p>

                </div>

                {/* Heading */}
                <div className="auth-heading">

                    <h2>
                        {isRegister
                            ? "Create your account"
                            : "Welcome back"}
                    </h2>

                    <p>
                        {isRegister
                            ? "Start your personalized learning journey."
                            : "Sign in to continue your learning journey."}
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name - Registration only */}
                    {isRegister && (
                        <div className="auth-field">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>
                    )}

                    {/* Email */}
                    <div className="auth-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Password */}
                    <div className="auth-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            minLength={6}
                        />

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Create Account"
                                : "Sign In"}
                    </button>

                </form>

                {/* Switch Login/Register */}
                <div className="auth-switch">

                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    <button
                        type="button"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError("");
                        }}
                    >
                        {isRegister
                            ? "Sign In"
                            : "Create Account"}
                    </button>

                </div>

            </div>

        </div>
    );
}