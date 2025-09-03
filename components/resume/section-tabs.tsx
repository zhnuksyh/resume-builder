"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Trash2,
} from "lucide-react";
import { AddCustomSectionDialog } from "./add-custom-section-dialog";

interface ResumeSection {
  id: string;
  section_type: string;
  title: string | null;
  content: any;
}

interface SectionTabsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: ResumeSection[];
  onAddCustomSection?: (title: string) => void;
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

export function SectionTabs({
  activeSection,
  onSectionChange,
  sections,
  onAddCustomSection,
  onDeleteCustomSection,
}: SectionTabsProps) {
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
    <div className="w-full">
      <Tabs
        value={activeSection}
        onValueChange={onSectionChange}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TabsList className="flex w-auto bg-white border flex-wrap">
              {sectionConfig.map((section) => {
                const Icon = section.icon;
                const status = getSectionStatus(section.id);

                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                    <span className="sm:hidden">
                      {section.label.split(" ")[0]}
                    </span>
                    {section.required && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        Required
                      </Badge>
                    )}
                    <div className="ml-2">
                      {status === "completed" && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                      {status === "empty" && (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </div>
                  </TabsTrigger>
                );
              })}

              {/* Custom Sections - Inside the same TabsList */}
              {sections
                .filter((section) => section.section_type.startsWith("custom_"))
                .map((section) => {
                  const status = getSectionStatus(section.section_type);
                  const sectionTitle = section.title || "Custom Section";

                  return (
                    <div key={section.section_type} className="relative group">
                      <TabsTrigger
                        value={section.section_type}
                        className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 bg-white border pr-8"
                      >
                        <span className="hidden sm:inline">{sectionTitle}</span>
                        <span className="sm:hidden">
                          {sectionTitle.split(" ")[0]}
                        </span>
                        <div className="ml-2">
                          {status === "completed" && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          {status === "empty" && (
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          )}
                        </div>
                      </TabsTrigger>
                      {onDeleteCustomSection && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomSection(section.section_type);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
            </TabsList>
          </div>

          {onAddCustomSection && (
            <AddCustomSectionDialog onAddSection={onAddCustomSection} />
          )}
        </div>
      </Tabs>
    </div>
  );
}
