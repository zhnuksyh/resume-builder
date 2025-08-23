"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AIAssistant } from "@/components/resume/ai-assistant"

interface PersonalInfoContent {
  fullName?: string
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  summary?: string
}

interface PersonalInfoSectionProps {
  content: PersonalInfoContent
  onSave: (content: PersonalInfoContent) => void
  jobTitle?: string
  industry?: string
}

export function PersonalInfoSection({ content, onSave, jobTitle, industry }: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState<PersonalInfoContent>(content)

  useEffect(() => {
    setFormData(content)
  }, [content])

  const handleChange = (field: keyof PersonalInfoContent, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleAISuggestion = (suggestion: string) => {
    setFormData({ ...formData, summary: suggestion })
  }

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
          <Label htmlFor="summary">Professional Summary</Label>
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
  )
}
