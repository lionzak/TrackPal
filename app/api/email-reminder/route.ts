import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Goal {
  id: number;
  title: string;
  deadline: string;
  user_id: string;
}

interface User {
  id: string;
  email: string;
}

export async function GET() {
  try {
    // 1. Fetch goals
    const { data: goals, error: goalsError } = await supabase
      .from("weekly_goals")
      .select("id, title, deadline, user_id");

    if (goalsError) throw goalsError;
    if (!goals) return NextResponse.json({ message: "No goals found" });

    // 2. Fetch all users (id + email)
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, email");

    if (usersError) throw usersError;
    if (!users) return NextResponse.json({ message: "No users found" });

    const userMap: Record<string, string> = {};
    for (const user of users as User[]) {
      userMap[user.id] = user.email;
    }

    const today = new Date();
    let sent = 0;

    // 3. Loop through goals and send reminders
    for (const goal of goals as Goal[]) {
      const email = userMap[goal.user_id];
      if (!email) continue;

      const deadline = new Date(goal.deadline);
      const diffDays = Math.ceil(
        (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 2 && diffDays >= 0) {
        await resend.emails.send({
          from: "TrackPal <reminder@yourdomain.com>",
          to: email,
          subject: "⏰ Reminder: Your goal deadline is near",
          text: `Your goal "${goal.title}" is due in ${diffDays} day(s). Keep going!`,
        });
        sent++;
      }
    }

    return NextResponse.json({ message: `✅ Sent ${sent} reminders` });
  } catch (err: any) {
    console.error("Email reminder error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
