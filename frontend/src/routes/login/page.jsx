import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { CircleAlertIcon } from "lucide-react";

import useAuthStore from "@/stores/auth-store";

const LoginPage = () => {
    const navigate = useNavigate();

    const { login, isAuthenticated } = useAuthStore();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await login(user.email, user.password);
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Log in</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form
                    className="grid gap-y-4"
                    onSubmit={handleSubmit}
                >
                    <CardContent className="grid gap-y-4">
                        <div className="grid gap-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                placeholder="Enter your password"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                        >
                            Log in
                        </Button>
                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-primary hover:underline underline-offset-4"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;
