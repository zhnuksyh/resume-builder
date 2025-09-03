"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface CustomSectionProps {
  content: any
  onSave: (content: any) => void
  sectionType: string
  title: string
}

const proficiencyLevels = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" }
]

export function CustomSection({ content, onSave, sectionType, title }: CustomSectionProps) {
  const [formData, setFormData] = useState(content || {})

  useEffect(() => {
    setFormData(content || {})
  }, [content])

  const handleSave = () => {
    onSave(formData)
  }

  // Projects Section
  const renderProjectsSection = () => {
    const addProject = () => {
      const newProject = {
        id: Date.now().toString(),
        name: "",
        description: "",
        technologies: "",
        url: "",
        github: "",
        startDate: "",
        endDate: ""
      }
      setFormData({ items: [...(formData.items || []), newProject] })
    }

    const updateProject = (id: string, field: string, value: string) => {
      setFormData({
        items: formData.items.map((item: any) => 
          item.id === id ? { ...item, [field]: value } : item
        )
      })
    }

    const removeProject = (id: string) => {
      setFormData({ items: formData.items.filter((item: any) => item.id !== id) })
    }

    return (
      <div className="space-y-6">
        {(formData.items || []).map((project: any, index: number) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name *</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    placeholder="My Awesome Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project URL</Label>
                  <Input
                    value={project.url}
                    onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={project.github}
                    onChange={(e) => updateProject(project.id, "github", e.target.value)}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  placeholder="Describe your project, its features, and your role..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addProject} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    )
  }

  // Languages Section
  const renderLanguagesSection = () => {
    const addLanguage = () => {
      const newLanguage = {
        id: Date.now().toString(),
        language: "",
        proficiency: ""
      }
      setFormData({ languages: [...(formData.languages || []), newLanguage] })
    }

    const updateLanguage = (id: string, field: string, value: string) => {
      setFormData({
        languages: formData.languages.map((item: any) => 
          item.id === id ? { ...item, [field]: value } : item
        )
      })
    }

    const removeLanguage = (id: string) => {
      setFormData({ languages: formData.languages.filter((item: any) => item.id !== id) })
    }

    return (
      <div className="space-y-4">
        {(formData.languages || []).map((language: any) => (
          <Card key={language.id}>
            <CardContent className="pt-4">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Language</Label>
                  <Input
                    value={language.language}
                    onChange={(e) => updateLanguage(language.id, "language", e.target.value)}
                    placeholder="English, Spanish, French..."
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Proficiency Level</Label>
                  <Select value={language.proficiency} onValueChange={(value) => updateLanguage(language.id, "proficiency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeLanguage(language.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addLanguage} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>
    )
  }

  // Interests Section
  const renderInterestsSection = () => {
    const [newInterest, setNewInterest] = useState("")

    const addInterest = () => {
      if (newInterest.trim()) {
        setFormData({ 
          interests: [...(formData.interests || []), newInterest.trim()] 
        })
        setNewInterest("")
      }
    }

    const removeInterest = (index: number) => {
      setFormData({
        interests: formData.interests.filter((_: any, i: number) => i !== index)
      })
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest or hobby"
            onKeyPress={(e) => e.key === "Enter" && addInterest()}
          />
          <Button onClick={addInterest} disabled={!newInterest.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData.interests || []).map((interest: string, index: number) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm">{interest}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 w-4 h-4"
                onClick={() => removeInterest(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Generic Items Section (for certifications, achievements, publications, etc.)
  const renderGenericItemsSection = () => {
    const addItem = () => {
      const newItem = {
        id: Date.now().toString(),
        title: "",
        description: "",
        date: "",
        ...(sectionType === "certifications" && { issuer: "", credentialId: "", url: "" }),
        ...(sectionType === "volunteer" && { organization: "", role: "", location: "", startDate: "", endDate: "", current: false }),
        ...(sectionType === "publications" && { publication: "", authors: "", url: "" }),
        ...(sectionType === "achievements" && { issuer: "" })
      }
      setFormData({ items: [...(formData.items || []), newItem] })
    }

    const updateItem = (id: string, field: string, value: string | boolean) => {
      setFormData({
        items: formData.items.map((item: any) => 
          item.id === id ? { ...item, [field]: value } : item
        )
      })
    }

    const removeItem = (id: string) => {
      setFormData({ items: formData.items.filter((item: any) => item.id !== id) })
    }

    return (
      <div className="space-y-6">
        {(formData.items || []).map((item: any, index: number) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{title} {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {sectionType === "certifications" ? "Certification Name" :
                     sectionType === "volunteer" ? "Organization" :
                     sectionType === "publications" ? "Publication Title" :
                     "Title"} *
                  </Label>
                  <Input
                    value={sectionType === "volunteer" ? item.organization : item.title || item.name}
                    onChange={(e) => updateItem(item.id, sectionType === "volunteer" ? "organization" : "title", e.target.value)}
                    placeholder={
                      sectionType === "certifications" ? "AWS Certified Solutions Architect" :
                      sectionType === "volunteer" ? "Red Cross" :
                      sectionType === "publications" ? "Research Paper Title" :
                      "Enter title"
                    }
                  />
                </div>
                
                {sectionType === "certifications" && (
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input
                      value={item.issuer}
                      onChange={(e) => updateItem(item.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                )}
                
                {sectionType === "volunteer" && (
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={item.role}
                      onChange={(e) => updateItem(item.id, "role", e.target.value)}
                      placeholder="Volunteer Coordinator"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type={sectionType === "volunteer" ? "month" : "date"}
                    value={item.date || item.startDate}
                    onChange={(e) => updateItem(item.id, sectionType === "volunteer" ? "startDate" : "date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  placeholder="Describe the details, impact, or relevance..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (sectionType) {
      case "projects":
        return renderProjectsSection()
      case "languages":
        return renderLanguagesSection()
      case "interests":
        return renderInterestsSection()
      case "certifications":
      case "achievements":
      case "volunteer":
      case "publications":
      default:
        return renderGenericItemsSection()
    }
  }

  return (
    <div className="space-y-6">
      {renderSectionContent()}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save {title}</Button>
      </div>
    </div>
  )
}
