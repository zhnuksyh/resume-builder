import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function ProfilePage() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      redirect("/auth/login");
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

    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader user={user} profile={profile} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Profile Settings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your account information and preferences.
                </p>
              </div>
              <ProfileForm user={user} profile={profile} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Profile page error:", error);
    redirect("/auth/login");
  }
}
