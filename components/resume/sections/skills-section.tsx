"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { AIAssistant } from "@/components/resume/ai-assistant";

interface SkillsContent {
  skills: string[];
}

interface SkillsSectionProps {
  content: SkillsContent;
  onSave: (content: SkillsContent) => void;
  onChange?: (formData: SkillsContent) => void;
  jobTitle?: string;
  industry?: string;
}

export function SkillsSection({
  content,
  onSave,
  onChange,
  jobTitle,
  industry,
}: SkillsSectionProps) {
  const [formData, setFormData] = useState<SkillsContent>({ skills: [] });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setFormData({
      skills: content.skills || [],
    });
  }, [content]);

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const newFormData = { skills: [...formData.skills, newSkill.trim()] };
      setFormData(newFormData);
      setNewSkill("");
      onChange?.(newFormData);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newFormData = {
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAISuggestion = (suggestion: string) => {
    const newSkills = suggestion
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill && !formData.skills.includes(skill));
    const newFormData = { skills: [...formData.skills, ...newSkills] };
    setFormData(newFormData);
    onChange?.(newFormData);
  };

  const suggestedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "Git",
    "AWS",
    "Docker",
    "MongoDB",
    "PostgreSQL",
    "HTML/CSS",
    "REST APIs",
    "GraphQL",
    "Agile",
    "Scrum",
    "Leadership",
    "Communication",
    "Problem Solving",
  ];

  const availableSuggestions = suggestedSkills.filter(
    (skill) => !formData.skills.includes(skill)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add Skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a skill and press Enter"
              className="mt-2"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addSkill} disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {formData.skills.length > 0 && (
          <div>
            <Label>Your Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-500"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {availableSuggestions.length > 0 && (
          <div>
            <Label>Suggested Skills</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSuggestions.slice(0, 10).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50"
                  onClick={() => {
                    const newFormData = { skills: [...formData.skills, skill] };
                    setFormData(newFormData);
                    onChange?.(newFormData);
                  }}
                >
                  {skill}
                  <Plus className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <AIAssistant
          sectionType="skills"
          currentContent={formData.skills.join(", ")}
          jobTitle={jobTitle}
          industry={industry}
          onApplySuggestion={handleAISuggestion}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Skills</Button>
      </div>
    </div>
  );
}
