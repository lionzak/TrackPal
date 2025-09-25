import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    console.log("Fetching all users...");
    const { data: users } = await supabase.from("profiles").select("*");
    console.log("Users fetched:", users?.length);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay()); // Sunday
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6); // Saturday

    console.log(
      "Week range:",
      thisWeekStart.toISOString(),
      "-",
      thisWeekEnd.toISOString()
    );

    for (const user of users || []) {
      console.log(`Processing user: ${user.id}`);

      const { data: weeklyGoals } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", thisWeekStart.toISOString())
        .lte("created_at", thisWeekEnd.toISOString());

      console.log(`User ${user.id} weekly goals:`, weeklyGoals);

      const allCompleted =
        weeklyGoals &&
        weeklyGoals.length > 0 &&
        weeklyGoals.every((goal) => goal.state === "done");
        console.log(`User ${user.id} all goals completed:`, allCompleted);

      if (allCompleted) {
        const newStreak = (user.weekly_streak_count || 0) + 1;
        const newLongest = Math.max(newStreak, user.weekly_longest_streak || 0);

        console.log(`User ${user.id} streak incremented:`, {
          newStreak,
          newLongest,
        });

        await supabase
          .from("profiles")
          .update({
            weekly_streak_count: newStreak,
            weekly_longest_streak: newLongest,
            weekly_last_streak_updated: new Date().toISOString(),
          })
          .eq("id", user.id);

        console.log(`User ${user.id} profile updated for streak.`);
      } else {
        console.log(`User ${user.id} streak reset to 0.`);

        await supabase
          .from("profiles")
          .update({
            weekly_streak_count: 0,
            weekly_last_streak_updated: new Date().toISOString(),
          })
          .eq("id", user.id);

        console.log(`User ${user.id} profile updated for streak reset.`);
      }
    }

    console.log("Weekly streaks updated for all users.");
    return NextResponse.json({
      message: "Weekly streaks updated successfully!",
    });
  } catch (error) {
    console.error("Error updating streaks:", error);
    return NextResponse.json(
      { message: "Error updating streaks", error },
      { status: 500 }
    );
  }
}
