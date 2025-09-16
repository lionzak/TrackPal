"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push("/dashboard");
            }
        };
        checkSession();
    }, [router]);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Sign up without email confirmation
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: undefined, // disables magic link/redirect flow
                data: { name }, // still store in metadata
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        const user = data?.user;
        if (user) {
            // Insert into profiles table
            const { error: profileError } = await supabase.from("profiles").insert({
                id: user.id,
                email,
                name,
            });

            if (profileError) {
                console.error("Failed to insert profile:", profileError.message);
            }

            // Redirect after registration
            router.push("/dashboard");
        }

        setLoading(false);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative">
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-3xl font-bold text-white bg-blue-600 rounded-full px-8 py-3 shadow-md">
                        Register
                    </h1>
                    <p className="mt-3 text-gray-500 text-center text-sm">
                        Create your account to get started 🚀
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                placeholder="John Doe"
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="pl-10 block w-full border border-gray-300 rounded-lg p-3 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                placeholder="you@example.com"
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="pl-10 block w-full border border-gray-300 rounded-lg p-3 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                placeholder="********"
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="pl-10 block w-full border border-gray-300 rounded-lg p-3 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                placeholder="********"
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                required
                                className="pl-10 block w-full border border-gray-300 rounded-lg p-3 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="text-sm text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 font-medium hover:underline">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
