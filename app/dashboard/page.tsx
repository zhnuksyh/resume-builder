import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResumeGrid } from "@/components/dashboard/resume-grid";
import { CreateResumeCard } from "@/components/dashboard/create-resume-card";

export default async function DashboardPage() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("Dashboard - User:", user?.id, "Error:", error?.message);

    if (error) {
      console.error("Auth error:", error);
      redirect("/auth/login");
    }

    if (!user) {
      console.log("No user found, redirecting to login");
      redirect("/auth/login");
    }

    // Fetch user's resumes
    const { data: resumes, error: resumesError } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    // Fetch the most recently updated section for each resume
    let resumesWithLastChanged = resumes || [];
    if (resumes && resumes.length > 0) {
      const resumeIds = resumes.map((r) => r.id);

      // Get the most recently updated section for each resume
      const { data: lastChangedSections, error: sectionsError } = await supabase
        .from("resume_sections")
        .select("resume_id, section_type, title, updated_at")
        .in("resume_id", resumeIds)
        .order("updated_at", { ascending: false });

      if (!sectionsError && lastChangedSections) {
        // Group sections by resume_id and get the most recent one for each
        const lastChangedByResume = lastChangedSections.reduce(
          (acc, section) => {
            if (!acc[section.resume_id]) {
              acc[section.resume_id] = section;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // Add last changed info to resumes
        resumesWithLastChanged = resumes.map((resume) => ({
          ...resume,
          last_changed_section: lastChangedByResume[resume.id] || null,
        }));
      }
    }

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
      <div className="min-h-screen bg-background">
        <DashboardHeader user={user} profile={profile} />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Resumes
            </h1>
            <p className="text-muted-foreground">
              Create and manage your professional resumes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CreateResumeCard />
            <ResumeGrid resumes={resumesWithLastChanged} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/auth/login");
  }
}
