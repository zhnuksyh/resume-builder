import { createClient } from "@/lib/supabase/server";
import { PaginatedResumePreview } from "@/components/resume/paginated-resume-preview";
import { Button } from "@/components/ui/button";
import { PDFExport } from "@/components/resume/pdf-export";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ResumeSection {
  id: string;
  resume_id: string;
  section_type: string;
  title: string | null;
  content: any;
  order_index: number;
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Get user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return notFound();
  }

  // Get resume
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (resumeError || !resume) {
    return notFound();
  }

  // Get sections
  const { data: sections, error: sectionsError } = await supabase
    .from("resume_sections")
    .select("*")
    .eq("resume_id", id)
    .order("order_index");

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
  }

  // Transform sections data for preview
  const resumeData = {
    personalInfo:
      sections?.find((s: ResumeSection) => s.section_type === "personal_info")
        ?.content || {},
    experience: sections?.find(
      (s: ResumeSection) => s.section_type === "experience"
    )?.content || { items: [] },
    education: sections?.find(
      (s: ResumeSection) => s.section_type === "education"
    )?.content || { items: [] },
    skills: sections?.find((s: ResumeSection) => s.section_type === "skills")
      ?.content || { skills: [] },
  };

  // Add custom sections to resumeData
  sections?.forEach((section: ResumeSection) => {
    if (section.section_type.startsWith("custom_")) {
      resumeData[section.section_type] = section.content;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/resume/${id}/edit`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Editor
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-foreground">
                {resume.title} - Preview (A4)
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <PDFExport
                resumeId={id}
                resumeTitle={resume.title}
                colorTheme="purple"
                variant="outline"
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Preview Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <PaginatedResumePreview data={resumeData} colorTheme="purple" />
      </div>
    </div>
  );
}
