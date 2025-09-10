"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistant } from "@/components/resume/ai-assistant";
import { List, Hash } from "lucide-react";

interface PersonalInfoContent {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  summary?: string;
}

interface PersonalInfoSectionProps {
  content: PersonalInfoContent;
  onSave: (content: PersonalInfoContent) => void;
  onChange?: (formData: PersonalInfoContent) => void;
  jobTitle?: string;
  industry?: string;
}

export function PersonalInfoSection({
  content,
  onSave,
  onChange,
  jobTitle,
  industry,
}: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState<PersonalInfoContent>(content);

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleChange = (field: keyof PersonalInfoContent, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAISuggestion = (suggestion: string) => {
    const newFormData = { ...formData, summary: suggestion };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const formatAsBulletPoints = () => {
    if (!formData.summary) return;

    const lines = formData.summary.split("\n").filter((line) => line.trim());
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

    const newFormData = { ...formData, summary: bulletPoints };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const formatAsNumberedList = () => {
    if (!formData.summary) return;

    const lines = formData.summary.split("\n").filter((line) => line.trim());
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

    const newFormData = { ...formData, summary: numberedList };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://johndoe.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatAsBulletPoints}
                className="h-8 px-2"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={formatAsNumberedList}
                className="h-8 px-2"
              >
                <Hash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Textarea
            id="summary"
            value={formData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Write a brief summary of your professional background and key achievements..."
            rows={4}
          />
        </div>

        <AIAssistant
          sectionType="summary"
          currentContent={formData.summary || ""}
          jobTitle={jobTitle}
          industry={industry}
          onApplySuggestion={handleAISuggestion}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Personal Information</Button>
      </div>
    </div>
  );
}
