// app/api/notify/route.ts

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // Get today's and tomorrow's dates in YYYY-MM-DD format
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Fetch goals that are not done and have deadline today or tomorrow
    const { data: goals, error: goalsError } = await supabase
      .from('weekly_goals')
      .select('id, title, user_id, deadline, state')
      .neq('state', 'done') // Filter for not-started or in-progress
      .not('deadline', 'is', null)
      .in('deadline', [todayStr, tomorrowStr]);

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }

    if (!goals || goals.length === 0) {
      return NextResponse.json({ message: 'No goals due today or tomorrow' });
    }

    // Group goals by user_id
    const goalsByUser: { [user_id: string]: typeof goals } = {};
    goals.forEach((goal) => {
      if (!goalsByUser[goal.user_id]) {
        goalsByUser[goal.user_id] = [];
      }
      goalsByUser[goal.user_id].push(goal);
    });

    // For each user, fetch email and send notification if they have goals
    for (const user_id in goalsByUser) {
      const userGoals = goalsByUser[user_id];

      // Fetch user email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user_id)
        .single();

      if (profileError || !profile || !profile.email) {
        console.error(`Error fetching email for user ${user_id}:`, profileError);
        continue; // Skip if no email found
      }

      const userEmail = profile.email;

      // Build email content (plain text for simplicity)
      let emailBody = 'Hi,\n\nYou have the following goals due soon:\n\n';
      userGoals.forEach((goal) => {
        emailBody += `- ${goal.title} (Deadline: ${goal.deadline})\n`;
      });
      emailBody += '\nBest regards,\nYour App Team';

      // Send email via Resend
      try {
        await resend.emails.send({
          from: 'notifications@yourdomain.com', // Replace with your verified Resend sender email
          to: userEmail,
          subject: 'Reminder: Your Goals Are Due Soon',
          text: emailBody,
        });
      } catch (emailError) {
        console.error(`Error sending email to ${userEmail}:`, emailError);
      }
    }

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}