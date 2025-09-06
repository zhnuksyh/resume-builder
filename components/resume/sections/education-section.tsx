"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, List, Hash } from "lucide-react";
import { AIAssistant } from "@/components/resume/ai-assistant";

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

interface EducationContent {
  items: EducationItem[];
}

interface EducationSectionProps {
  content: EducationContent;
  onSave: (content: EducationContent) => void;
  onChange?: (formData: EducationContent) => void;
  jobTitle?: string;
  industry?: string;
}

export function EducationSection({
  content,
  onSave,
  onChange,
  jobTitle,
  industry,
}: EducationSectionProps) {
  const [formData, setFormData] = useState<EducationContent>({ items: [] });

  useEffect(() => {
    setFormData(content.items ? content : { items: [] });
  }, [content]);

  const addEducation = () => {
    const newEducation: EducationItem = {
      id: Date.now().toString(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    };
    const newFormData = { items: [...formData.items, newEducation] };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const updateEducation = (
    id: string,
    field: keyof EducationItem,
    value: string
  ) => {
    const newFormData = {
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeEducation = (id: string) => {
    const newFormData = {
      items: formData.items.filter((item) => item.id !== id),
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAISuggestion = (educationId: string, suggestion: string) => {
    updateEducation(educationId, "description", suggestion);
  };

  const formatAsBulletPoints = (educationId: string) => {
    const education = formData.items.find((item) => item.id === educationId);
    if (!education || !education.description) return;

    const lines = education.description
      .split("\n")
      .filter((line) => line.trim());
    const bulletPoints = lines
      .map((line) => {
        const trimmed = line.trim();
        // If already a bullet point, keep as is
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          return trimmed;
        }
        // If it's a numbered list, remove the number and add bullet
        if (/^\d+\./.test(trimmed)) {
          const match = trimmed.match(/^\d+\.\s*(.*)/);
          return match ? `• ${match[1]}` : `• ${trimmed}`;
        }
        // Otherwise, add bullet point
        return `• ${trimmed}`;
      })
      .join("\n");

    updateEducation(educationId, "description", bulletPoints);
  };

  const formatAsNumberedList = (educationId: string) => {
    const education = formData.items.find((item) => item.id === educationId);
    if (!education || !education.description) return;

    const lines = education.description
      .split("\n")
      .filter((line) => line.trim());
    const numberedList = lines
      .map((line, index) => {
        const trimmed = line.trim();
        // If already numbered, keep as is
        if (/^\d+\./.test(trimmed)) {
          return trimmed;
        }
        // If it's a bullet point, remove the bullet and add number
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          return `${index + 1}. ${trimmed.substring(1).trim()}`;
        }
        // Otherwise, add number
        return `${index + 1}. ${trimmed}`;
      })
      .join("\n");

    updateEducation(educationId, "description", numberedList);
  };

  return (
    <div className="space-y-6">
      {formData.items.map((education, index) => (
        <Card key={education.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(education.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  value={education.degree}
                  onChange={(e) =>
                    updateEducation(education.id, "degree", e.target.value)
                  }
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>School *</Label>
                <Input
                  value={education.school}
                  onChange={(e) =>
                    updateEducation(education.id, "school", e.target.value)
                  }
                  placeholder="University of California"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={education.location}
                  onChange={(e) =>
                    updateEducation(education.id, "location", e.target.value)
                  }
                  placeholder="Berkeley, CA"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updateEducation(education.id, "gpa", e.target.value)
                  }
                  placeholder="3.8"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={education.startDate}
                  onChange={(e) =>
                    updateEducation(education.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={education.endDate}
                  onChange={(e) =>
                    updateEducation(education.id, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Additional Details (Optional)</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsBulletPoints(education.id)}
                    className="h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsNumberedList(education.id)}
                    className="h-8 px-2"
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={education.description || ""}
                onChange={(e) =>
                  updateEducation(education.id, "description", e.target.value)
                }
                placeholder="Relevant coursework, honors, activities..."
                rows={3}
              />
            </div>
            {education.degree && (
              <AIAssistant
                sectionType="education"
                currentContent={education.description || ""}
                jobTitle={jobTitle}
                industry={industry}
                onApplySuggestion={(suggestion) =>
                  handleAISuggestion(education.id, suggestion)
                }
              />
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addEducation}
        variant="outline"
        className="w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Education</Button>
      </div>
    </div>
  );
}
