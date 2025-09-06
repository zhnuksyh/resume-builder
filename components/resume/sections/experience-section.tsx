"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, List, Hash } from "lucide-react";
import { AIAssistant } from "@/components/resume/ai-assistant";

interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceContent {
  items: ExperienceItem[];
}

interface ExperienceSectionProps {
  content: ExperienceContent;
  onSave: (content: ExperienceContent) => void;
  onChange?: (formData: ExperienceContent) => void;
}

export function ExperienceSection({
  content,
  onSave,
  onChange,
}: ExperienceSectionProps) {
  const [formData, setFormData] = useState<ExperienceContent>({ items: [] });

  useEffect(() => {
    setFormData(content.items ? content : { items: [] });
  }, [content]);

  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    const newFormData = { items: [...formData.items, newExperience] };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const updateExperience = (
    id: string,
    field: keyof ExperienceItem,
    value: string | boolean
  ) => {
    const newFormData = {
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const removeExperience = (id: string) => {
    const newFormData = {
      items: formData.items.filter((item) => item.id !== id),
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAISuggestion = (experienceId: string, suggestion: string) => {
    updateExperience(experienceId, "description", suggestion);
  };

  const formatAsBulletPoints = (experienceId: string) => {
    const experience = formData.items.find((item) => item.id === experienceId);
    if (!experience) return;

    const lines = experience.description
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

    updateExperience(experienceId, "description", bulletPoints);
  };

  const formatAsNumberedList = (experienceId: string) => {
    const experience = formData.items.find((item) => item.id === experienceId);
    if (!experience) return;

    const lines = experience.description
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

    updateExperience(experienceId, "description", numberedList);
  };

  return (
    <div className="space-y-6">
      {formData.items.map((experience, index) => (
        <Card key={experience.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(experience.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Title *</Label>
                <Input
                  value={experience.jobTitle}
                  onChange={(e) =>
                    updateExperience(experience.id, "jobTitle", e.target.value)
                  }
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={experience.company}
                  onChange={(e) =>
                    updateExperience(experience.id, "company", e.target.value)
                  }
                  placeholder="Tech Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) =>
                    updateExperience(experience.id, "location", e.target.value)
                  }
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) =>
                    updateExperience(experience.id, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateExperience(experience.id, "endDate", e.target.value)
                  }
                  disabled={experience.current}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onChange={(e) =>
                    updateExperience(experience.id, "current", e.target.checked)
                  }
                />
                <Label htmlFor={`current-${experience.id}`}>
                  Currently working here
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Job Description</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsBulletPoints(experience.id)}
                    className="h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsNumberedList(experience.id)}
                    className="h-8 px-2"
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={experience.description}
                onChange={(e) =>
                  updateExperience(experience.id, "description", e.target.value)
                }
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
            {experience.jobTitle && (
              <AIAssistant
                sectionType="experience"
                currentContent={experience.description}
                jobTitle={experience.jobTitle}
                onApplySuggestion={(suggestion) =>
                  handleAISuggestion(experience.id, suggestion)
                }
              />
            )}
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={addExperience}
        variant="outline"
        className="w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Experience</Button>
      </div>
    </div>
  );
}
