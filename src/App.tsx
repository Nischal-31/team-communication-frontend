import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {

    const [authenticated, setAuthenticated] =
        useState(
            Boolean(
                localStorage.getItem("token")
            )
        );

    function logout() {
        localStorage.removeItem("token");
        setAuthenticated(false);
    }

    if (!authenticated) {
        return (
            <LoginPage
                onLogin={() =>
                    setAuthenticated(true)
                }
            />
        );
    }

    return (
        <DashboardPage
            onLogout={logout}
        />
    );
}