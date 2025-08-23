import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResumeGrid } from "@/components/dashboard/resume-grid";
import { CreateResumeCard } from "@/components/dashboard/create-resume-card";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("Dashboard - User:", user?.id, "Error:", error?.message);

  if (error || !user) {
    console.log("Redirecting to login - no user or error");
    redirect("/auth/login");
  }

  // Fetch user's resumes
  const { data: resumes, error: resumesError } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (resumesError) {
    console.error("Error fetching resumes:", resumesError);
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  console.log(
    "Dashboard - Profile:",
    profile?.id,
    "Resumes count:",
    resumes?.length
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-600">
            Create and manage your professional resumes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CreateResumeCard />
          <ResumeGrid resumes={resumes || []} />
        </div>
      </main>
    </div>
  );
}
