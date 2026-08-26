import { useState } from "react";
import type { FormEvent } from "react";
import { createUser } from "../Services/api";

interface Props {
    onRegistered: () => void;
}

export default function RegisterForm({
    onRegistered
}: Props) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            await createUser({
                username: username.trim(),
                email: email.trim(),
                password
            });

            onRegistered();

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed."
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
                <h1>Create account</h1>

                <p className="subtitle">
                    Join Team Communication
                </p>
            </div>

            <div className="form-group">

                <label htmlFor="register-username">
                    Username
                </label>

                <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                        setUsername(
                            event.target.value
                        )
                    }
                    placeholder="Choose a username"
                    disabled={loading}
                    required
                />

            </div>

            <div className="form-group">

                <label htmlFor="register-email">
                    Email
                </label>

                <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                    placeholder="you@example.com"
                    disabled={loading}
                    required
                />

            </div>

            <div className="form-group">

                <label htmlFor="register-password">
                    Password
                </label>

                <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(
                            event.target.value
                        )
                    }
                    placeholder="Create a password"
                    disabled={loading}
                    required
                />

            </div>

            <div className="form-group">

                <label htmlFor="register-confirm">
                    Confirm password
                </label>

                <input
                    id="register-confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.target.value
                        )
                    }
                    placeholder="Repeat your password"
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
                    !email.trim() ||
                    !password ||
                    !confirmPassword
                }
            >
                {loading
                    ? "Creating..."
                    : "Create account"}
            </button>

        </form>
    );
}