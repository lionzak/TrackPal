"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a reset link!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative">
      <Link
        href="/"
        className="absolute top-8 left-8 text-white  rounded px-3 py-2 hover:bg-blue-800 transition flex items-center"
      >
        &#8592; Back
      </Link>
      <form onSubmit={handleReset} className="space-y-4">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-4 rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-4 rounded hover:cursor-pointer hover:bg-blue-600 transition w-full">
          Send Reset Link
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
