import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

interface ResumeData {
  personalInfo?: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    website?: string
    linkedin?: string
    summary?: string
  }
  experience?: {
    items: Array<{
      id: string
      jobTitle: string
      company: string
      location: string
      startDate: string
      endDate: string
      current: boolean
      description: string
    }>
  }
  education?: {
    items: Array<{
      id: string
      degree: string
      school: string
      location: string
      startDate: string
      endDate: string
      current: boolean
      gpa?: string
      description?: string
    }>
  }
  skills?: {
    skills: string[]
  }
}

interface ResumePreviewProps {
  data: ResumeData
  className?: string
}

export function ResumePreview({ data, className = "" }: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = data

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  return (
    <div className={`bg-white shadow-lg max-w-4xl mx-auto ${className}`}>
      <div className="p-8 space-y-6">
        {/* Header */}
        {personalInfo && (
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName || "Your Name"}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>

            {personalInfo.summary && (
              <div className="mt-4">
                <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {experience?.items && experience.items.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.items.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 leading-relaxed">
                      {exp.description.split("\n").map((line, index) => (
                        <p key={index} className="mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.items && education.items.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Education</h2>
            <div className="space-y-4">
              {education.items.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                      {edu.location && <p className="text-sm text-gray-600">{edu.location}</p>}
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <p>
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                  {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.skills && skills.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
