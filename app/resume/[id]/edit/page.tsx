import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResumeEditor } from "@/components/resume/resume-editor"

interface ResumeEditPageProps {
  params: {
    id: string
  }
}

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch the resume
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (resumeError || !resume) {
    redirect("/dashboard")
  }

  // Fetch resume sections
  const { data: sections, error: sectionsError } = await supabase
    .from("resume_sections")
    .select("*")
    .eq("resume_id", params.id)
    .order("order_index", { ascending: true })

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError)
  }

  return <ResumeEditor resume={resume} sections={sections || []} />
}
