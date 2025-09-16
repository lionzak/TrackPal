"use client";

import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // redirect to login after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition hover:cursor-pointer"
    >
    <div className="flex space-x-2">
        <LogOut />
        <p>Logout</p>
    </div>
    </button>
  );
}
