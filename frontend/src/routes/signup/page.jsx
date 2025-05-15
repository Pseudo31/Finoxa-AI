import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { CircleAlertIcon } from "lucide-react";

import useAuthStore from "@/stores/auth-store";

const SignupPage = () => {
    const navigate = useNavigate();

    const { signup, status, message, isAuthenticated } = useAuthStore();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signup(user.name, user.email, user.password);
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Enter your information to create a new account</CardDescription>
                </CardHeader>
                <form
                    className="grid gap-y-4"
                    onSubmit={handleSubmit}
                >
                    <CardContent className="grid gap-y-4">
                        {status && (
                            <Alert variant={"destructive"}>
                                <CircleAlertIcon className="h-4 w-4" />
                                <AlertTitle className="capitalize">{status}</AlertTitle>
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid gap-y-2">
                            <Label htmlFor="fullName">Full name</Label>
                            <Input
                                id="fullName"
                                name="name"
                                placeholder="Enter your full name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            Sign up
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:underline underline-offset-4"
                            >
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignupPage;
