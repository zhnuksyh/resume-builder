"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PersonalInfoSection } from "./sections/personal-info-section";
import { ExperienceSection } from "./sections/experience-section";
import { EducationSection } from "./sections/education-section";
import { SkillsSection } from "./sections/skills-section";
import { CustomSection } from "./sections/custom-section";
import { SectionTabs } from "./section-tabs";
import { PreviewModal } from "./preview-modal";
import { LivePreviewPanel } from "./live-preview-panel";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface ResumeSection {
  id: string;
  resume_id: string;
  section_type: string;
  title: string | null;
  content: any;
  order_index: number;
}

interface ResumeEditorProps {
  resume: Resume;
  sections: ResumeSection[];
}

export function ResumeEditor({
  resume: initialResume,
  sections: initialSections,
}: ResumeEditorProps) {
  const [resume, setResume] = useState(initialResume);
  const [sections, setSections] = useState(initialSections);
  const [activeSection, setActiveSection] = useState("personal_info");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const supabase = createClient();

  const getJobContext = () => {
    const personalInfo = getSectionContent("personal_info");
    const experienceContent = getSectionContent("experience");

    // Try to get job title from most recent experience
    let jobTitle = "";
    let industry = "";

    if (experienceContent?.items?.length > 0) {
      const mostRecentJob = experienceContent.items[0];
      jobTitle = mostRecentJob.jobTitle || "";
      industry = mostRecentJob.company || "";
    }

    return { jobTitle, industry };
  };

  const updateResumeTitle = async (newTitle: string) => {
    setResume({ ...resume, title: newTitle });

    const { error } = await supabase
      .from("resumes")
      .update({ title: newTitle })
      .eq("id", resume.id);

    if (error) {
      console.error("Error updating resume title:", error);
    }
  };

  const addCustomSection = async (title: string) => {
    const sectionType = `custom_${Date.now()}`;
    const content = { title, items: [] };

    try {
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
        .single();

      if (error) {
        console.error("Error creating custom section:", error);
        return;
      }

      // Update local state
      setSections([...sections, newSection]);

      // Switch to the new section
      setActiveSection(sectionType);
    } catch (error) {
      console.error("Error creating custom section:", error);
    }
  };

  const deleteCustomSection = async (sectionType: string) => {
    try {
      // Find the section to delete
      const sectionToDelete = sections.find(
        (s) => s.section_type === sectionType
      );
      if (!sectionToDelete) return;

      // Delete from database
      const { error } = await supabase
        .from("resume_sections")
        .delete()
        .eq("id", sectionToDelete.id);

      if (error) {
        console.error("Error deleting custom section:", error);
        return;
      }

      // Update local state
      const updatedSections = sections.filter(
        (s) => s.section_type !== sectionType
      );
      setSections(updatedSections);

      // If the deleted section was active, switch to personal info
      if (activeSection === sectionType) {
        setActiveSection("personal_info");
      }
    } catch (error) {
      console.error("Error deleting custom section:", error);
    }
  };

  const saveSection = async (
    sectionType: string,
    content: any,
    title?: string
  ) => {
    setIsSaving(true);
    try {
      // Find existing section or create new one
      const existingSection = sections.find(
        (s) => s.section_type === sectionType
      );

      if (existingSection) {
        // Update existing section
        const { error } = await supabase
          .from("resume_sections")
          .update({
            content,
            title: title || existingSection.title,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSection.id);

        if (error) {
          console.error("Error updating section:", error);
          return;
        }

        // Update local state
        setSections(
          sections.map((s) =>
            s.id === existingSection.id
              ? { ...s, content, title: title || s.title }
              : s
          )
        );
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
          .single();

        if (error) {
          console.error("Error creating section:", error);
          return;
        }

        // Update local state
        setSections([...sections, newSection]);
      }
    } catch (error) {
      console.error("Error saving section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionContent = (sectionType: string) => {
    const section = sections.find((s) => s.section_type === sectionType);
    return section?.content || {};
  };

  const renderActiveSection = () => {
    const { jobTitle, industry } = getJobContext();

    switch (activeSection) {
      case "personal_info":
        return (
          <PersonalInfoSection
            content={getSectionContent("personal_info")}
            onSave={(content) =>
              saveSection("personal_info", content, "Personal Information")
            }
            jobTitle={jobTitle}
            industry={industry}
          />
        );
      case "experience":
        return (
          <ExperienceSection
            content={getSectionContent("experience")}
            onSave={(content) =>
              saveSection("experience", content, "Work Experience")
            }
          />
        );
      case "education":
        return (
          <EducationSection
            content={getSectionContent("education")}
            onSave={(content) => saveSection("education", content, "Education")}
          />
        );
      case "skills":
        return (
          <SkillsSection
            content={getSectionContent("skills")}
            onSave={(content) => saveSection("skills", content, "Skills")}
            jobTitle={jobTitle}
            industry={industry}
          />
        );
      default:
        // Check if it's a custom section
        if (activeSection.startsWith("custom_")) {
          const section = sections.find(
            (s) => s.section_type === activeSection
          );
          if (section) {
            return (
              <CustomSection
                content={section.content}
                onSave={(content) => saveSection(activeSection, content)}
                onDelete={() => deleteCustomSection(activeSection)}
              />
            );
          }
        }
        return <div>Section not found</div>;
    }
  };

  const getResumeData = () => {
    const data: any = {
      personalInfo: getSectionContent("personal_info"),
      experience: getSectionContent("experience"),
      education: getSectionContent("education"),
      skills: getSectionContent("skills"),
    };

    // Add custom sections
    sections
      .filter((section) => section.section_type.startsWith("custom_"))
      .forEach((section) => {
        data[section.section_type] = section.content;
      });

    return data;
  };

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
              >
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
        {/* Section Tabs */}
        <SectionTabs
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sections={sections}
          onAddCustomSection={addCustomSection}
          onDeleteCustomSection={deleteCustomSection}
        />

        {/* Main Layout - Editor and Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="capitalize">
                    {activeSection.startsWith("custom_")
                      ? (() => {
                          const section = sections.find(
                            (s) => s.section_type === activeSection
                          );
                          if (section?.title) {
                            return section.title
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ");
                          }
                          return "Custom Section";
                        })()
                      : activeSection.replace("_", " ")}
                  </CardTitle>
                  {activeSection.startsWith("custom_") && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCustomSection(activeSection)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const section = sections.find(
                            (s) => s.section_type === activeSection
                          );
                          if (section) {
                            saveSection(activeSection, section.content);
                          }
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>{renderActiveSection()}</CardContent>
            </Card>
          </div>

          {/* Live Preview Panel - Hidden on mobile, visible on xl+ screens */}
          <div className="hidden xl:block xl:col-span-1">
            <LivePreviewPanel
              resumeData={getResumeData()}
              resumeId={resume.id}
              resumeTitle={resume.title}
            />
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
  );
}
