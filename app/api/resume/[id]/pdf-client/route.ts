import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get resume
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Get sections
    const { data: sections, error: sectionsError } = await supabase
      .from("resume_sections")
      .select("*")
      .eq("resume_id", id)
      .order("order_index")

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError)
    }

    // Transform sections data
    const resumeData = {
      personalInfo: sections?.find((s: any) => s.section_type === "personal_info")?.content || {},
      experience: sections?.find((s: any) => s.section_type === "experience")?.content || { items: [] },
      education: sections?.find((s: any) => s.section_type === "education")?.content || { items: [] },
      skills: sections?.find((s: any) => s.section_type === "skills")?.content || { skills: [] },
    }

    return NextResponse.json({
      resumeData,
      title: resume.title,
    })
  } catch (error) {
    console.error("PDF data fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch resume data" }, { status: 500 })
  }
}
