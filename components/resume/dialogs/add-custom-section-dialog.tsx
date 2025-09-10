"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileText,
  Award,
  Heart,
  Lightbulb,
  Code,
  Users,
  Globe,
} from "lucide-react";

interface AddCustomSectionDialogProps {
  onAddSection: (sectionType: string, title: string, template: string) => void;
  children?: React.ReactNode;
}

const customSectionTemplates = [
  {
    id: "projects",
    label: "Projects",
    icon: Code,
    description: "Showcase your personal or professional projects",
    template: {
      items: [
        {
          id: "1",
          name: "",
          description: "",
          technologies: "",
          url: "",
          github: "",
          startDate: "",
          endDate: "",
        },
      ],
    },
  },
  {
    id: "certifications",
    label: "Certifications",
    icon: Award,
    description: "Display your professional certifications",
    template: {
      items: [
        {
          id: "1",
          name: "",
          issuer: "",
          date: "",
          expiryDate: "",
          credentialId: "",
          url: "",
        },
      ],
    },
  },
  {
    id: "achievements",
    label: "Achievements & Awards",
    icon: Award,
    description: "Highlight your accomplishments and awards",
    template: {
      items: [
        {
          id: "1",
          title: "",
          description: "",
          date: "",
          issuer: "",
        },
      ],
    },
  },
  {
    id: "volunteer",
    label: "Volunteer Experience",
    icon: Heart,
    description: "Show your community involvement",
    template: {
      items: [
        {
          id: "1",
          organization: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    },
  },
  {
    id: "languages",
    label: "Languages",
    icon: Globe,
    description: "List your language proficiencies",
    template: {
      languages: [
        {
          id: "1",
          language: "",
          proficiency: "",
        },
      ],
    },
  },
  {
    id: "interests",
    label: "Interests & Hobbies",
    icon: Heart,
    description: "Share your personal interests",
    template: {
      interests: [],
    },
  },
  {
    id: "publications",
    label: "Publications",
    icon: FileText,
    description: "List your published works",
    template: {
      items: [
        {
          id: "1",
          title: "",
          publication: "",
          date: "",
          authors: "",
          url: "",
        },
      ],
    },
  },
  {
    id: "custom",
    label: "Custom Section",
    icon: Lightbulb,
    description: "Create a completely custom section",
    template: {
      items: [
        {
          id: "1",
          title: "",
          description: "",
        },
      ],
    },
  },
];

export function AddCustomSectionDialog({
  onAddSection,
  children,
}: AddCustomSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const handleAddSection = () => {
    if (!selectedTemplate) return;

    const template = customSectionTemplates.find(
      (t) => t.id === selectedTemplate
    );
    if (!template) return;

    const title = customTitle || template.label;
    const sectionType =
      selectedTemplate === "custom" ? `custom_${Date.now()}` : selectedTemplate;

    onAddSection(sectionType, title, template.template);

    // Reset form
    setSelectedTemplate("");
    setCustomTitle("");
    setOpen(false);
  };

  const selectedTemplateData = customSectionTemplates.find(
    (t) => t.id === selectedTemplate
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="bg-transparent" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Custom Section</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Type</Label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a section type" />
              </SelectTrigger>
              <SelectContent>
                {customSectionTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{template.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedTemplateData && (
              <p className="text-sm text-muted-foreground">
                {selectedTemplateData.description}
              </p>
            )}
          </div>

          {selectedTemplate && (
            <div className="space-y-2">
              <Label>Section Title (Optional)</Label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={
                  selectedTemplateData?.label || "Enter section title"
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use the default title
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSection} disabled={!selectedTemplate}>
              Add Section
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
