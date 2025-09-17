"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! You can now log in.");
      redirect("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form onSubmit={handleUpdate} className="space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="border p-4 rounded  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-green-600 transition w-full">
          Update Password
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
