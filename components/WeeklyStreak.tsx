"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface StreakStats {
  weekly_streak_count: number;
  weekly_longest_streak: number;
}

const MAX_STREAK_DISPLAY = 10; // Adjust as needed

export const WeeklyStreak = () => {
  const [streak, setStreak] = useState<StreakStats | null>(null);

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("weekly_streak_count, weekly_longest_streak")
        .eq("id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (data) setStreak(data);
      if (error) console.error(error);
    };

    fetchStreak();
  }, []);

  if (!streak) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="animate-pulse text-gray-500">Loading streak...</span>
      </div>
    );
  }

  const progress =
    Math.min(streak.weekly_streak_count, MAX_STREAK_DISPLAY) / MAX_STREAK_DISPLAY * 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-full mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">🔥</span>
        <div>
          <h2 className="text-xl font-bold">
            Current Weekly Streak
          </h2>
          <p className="text-gray-600">
            {streak.weekly_streak_count} week{streak.weekly_streak_count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Longest Streak</span>
          <span>
            {streak.weekly_longest_streak} week{streak.weekly_longest_streak !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-yellow-400 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex gap-1 mt-2 justify-between">
        {Array.from({ length: MAX_STREAK_DISPLAY }).map((_, i) => (
          <span
            key={i}
            className={`inline-block w-4 h-4 rounded-full ${
              i < streak.weekly_streak_count ? "bg-yellow-400" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};