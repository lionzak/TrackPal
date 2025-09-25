// app/api/notify/route.ts
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

// Initialize Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function GET() {
  try {
    // Validate environment variables
    console.log('GMAIL_EMAIL:', process.env.GMAIL_EMAIL);
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '[REDACTED]' : 'undefined');
    console.log('DEBUG_EMAIL:', process.env.DEBUG_EMAIL || 'undefined');
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials missing');
      return NextResponse.json({ error: 'Gmail configuration missing' }, { status: 500 });
    }
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase environment variables missing');
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }

    // Get today's and tomorrow's dates in YYYY-MM-DD format
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log(`Fetching goals with deadlines: ${todayStr}, ${tomorrowStr}`);

    // Fetch goals that are not done and have deadline today or tomorrow
    const { data: goals, error: goalsError } = await supabase
      .from('weekly_goals')
      .select('id, title, user_id, deadline, state')
      .neq('state', 'done')
      .not('deadline', 'is', null)
      .in('deadline', [todayStr, tomorrowStr]);

    if (goalsError) {
      console.error('Error fetching goals:', goalsError);
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
    }

    console.log(`Fetched ${goals?.length ?? 0} goals`);

    if (!goals || goals.length === 0) {
      console.log('No goals due today or tomorrow');
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

    console.log(`Grouped goals by user: ${Object.keys(goalsByUser).length} users`);

    // For each user, fetch email and send notification
    for (const user_id in goalsByUser) {
      const userGoals = goalsByUser[user_id];

      console.log(`Fetching email for user_id: ${user_id}`);

      // Fetch user email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user_id)
        .single();

      if (profileError || !profile || !profile.email) {
        console.error(`Error fetching email for user ${user_id}:`, profileError);
        continue;
      }

      const userEmail = profile.email.trim();
      console.log(`Fetched email for user ${user_id}: ${userEmail}`);

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        console.error(`Invalid email for user ${user_id}: ${userEmail}`);
        continue;
      }

      // Build email content
      let emailBody = 'Hi,\n\nYou have the following goals due soon:\n\n';
      userGoals.forEach((goal) => {
        emailBody += `- ${goal.title} (Deadline: ${goal.deadline})\n`;
      });
      emailBody += '\nBest regards,\nTrackPal Team';
      emailBody += `\n\nView your goals: ${process.env.NEXT_PUBLIC_SITE_URL}`;

      // Send email via Nodemailer
      const toEmail = process.env.DEBUG_EMAIL || userEmail;
      console.log(`Sending email to ${toEmail} for ${userGoals.length} goals`);
      try {
        const info = await transporter.sendMail({
          from: `"TrackPal" <${process.env.GMAIL_EMAIL}>`,
          to: toEmail, // Use toEmail instead of hardcoded email
          subject: 'Reminder: Your Goals Are Due Soon',
          text: emailBody,
          html: `
            <h2>Goal Reminder</h2>
            <p>Hi,</p>
            <p>You have the following goals due soon:</p>
            <ul>
              ${userGoals.map((goal) => `<li>${goal.title} (Deadline: ${goal.deadline})</li>`).join('')}
            </ul>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}">View your goals</a></p>
            <p>Best regards,<br>TrackPal Team</p>
          `,
        });
        console.log(`Email sent to ${toEmail}, Message ID: ${info.messageId}`);
      } catch (emailError) {
        console.error(`Error sending email to ${toEmail}:`, emailError);
      }

      console.log(`Notification processed for ${toEmail} with goals:`, userGoals);
    }

    console.log('All notifications processed');
    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}