import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { ResumeColor } from "./color-picker";

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
    isPartial?: boolean;
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
    isPartial?: boolean;
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
  colorTheme?: ResumeColor;
}

export function ResumePreview({
  data,
  className = "",
  isA4Preview = false,
  isPageContent = false,
  colorTheme = "purple",
}: ResumePreviewProps) {
  // Extract data based on format
  let personalInfo,
    experience,
    education,
    skills,
    customSections: { [key: string]: any } = {};

  if (isPageContent && Array.isArray(data)) {
    // Page-based content format
    data.forEach((item) => {
      if (item.type === "personalInfo") personalInfo = item.content;
      if (item.type === "experience") experience = item.content;
      if (item.type === "education") education = item.content;
      if (item.type === "skills") skills = item.content;
      if (item.type.startsWith("custom_")) {
        // Handle custom sections
        customSections[item.type] = item.content;
      }
    });
  } else {
    // Full resume data format
    const resumeData = data as ResumeData;
    personalInfo = resumeData.personalInfo;
    experience = resumeData.experience;
    education = resumeData.education;
    skills = resumeData.skills;
    // Extract custom sections from full data
    Object.keys(resumeData).forEach((key) => {
      if (key.startsWith("custom_")) {
        customSections[key] = resumeData[key];
      }
    });
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // A4 preview styles with optimized spacing for maximum space utilization
  const a4Styles = isA4Preview
    ? {
        container: "max-w-none mx-0 h-full",
        header: "mb-4",
        name: "text-xl font-bold text-gray-900 mb-2 leading-tight",
        contactInfo: "flex flex-wrap gap-2 text-xs text-gray-600 mb-3",
        contactItem: "flex items-center gap-1",
        summary: "text-gray-700 leading-relaxed text-xs mt-3 text-justify",
        section: "mb-4",
        sectionTitle:
          "text-base font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1.5 uppercase tracking-wide",
        experienceSectionTitle:
          "text-base font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1.5 uppercase tracking-wide",
        experienceItem: "mb-3.5",
        educationItem: "mb-3.5",
        itemHeader: "flex justify-between items-start mb-1.5",
        itemTitle: "text-sm font-semibold text-gray-900 leading-tight",
        itemCompany: "text-[var(--resume-primary)] font-medium text-xs",
        itemLocation: "text-xs text-gray-600 mt-0",
        itemDate: "text-xs text-gray-600 text-right leading-tight",
        itemDescription:
          "text-gray-700 leading-relaxed text-xs mt-1.5 text-justify",
        skillsContainer: "flex flex-wrap gap-1.5",
        skillTag: "text-xs px-2 py-1",
      }
    : {
        container: "max-w-4xl mx-auto",
        header: "pb-8",
        name: "text-3xl font-bold text-gray-900 mb-3",
        contactInfo: "flex flex-wrap gap-4 text-sm text-gray-600",
        contactItem: "flex items-center gap-1",
        summary: "text-gray-700 leading-relaxed mt-5 text-justify text-sm",
        section: "mb-8",
        sectionTitle:
          "text-xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-2.5",
        experienceSectionTitle:
          "text-xl font-bold text-gray-900 mb-5 border-b border-gray-200 pb-2.5",
        experienceItem: "mb-7",
        educationItem: "mb-5",
        itemHeader: "flex justify-between items-start mb-2.5",
        itemTitle: "text-lg font-semibold text-gray-900",
        itemCompany: "text-[var(--resume-primary)] font-medium",
        itemLocation: "text-sm text-gray-600",
        itemDate: "text-sm text-gray-600 text-right",
        itemDescription: "text-gray-700 leading-relaxed text-justify mt-1.5",
        skillsContainer: "flex flex-wrap gap-2",
        skillTag: "text-sm",
      };

  return (
    <div
      className={`bg-white ${a4Styles.container} ${className} resume-theme-${colorTheme}`}
    >
      <div className={isA4Preview ? "space-y-5" : "p-8 space-y-8"}>
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
                  <Linkedin className="h-4 w-4 -translate-y-0.5" />
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
            <h2 className={a4Styles.experienceSectionTitle}>
              Professional Experience
              {experience.isPartial ? " (continued)" : ""}
            </h2>
            <div className={isA4Preview ? "space-y-4" : "space-y-7"}>
              {experience.items.map((exp) => (
                <div key={exp.id} className={a4Styles.experienceItem}>
                  <div className={a4Styles.itemHeader}>
                    <div>
                      <h3 className={a4Styles.itemTitle}>{exp.jobTitle}</h3>
                      <p className={a4Styles.itemCompany}>{exp.company}</p>
                    </div>
                    <div className={a4Styles.itemDate}>
                      <p>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.current ? "Present" : formatDate(exp.endDate)}
                      </p>
                      {exp.location && (
                        <p className={a4Styles.itemLocation}>{exp.location}</p>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <div className={a4Styles.itemDescription}>
                      {exp.description.split("\n").map((line, index) => {
                        const trimmedLine = line.trim();
                        if (
                          trimmedLine.startsWith("•") ||
                          trimmedLine.startsWith("-") ||
                          trimmedLine.startsWith("*")
                        ) {
                          return (
                            <div
                              key={index}
                              className="flex items-start mb-1.5"
                            >
                              <span className="mr-2">•</span>
                              <span className="flex-1">
                                {trimmedLine.substring(1).trim()}
                              </span>
                            </div>
                          );
                        } else if (/^\d+\./.test(trimmedLine)) {
                          const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
                          if (match) {
                            return (
                              <div
                                key={index}
                                className="flex items-start mb-1"
                              >
                                <span className="mr-2">{match[1]}.</span>
                                <span className="flex-1">{match[2]}</span>
                              </div>
                            );
                          }
                        }
                        return (
                          <p key={index} className="mb-1.5">
                            {line}
                          </p>
                        );
                      })}
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
            <div className={isA4Preview ? "space-y-3.5" : "space-y-5"}>
              {education.items.map((edu) => (
                <div key={edu.id} className={a4Styles.educationItem}>
                  <div className={a4Styles.itemHeader}>
                    <div>
                      <h3 className={a4Styles.itemTitle}>{edu.degree}</h3>
                      <p className={a4Styles.itemCompany}>
                        {edu.school}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <div className={a4Styles.itemDate}>
                      <p>
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                      {edu.location && (
                        <p className={a4Styles.itemLocation}>{edu.location}</p>
                      )}
                    </div>
                  </div>
                  {edu.description && (
                    <div className={a4Styles.itemDescription}>
                      {edu.description.split("\n").map((line, index) => {
                        const trimmedLine = line.trim();
                        if (
                          trimmedLine.startsWith("•") ||
                          trimmedLine.startsWith("-") ||
                          trimmedLine.startsWith("*")
                        ) {
                          return (
                            <div
                              key={index}
                              className="flex items-start mb-1.5"
                            >
                              <span className="mr-2">•</span>
                              <span className="flex-1">
                                {trimmedLine.substring(1).trim()}
                              </span>
                            </div>
                          );
                        } else if (/^\d+\./.test(trimmedLine)) {
                          const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
                          if (match) {
                            return (
                              <div
                                key={index}
                                className="flex items-start mb-1"
                              >
                                <span className="mr-2">{match[1]}.</span>
                                <span className="flex-1">{match[2]}</span>
                              </div>
                            );
                          }
                        }
                        return (
                          <p key={index} className="mb-1.5">
                            {line}
                          </p>
                        );
                      })}
                    </div>
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
                <span
                  key={index}
                  className={`${a4Styles.skillTag} inline-flex items-center justify-center rounded-md border border-transparent bg-[var(--resume-accent)] text-[var(--resume-accent-foreground)] px-2 py-1 text-xs font-medium`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {Object.entries(customSections).map(([key, sectionData]) => {
          if (
            key.startsWith("custom_") &&
            sectionData?.items &&
            Array.isArray(sectionData.items) &&
            sectionData.items.length > 0
          ) {
            const sectionTitle =
              sectionData.title ||
              key
                .replace(/^custom_/, "")
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
            const isReferenceSection =
              sectionTitle.toLowerCase() === "reference";

            return (
              <div key={key} className={a4Styles.section}>
                <h2 className={a4Styles.sectionTitle}>{sectionTitle}</h2>
                <div className={isA4Preview ? "space-y-3.5" : "space-y-5"}>
                  {sectionData.items.map((item: any, index: number) => (
                    <div key={index} className={a4Styles.educationItem}>
                      <div className={a4Styles.itemHeader}>
                        <div>
                          <h3 className={a4Styles.itemTitle}>{item.title}</h3>
                        </div>
                        {isReferenceSection && item.position ? (
                          <div className={a4Styles.itemDate}>
                            <p>{item.position}</p>
                          </div>
                        ) : (
                          (item.startDate || item.endDate) && (
                            <div className={a4Styles.itemDate}>
                              <p>
                                {item.startDate && item.endDate
                                  ? `${formatDate(
                                      item.startDate
                                    )} - ${formatDate(item.endDate)}`
                                  : item.startDate
                                  ? formatDate(item.startDate)
                                  : formatDate(item.endDate)}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                      {item.description && (
                        <div className={a4Styles.itemDescription}>
                          {item.description
                            .split("\n")
                            .map((line: string, index: number) => {
                              const trimmedLine = line.trim();
                              if (
                                trimmedLine.startsWith("•") ||
                                trimmedLine.startsWith("-") ||
                                trimmedLine.startsWith("*")
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="flex items-start mb-1"
                                  >
                                    <span className="mr-2">•</span>
                                    <span className="flex-1">
                                      {trimmedLine.substring(1).trim()}
                                    </span>
                                  </div>
                                );
                              } else if (/^\d+\./.test(trimmedLine)) {
                                const match =
                                  trimmedLine.match(/^(\d+)\.\s*(.*)/);
                                if (match) {
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-start mb-1"
                                    >
                                      <span className="mr-2">{match[1]}.</span>
                                      <span className="flex-1">{match[2]}</span>
                                    </div>
                                  );
                                }
                              }
                              return (
                                <p key={index} className="mb-1.5">
                                  {line}
                                </p>
                              );
                            })}
                        </div>
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
