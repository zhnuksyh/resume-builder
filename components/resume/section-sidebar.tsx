"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  FileText,
  Trash2,
} from "lucide-react";
import { AddCustomSectionDialog } from "./add-custom-section-dialog";

interface ResumeSection {
  id: string;
  section_type: string;
  title: string | null;
  content: any;
}

interface SectionSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: ResumeSection[];
  onAddCustomSection: (title: string) => void;
  onDeleteCustomSection?: (sectionType: string) => void;
}

const sectionConfig = [
  {
    id: "personal_info",
    label: "Personal Info",
    icon: User,
    required: true,
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    required: false,
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    required: false,
  },
  {
    id: "skills",
    label: "Skills",
    icon: Wrench,
    required: false,
  },
];

export function SectionSidebar({
  activeSection,
  onSectionChange,
  sections,
  onAddCustomSection,
  onDeleteCustomSection,
}: SectionSidebarProps) {
  const getSectionStatus = (sectionId: string) => {
    const section = sections.find((s) => s.section_type === sectionId);
    if (!section) return "empty";

    const content = section.content;
    if (!content || Object.keys(content).length === 0) return "empty";

    // Check if section has meaningful content
    if (sectionId === "personal_info") {
      return content.fullName || content.email ? "completed" : "empty";
    }

    if (sectionId === "experience" || sectionId === "education") {
      return content.items && content.items.length > 0 ? "completed" : "empty";
    }

    if (sectionId === "skills") {
      return content.skills && content.skills.length > 0
        ? "completed"
        : "empty";
    }

    // For custom sections, check if they have items
    if (sectionId.startsWith("custom_")) {
      return content.items && content.items.length > 0 ? "completed" : "empty";
    }

    return "completed";
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Resume Sections</h3>
          <AddCustomSectionDialog onAddSection={onAddCustomSection} />
        </div>
        <div className="space-y-2">
          {sectionConfig.map((section) => {
            const Icon = section.icon;
            const status = getSectionStatus(section.id);
            const isActive = activeSection === section.id;

            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary dark:hover:text-primary transition-all duration-200 ${
                  isActive
                    ? "bg-primary/30 text-purple-900 border border-primary/50 shadow-sm dark:bg-primary/30 dark:text-primary dark:border-primary/60 dark:shadow-lg"
                    : ""
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                    {section.required && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-purple-100 text-purple-800 border border-purple-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20 hover:bg-purple-200 dark:hover:bg-primary/20 transition-colors"
                      >
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "completed" && (
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                    )}
                    {status === "empty" && (
                      <div className="w-2 h-2 bg-muted-foreground/40 dark:bg-muted-foreground/60 rounded-full" />
                    )}
                  </div>
                </div>
              </Button>
            );
          })}

          {/* Custom Sections */}
          {sections
            .filter((section) => section.section_type.startsWith("custom_"))
            .map((section) => {
              const status = getSectionStatus(section.section_type);
              const isActive = activeSection === section.section_type;
              const sectionTitle = section.title || "Custom Section";

              return (
                <div key={section.section_type} className="relative group">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3 pr-12"
                    onClick={() => onSectionChange(section.section_type)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{sectionTitle}</span>
                        <Badge variant="outline" className="text-xs">
                          Custom
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "completed" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {status === "empty" && (
                          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                        )}
                      </div>
                    </div>
                  </Button>
                  {onDeleteCustomSection && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomSection(section.section_type);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
