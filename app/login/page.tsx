"use client";

import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
      toast.success("Logged in successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-white bg-blue-600 rounded-full px-8 py-3 shadow-md">
            Login
          </h1>
          <p className="mt-3 text-gray-500 text-center text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;