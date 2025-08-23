"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { AIAssistant } from "@/components/resume/ai-assistant"

interface ExperienceItem {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface ExperienceContent {
  items: ExperienceItem[]
}

interface ExperienceSectionProps {
  content: ExperienceContent
  onSave: (content: ExperienceContent) => void
}

export function ExperienceSection({ content, onSave }: ExperienceSectionProps) {
  const [formData, setFormData] = useState<ExperienceContent>({ items: [] })

  useEffect(() => {
    setFormData(content.items ? content : { items: [] })
  }, [content])

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
    }
    setFormData({ items: [...formData.items, newExperience] })
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string | boolean) => {
    setFormData({
      items: formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeExperience = (id: string) => {
    setFormData({ items: formData.items.filter((item) => item.id !== id) })
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleAISuggestion = (experienceId: string, suggestion: string) => {
    updateExperience(experienceId, "description", suggestion)
  }

  return (
    <div className="space-y-6">
      {formData.items.map((experience, index) => (
        <Card key={experience.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeExperience(experience.id)}>
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
                  onChange={(e) => updateExperience(experience.id, "jobTitle", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                  placeholder="Tech Corp"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                  disabled={experience.current}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${experience.id}`}
                  checked={experience.current}
                  onChange={(e) => updateExperience(experience.id, "current", e.target.checked)}
                />
                <Label htmlFor={`current-${experience.id}`}>Currently working here</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Description</Label>
              <Textarea
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
            {experience.jobTitle && (
              <AIAssistant
                sectionType="experience"
                currentContent={experience.description}
                jobTitle={experience.jobTitle}
                onApplySuggestion={(suggestion) => handleAISuggestion(experience.id, suggestion)}
              />
            )}
          </CardContent>
        </Card>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Experience</Button>
      </div>
    </div>
  )
}
