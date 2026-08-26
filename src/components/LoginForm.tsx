import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../Services/api";

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({
    onLogin
}: LoginFormProps) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login(
                username.trim(),
                password
            );

            localStorage.setItem(
                "token",
                response.token
            );

            onLogin();

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            className="login-card"
            onSubmit={handleSubmit}
        >

            <div className="logo">
                TC
            </div>

            <div>
                <h1>Welcome back</h1>

                <p className="subtitle">
                    Sign in to Team Communication
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="username">
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    placeholder="Enter your username"
                    autoComplete="username"
                    disabled={loading}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                />
            </div>

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={
                    loading ||
                    !username.trim() ||
                    !password
                }
            >
                {loading
                    ? "Signing in..."
                    : "Sign in"}
            </button>

        </form>
    );
}