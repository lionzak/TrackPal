import { redirect } from "next/navigation";
import App from "@/components/App";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { UserMetadata } from "@supabase/supabase-js";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("name, email")
    .eq("id", session.user.id)
    .single();

  const displayName =
    profile?.name || (session.user.user_metadata as UserMetadata  )?.name || session.user.email;

  return <App displayName={displayName} />;
}
