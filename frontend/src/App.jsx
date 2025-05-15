import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";

import useAuthStore from "./stores/auth-store";

import SignupPage from "./routes/signup/page";
import LoginPage from "./routes/login/page";
import Dashboard from "./routes/dashboard/page";

import { getCookie } from "./utils/get-cookie";
import { LoaderCircleIcon } from "lucide-react";

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};

function App() {
    const { checkAuth, isCheckingAuth } = useAuthStore();

    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/signup",
            element: (
                <RedirectAuthenticatedUser>
                    <SignupPage />
                </RedirectAuthenticatedUser>
            ),
        },
        {
            path: "/login",
            element: (
                <RedirectAuthenticatedUser>
                    <LoginPage />
                </RedirectAuthenticatedUser>
            ),
        },
    ]);

    useEffect(() => {
        const token = getCookie("token");

        checkAuth(token);
    }, [checkAuth]);

    if (isCheckingAuth) {
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <LoaderCircleIcon className="text-primary animate-spin" />
            </div>
        );
    }

    return <RouterProvider router={router} />;
}

export default App;
