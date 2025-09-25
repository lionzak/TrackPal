"use client";
import React, { useEffect, useState } from "react";
import { getWeeklyProgress } from "@/utils/HelperFunc";
import { supabase } from "@/lib/supabaseClient";
import { WeeklyGoal } from "@/types";

const WeeklyProgressBar: React.FC<{ goals: WeeklyGoal[] }> = ({goals}) => {
    const [progress, setProgress] = useState(0);

    const fetchProgress = async () => {
        const { completed, total } = await getWeeklyProgress();
        if (total > 0) {
            setProgress(Math.round((completed / total) * 100));
        } else {
            setProgress(0);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchProgress();

        // Use a single channel for both tables
        const channel = supabase
            .channel("weekly-progress")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "weekly_goal_tasks" },
                () => {
                    fetchProgress();
                }
            )
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "weekly_goals" },
                () => {
                    fetchProgress();
                }
            )
            .subscribe((status) => {
            });

        return () => {
            supabase.removeChannel(channel);
            channel.unsubscribe();
        };

    }, [goals]);

    return (
        <div>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sm mt-1">{progress}% completed</p>
        </div>
    );
};

export default WeeklyProgressBar;