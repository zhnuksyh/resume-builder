"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface EducationItem {
  id: string
  degree: string
  school: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

interface EducationContent {
  items: EducationItem[]
}

interface EducationSectionProps {
  content: EducationContent
  onSave: (content: EducationContent) => void
}

export function EducationSection({ content, onSave }: EducationSectionProps) {
  const [formData, setFormData] = useState<EducationContent>({ items: [] })

  useEffect(() => {
    setFormData(content.items ? content : { items: [] })
  }, [content])

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
    }
    setFormData({ items: [...formData.items, newEducation] })
  }

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setFormData({
      items: formData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const removeEducation = (id: string) => {
    setFormData({ items: formData.items.filter((item) => item.id !== id) })
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <div className="space-y-6">
      {formData.items.map((education, index) => (
        <Card key={education.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Education {index + 1}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeEducation(education.id)}>
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
                  onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label>School *</Label>
                <Input
                  value={education.school}
                  onChange={(e) => updateEducation(education.id, "school", e.target.value)}
                  placeholder="University of California"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={education.location}
                  onChange={(e) => updateEducation(education.id, "location", e.target.value)}
                  placeholder="Berkeley, CA"
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={education.gpa || ""}
                  onChange={(e) => updateEducation(education.id, "gpa", e.target.value)}
                  placeholder="3.8"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(education.id, "startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(education.id, "endDate", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Details (Optional)</Label>
              <Textarea
                value={education.description || ""}
                onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                placeholder="Relevant coursework, honors, activities..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Education</Button>
      </div>
    </div>
  )
}
