import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumeData {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    summary?: string;
  };
  experience?: {
    items: Array<{
      id: string;
      jobTitle: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>;
  };
  education?: {
    items: Array<{
      id: string;
      degree: string;
      school: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      gpa?: string;
      description?: string;
    }>;
  };
  skills?: {
    skills: string[];
  };
  [key: string]: any; // Allow custom sections
}

interface ResumePreviewProps {
  data: ResumeData | Array<{ type: string; content: any }>;
  className?: string;
  isA4Preview?: boolean;
  isPageContent?: boolean;
}

export function ResumePreview({
  data,
  className = "",
  isA4Preview = false,
  isPageContent = false,
}: ResumePreviewProps) {
  // Extract data based on format
  let personalInfo, experience, education, skills;

  if (isPageContent && Array.isArray(data)) {
    // Page-based content format
    data.forEach((item) => {
      if (item.type === "personalInfo") personalInfo = item.content;
      if (item.type === "experience") experience = item.content;
      if (item.type === "education") education = item.content;
      if (item.type === "skills") skills = item.content;
    });
  } else {
    // Full resume data format
    const resumeData = data as ResumeData;
    personalInfo = resumeData.personalInfo;
    experience = resumeData.experience;
    education = resumeData.education;
    skills = resumeData.skills;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // A4 preview styles that match PDF generation exactly - optimized for space
  const a4Styles = isA4Preview
    ? {
        container: "max-w-none mx-0 h-full",
        header: "border-b-2 border-gray-200 pb-3 mb-4",
        name: "text-2xl font-bold text-gray-900 mb-1.5 leading-tight",
        contactInfo: "flex flex-wrap gap-2.5 text-xs text-gray-600 mb-2.5",
        contactItem: "flex items-center gap-1.5",
        summary: "text-gray-700 leading-normal text-sm mt-2.5",
        section: "mb-4",
        sectionTitle:
          "text-lg font-bold text-gray-900 mb-2.5 border-b border-gray-300 pb-1 uppercase tracking-wide",
        experienceItem: "mb-3.5",
        educationItem: "mb-2.5",
        itemHeader: "flex justify-between items-start mb-1",
        itemTitle: "text-base font-semibold text-gray-900 leading-tight",
        itemCompany: "text-blue-600 font-medium text-sm",
        itemLocation: "text-xs text-gray-600 mt-0.5",
        itemDate: "text-xs text-gray-600 text-right leading-tight",
        itemDescription: "text-gray-700 leading-normal text-sm mt-1",
        skillsContainer: "flex flex-wrap gap-1.5",
        skillTag: "text-xs px-2 py-1",
      }
    : {
        container: "max-w-4xl mx-auto",
        header: "border-b border-gray-200 pb-6",
        name: "text-3xl font-bold text-gray-900 mb-2",
        contactInfo: "flex flex-wrap gap-4 text-sm text-gray-600",
        contactItem: "flex items-center gap-1",
        summary: "text-gray-700 leading-relaxed mt-4",
        section: "mb-6",
        sectionTitle:
          "text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2",
        experienceItem: "mb-6",
        educationItem: "mb-4",
        itemHeader: "flex justify-between items-start mb-2",
        itemTitle: "text-lg font-semibold text-gray-900",
        itemCompany: "text-blue-600 font-medium",
        itemLocation: "text-sm text-gray-600",
        itemDate: "text-sm text-gray-600 text-right",
        itemDescription: "text-gray-700 leading-relaxed",
        skillsContainer: "flex flex-wrap gap-2",
        skillTag: "text-sm",
      };

  return (
    <div className={`bg-white ${a4Styles.container} ${className}`}>
      <div className={isA4Preview ? "space-y-6" : "p-8 space-y-6"}>
        {/* Header */}
        {personalInfo && (
          <div className={a4Styles.header}>
            <h1 className={a4Styles.name}>
              {personalInfo.fullName || "Your Name"}
            </h1>

            <div className={a4Styles.contactInfo}>
              {personalInfo.email && (
                <div className={a4Styles.contactItem}>
                  <Mail className="h-4 w-4" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className={a4Styles.contactItem}>
                  <Phone className="h-4 w-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className={a4Styles.contactItem}>
                  <MapPin className="h-4 w-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className={a4Styles.contactItem}>
                  <Globe className="h-4 w-4" />
                  <span>{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className={a4Styles.contactItem}>
                  <Linkedin className="h-4 w-4" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>

            {personalInfo.summary && (
              <div className={isA4Preview ? "" : "mt-4"}>
                <p className={a4Styles.summary}>{personalInfo.summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Experience */}
        {experience?.items && experience.items.length > 0 && (
          <div className={a4Styles.section}>
            <h2 className={a4Styles.sectionTitle}>
              Professional Experience
              {experience.isPartial ? " (continued)" : ""}
            </h2>
            <div className="space-y-6">
              {experience.items.map((exp) => (
                <div key={exp.id} className={a4Styles.experienceItem}>
                  <div className={a4Styles.itemHeader}>
                    <div>
                      <h3 className={a4Styles.itemTitle}>{exp.jobTitle}</h3>
                      <p className={a4Styles.itemCompany}>{exp.company}</p>
                      {exp.location && (
                        <p className={a4Styles.itemLocation}>{exp.location}</p>
                      )}
                    </div>
                    <div className={a4Styles.itemDate}>
                      <p>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className={a4Styles.itemDescription}>
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
          <div className={a4Styles.section}>
            <h2 className={a4Styles.sectionTitle}>
              Education{education.isPartial ? " (continued)" : ""}
            </h2>
            <div className="space-y-4">
              {education.items.map((edu) => (
                <div key={edu.id} className={a4Styles.educationItem}>
                  <div className={a4Styles.itemHeader}>
                    <div>
                      <h3 className={a4Styles.itemTitle}>{edu.degree}</h3>
                      <p className={a4Styles.itemCompany}>{edu.school}</p>
                      {edu.location && (
                        <p className={a4Styles.itemLocation}>{edu.location}</p>
                      )}
                      {edu.gpa && (
                        <p className={a4Styles.itemLocation}>GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className={a4Styles.itemDate}>
                      <p>
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className={a4Styles.itemDescription}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.skills && skills.skills.length > 0 && (
          <div className={a4Styles.section}>
            <h2 className={a4Styles.sectionTitle}>Skills</h2>
            <div className={a4Styles.skillsContainer}>
              {skills.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={a4Styles.skillTag}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {Object.entries(data).map(([key, sectionData]) => {
          if (
            key.startsWith("custom_") &&
            sectionData?.items &&
            sectionData.items.length > 0
          ) {
            return (
              <div key={key} className={a4Styles.section}>
                <h2 className={a4Styles.sectionTitle}>
                  {sectionData.title || "Custom Section"}
                </h2>
                <div className="space-y-4">
                  {sectionData.items.map((item: any, index: number) => (
                    <div key={index} className={a4Styles.educationItem}>
                      <div className={a4Styles.itemHeader}>
                        <div>
                          <h3 className={a4Styles.itemTitle}>{item.title}</h3>
                        </div>
                      </div>
                      {item.description && (
                        <p className={a4Styles.itemDescription}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
