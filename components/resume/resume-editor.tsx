"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { PersonalInfoSection } from "./sections/personal-info-section"
import { ExperienceSection } from "./sections/experience-section"
import { EducationSection } from "./sections/education-section"
import { SkillsSection } from "./sections/skills-section"
import { SectionSidebar } from "./section-sidebar"
import { PreviewModal } from "./preview-modal"

interface Resume {
  id: string
  title: string
  template_id: string
  is_published: boolean
  created_at: string
  updated_at: string
}

interface ResumeSection {
  id: string
  resume_id: string
  section_type: string
  title: string | null
  content: any
  order_index: number
}

interface ResumeEditorProps {
  resume: Resume
  sections: ResumeSection[]
}

export function ResumeEditor({ resume: initialResume, sections: initialSections }: ResumeEditorProps) {
  const [resume, setResume] = useState(initialResume)
  const [sections, setSections] = useState(initialSections)
  const [activeSection, setActiveSection] = useState("personal_info")
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const supabase = createClient()

  const getJobContext = () => {
    const personalInfo = getSectionContent("personal_info")
    const experienceContent = getSectionContent("experience")

    // Try to get job title from most recent experience
    let jobTitle = ""
    let industry = ""

    if (experienceContent?.items?.length > 0) {
      const mostRecentJob = experienceContent.items[0]
      jobTitle = mostRecentJob.jobTitle || ""
      industry = mostRecentJob.company || ""
    }

    return { jobTitle, industry }
  }

  const updateResumeTitle = async (newTitle: string) => {
    setResume({ ...resume, title: newTitle })

    const { error } = await supabase.from("resumes").update({ title: newTitle }).eq("id", resume.id)

    if (error) {
      console.error("Error updating resume title:", error)
    }
  }

  const saveSection = async (sectionType: string, content: any, title?: string) => {
    setIsSaving(true)
    try {
      // Find existing section or create new one
      const existingSection = sections.find((s) => s.section_type === sectionType)

      if (existingSection) {
        // Update existing section
        const { error } = await supabase
          .from("resume_sections")
          .update({
            content,
            title: title || existingSection.title,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSection.id)

        if (error) {
          console.error("Error updating section:", error)
          return
        }

        // Update local state
        setSections(sections.map((s) => (s.id === existingSection.id ? { ...s, content, title: title || s.title } : s)))
      } else {
        // Create new section
        const { data: newSection, error } = await supabase
          .from("resume_sections")
          .insert({
            resume_id: resume.id,
            section_type: sectionType,
            title,
            content,
            order_index: sections.length,
          })
          .select()
          .single()

        if (error) {
          console.error("Error creating section:", error)
          return
        }

        // Update local state
        setSections([...sections, newSection])
      }
    } catch (error) {
      console.error("Error saving section:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getSectionContent = (sectionType: string) => {
    const section = sections.find((s) => s.section_type === sectionType)
    return section?.content || {}
  }

  const renderActiveSection = () => {
    const { jobTitle, industry } = getJobContext()

    switch (activeSection) {
      case "personal_info":
        return (
          <PersonalInfoSection
            content={getSectionContent("personal_info")}
            onSave={(content) => saveSection("personal_info", content, "Personal Information")}
            jobTitle={jobTitle}
            industry={industry}
          />
        )
      case "experience":
        return (
          <ExperienceSection
            content={getSectionContent("experience")}
            onSave={(content) => saveSection("experience", content, "Work Experience")}
          />
        )
      case "education":
        return (
          <EducationSection
            content={getSectionContent("education")}
            onSave={(content) => saveSection("education", content, "Education")}
          />
        )
      case "skills":
        return (
          <SkillsSection
            content={getSectionContent("skills")}
            onSave={(content) => saveSection("skills", content, "Skills")}
            jobTitle={jobTitle}
            industry={industry}
          />
        )
      default:
        return <div>Section not found</div>
    }
  }

  const getResumeData = () => {
    return {
      personalInfo: getSectionContent("personal_info"),
      experience: getSectionContent("experience"),
      education: getSectionContent("education"),
      skills: getSectionContent("skills"),
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Input
                  value={resume.title}
                  onChange={(e) => updateResumeTitle(e.target.value)}
                  className="text-lg font-semibold border-none shadow-none p-0 h-auto bg-transparent"
                  placeholder="Resume Title"
                />
                <Badge variant={resume.is_published ? "default" : "secondary"}>
                  {resume.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SectionSidebar activeSection={activeSection} onSectionChange={setActiveSection} sections={sections} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeSection.replace("_", " ")}</CardTitle>
              </CardHeader>
              <CardContent>{renderActiveSection()}</CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resumeData={getResumeData()}
        resumeId={resume.id}
        resumeTitle={resume.title}
      />
    </div>
  )
}
