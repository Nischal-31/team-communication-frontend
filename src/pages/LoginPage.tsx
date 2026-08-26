import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

interface Props {
    onLogin: () => void;
}

export default function LoginPage({
    onLogin
}: Props) {

    const [registering, setRegistering] =
        useState(false);

    return (
        <div className="login-page">

            {registering ? (
                <RegisterForm
                    onRegistered={() =>
                        setRegistering(false)
                    }
                />
            ) : (
                <LoginForm
                    onLogin={onLogin}
                />
            )}

            <button
                type="button"
                className="auth-switch"
                onClick={() =>
                    setRegistering(
                        !registering
                    )
                }
            >
                {registering
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Create one"}
            </button>

        </div>
    );
}