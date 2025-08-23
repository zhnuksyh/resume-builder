"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"

interface PDFExportProps {
  resumeId: string
  resumeTitle: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function PDFExport({ resumeId, resumeTitle, variant = "outline", size = "sm" }: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      // Get resume data
      const response = await fetch(`/api/resume/${resumeId}/pdf-client`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch resume data")
      }

      const { resumeData, title } = await response.json()

      // Generate PDF using browser APIs
      await generateClientPDF(resumeData, title)
    } catch (error) {
      console.error("PDF generation error:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const generateClientPDF = async (resumeData: any, title: string) => {
    // Create a new window with the resume content
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups to download PDF")
      return
    }

    const html = generatePrintHTML(resumeData, title)
    printWindow.document.write(html)
    printWindow.document.close()

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  const generatePrintHTML = (data: any, title: string): string => {
    const { personalInfo, experience, education, skills } = data

    const formatDate = (dateString: string) => {
      if (!dateString) return ""
      const date = new Date(dateString + "-01")
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 0.5in;
          }
          
          .resume {
            max-width: 8.5in;
            margin: 0 auto;
          }
          
          .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .name {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          
          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 1rem;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .summary {
            color: #4b5563;
            line-height: 1.7;
          }
          
          .section {
            margin-bottom: 1.5rem;
          }
          
          .section-title {
            font-size: 1.25rem;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
          }
          
          .experience-item, .education-item {
            margin-bottom: 1.5rem;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
          }
          
          .item-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1f2937;
          }
          
          .item-company {
            color: #2563eb;
            font-weight: 500;
          }
          
          .item-location {
            font-size: 0.9rem;
            color: #6b7280;
          }
          
          .item-date {
            font-size: 0.9rem;
            color: #6b7280;
            text-align: right;
          }
          
          .item-description {
            color: #4b5563;
            line-height: 1.6;
            white-space: pre-line;
          }
          
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .skill-tag {
            background: #f3f4f6;
            color: #374151;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.9rem;
            border: 1px solid #d1d5db;
          }
          
          @media print {
            body { 
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .resume { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="resume">
          ${
            personalInfo
              ? `
            <div class="header">
              <h1 class="name">${personalInfo.fullName || "Your Name"}</h1>
              <div class="contact-info">
                ${personalInfo.email ? `<div class="contact-item">📧 ${personalInfo.email}</div>` : ""}
                ${personalInfo.phone ? `<div class="contact-item">📞 ${personalInfo.phone}</div>` : ""}
                ${personalInfo.location ? `<div class="contact-item">📍 ${personalInfo.location}</div>` : ""}
                ${personalInfo.website ? `<div class="contact-item">🌐 ${personalInfo.website}</div>` : ""}
                ${personalInfo.linkedin ? `<div class="contact-item">💼 ${personalInfo.linkedin}</div>` : ""}
              </div>
              ${personalInfo.summary ? `<div class="summary">${personalInfo.summary}</div>` : ""}
            </div>
          `
              : ""
          }
          
          ${
            experience?.items?.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Professional Experience</h2>
              ${experience.items
                .map(
                  (exp: any) => `
                <div class="experience-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${exp.jobTitle}</div>
                      <div class="item-company">${exp.company}</div>
                      ${exp.location ? `<div class="item-location">${exp.location}</div>` : ""}
                    </div>
                    <div class="item-date">
                      ${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  ${exp.description ? `<div class="item-description">${exp.description}</div>` : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            education?.items?.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Education</h2>
              ${education.items
                .map(
                  (edu: any) => `
                <div class="education-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${edu.degree}</div>
                      <div class="item-company">${edu.school}</div>
                      ${edu.location ? `<div class="item-location">${edu.location}</div>` : ""}
                      ${edu.gpa ? `<div class="item-location">GPA: ${edu.gpa}</div>` : ""}
                    </div>
                    <div class="item-date">
                      ${formatDate(edu.startDate)} - ${edu.current ? "Present" : formatDate(edu.endDate)}
                    </div>
                  </div>
                  ${edu.description ? `<div class="item-description">${edu.description}</div>` : ""}
                </div>
              `,
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            skills?.skills?.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">Skills</h2>
              <div class="skills-container">
                ${skills.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </body>
      </html>
    `
  }

  return (
    <Button variant={variant} size={size} onClick={generatePDF} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  )
}
