import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useState } from "react";
import axios from "axios";
const authUrl = import.meta.env.VITE_AUTH_HOST!;

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordType, setPasswordType] = useState("password");

    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [passwordConfirmType, setPasswordConfirmType] = useState("password");

    const [error, setError] = useState<string>("");

    const handleTogglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
        } else {
            setPasswordType("password");
        }
    };

    const handleTogglePasswordConfirm = () => {
        if (passwordConfirmType === "password") {
            setPasswordConfirmType("text");
        } else {
            setPasswordConfirmType("password");
        }
    };

    const handleLocalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== passwordConfirm) {
            setPasswordConfirm("");
            setError("passwords did not match");
        }
        try {
            await axios.post(
                `${authUrl}/local/register`,
                {
                    username,
                    email,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                },
            );
            // Success case
            window.location.href = "/weather";
        } catch (err: any) {
            if (err.response) {
                // Server responded with error status
                setError(err.response.data.msg || "Login failed");
            } else if (err.request) {
                setError("Network error. Please try again.");
            } else {
                // Other error
                setError("An unexpected error occurred.");
            }
        }
    };
    return (
        <form method="POST" onSubmit={handleLocalSubmit}>
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Welcome back</CardTitle>
                        <CardDescription>
                            Sign up with your Google account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* form for sending user sign up data */}
                        <div className="grid gap-4">
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full bg-muted border-4 border-blue-300"
                                    onClick={() => {
                                        window.location.href = `${authUrl}/google/register`; // Your backend OAuth route
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign up with Google
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                            </div>
                            <div className="grid gap-6">
                                {error && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {error}
                                    </p>
                                )}
                                <div className="grid gap-3">
                                    <Label htmlFor="username">username</Label>
                                    <Input
                                        id="username"
                                        type="username"
                                        placeholder="devKhoi"
                                        minLength={2}
                                        maxLength={14}
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            minLength={6}
                                            maxLength={20}
                                            id="password"
                                            type={passwordType}
                                            name="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                        <span
                                            className="absolute  right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                                            onClick={handleTogglePassword}
                                        >
                                            {passwordType === "text" ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password-confirm">
                                            Confirm Password
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            minLength={6}
                                            maxLength={20}
                                            id="password-confirm"
                                            type="password"
                                            name="password-confirm"
                                            value={passwordConfirm}
                                            onChange={(e) =>
                                                setPasswordConfirm(
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <span
                                            className="absolute  right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                                            onClick={
                                                handleTogglePasswordConfirm
                                            }
                                        >
                                            {passwordConfirmType === "text" ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                >
                                    Sign up
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
            </div>
        </form>
    );
}
