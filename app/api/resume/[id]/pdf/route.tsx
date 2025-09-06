import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import puppeteer from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const colorTheme = searchParams.get("colorTheme") || "purple";
    const supabase = await createClient();

    // Get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get resume
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Get sections
    const { data: sections, error: sectionsError } = await supabase
      .from("resume_sections")
      .select("*")
      .eq("resume_id", id)
      .order("order_index");

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError);
    }

    // Transform sections data to match live preview format
    const resumeData: any = {
      personalInfo:
        sections?.find((s: any) => s.section_type === "personal_info")
          ?.content || {},
      experience: sections?.find((s: any) => s.section_type === "experience")
        ?.content || { items: [] },
      education: sections?.find((s: any) => s.section_type === "education")
        ?.content || { items: [] },
      skills: sections?.find((s: any) => s.section_type === "skills")
        ?.content || { skills: [] },
    };

    // Add custom sections with proper title
    sections?.forEach((section: any) => {
      if (section.section_type.startsWith("custom_")) {
        resumeData[section.section_type] = {
          ...section.content,
          title: section.title || section.content.title || "Custom Section", // Use database title first, then content title
        };
      }
    });

    // Generate HTML for PDF
    const html = generateResumeHTML(resumeData, resume.title, colorTheme);

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateResumeHTML(
  data: any,
  title: string,
  colorTheme: string = "purple"
): string {
  const { personalInfo, experience, education, skills, ...customSections } =
    data;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Helper function to process description text with bullet points and numbered lists
  const processDescription = (description: string) => {
    if (!description) return "";

    return description
      .split("\n")
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (
          trimmedLine.startsWith("•") ||
          trimmedLine.startsWith("-") ||
          trimmedLine.startsWith("*")
        ) {
          return `<div style="display: flex; align-items: flex-start; margin-bottom: 0.375rem;">
          <span style="margin-right: 0.5rem;">•</span>
          <span style="flex: 1;">${trimmedLine.substring(1).trim()}</span>
        </div>`;
        } else if (/^\d+\./.test(trimmedLine)) {
          const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
          if (match) {
            return `<div style="display: flex; align-items: flex-start; margin-bottom: 0.375rem;">
            <span style="margin-right: 0.5rem;">${match[1]}.</span>
            <span style="flex: 1;">${match[2]}</span>
          </div>`;
          }
        }
        return `<p style="margin-bottom: 0.375rem;">${line}</p>`;
      })
      .join("");
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
        }
        
        /* Color Theme Variables */
        .resume-theme-purple {
          --resume-primary: oklch(0.6 0.15 300);
          --resume-primary-foreground: oklch(0.98 0.01 300);
          --resume-accent: oklch(0.9 0.08 300);
          --resume-accent-foreground: oklch(0.2 0.02 300);
        }
        
        .resume-theme-dark-blue {
          --resume-primary: oklch(0.25 0.15 240);
          --resume-primary-foreground: oklch(0.98 0.01 240);
          --resume-accent: oklch(0.9 0.08 240);
          --resume-accent-foreground: oklch(0.2 0.02 240);
        }
        
        .resume-theme-grey {
          --resume-primary: oklch(0.5 0.02 0);
          --resume-primary-foreground: oklch(0.98 0 0);
          --resume-accent: oklch(0.9 0 0);
          --resume-accent-foreground: oklch(0.2 0 0);
        }
        
        .resume {
          width: 210mm;
          margin: 0 auto;
          padding: 0;
          background: white;
          max-width: none;
        }
        
        .resume-content {
          padding: 40px 50px;
          background: white;
        }
        
        .header {
          margin-bottom: 1rem;
        }
        
        .name {
          font-size: 1.25rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .contact-icon {
          width: 1rem;
          height: 1rem;
          color: #4b5563;
          flex-shrink: 0;
        }
        
        .contact-separator {
          color: #4b5563;
          margin: 0 0.25rem;
          font-size: 0.75rem;
        }
        
        .summary {
          color: #374151;
          line-height: 1.4;
          font-size: 0.75rem;
          margin-top: 0.75rem;
          text-align: justify;
        }
        
        .section {
          margin-bottom: 1rem;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: bold;
          color: #111827;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 0.375rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .experience-section-title {
          font-size: 1rem;
          font-weight: bold;
          color: #111827;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 0.375rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .experience-item {
          margin-bottom: 0.875rem;
        }
        
        .education-item {
          margin-bottom: 0.875rem;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.375rem;
        }
        
        .item-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.4;
        }
        
        .item-company {
          color: var(--resume-primary);
          font-weight: 500;
          font-size: 0.75rem;
        }
        
        .item-location {
          font-size: 0.75rem;
          color: #4b5563;
          margin-top: 0;
        }
        
        .item-date {
          font-size: 0.75rem;
          color: #4b5563;
          text-align: right;
          line-height: 1.4;
        }
        
        .item-description {
          color: #374151;
          line-height: 1.4;
          font-size: 0.75rem;
          margin-top: 0.375rem;
          text-align: justify;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        
        .skill-tag {
          background: var(--resume-accent);
          color: var(--resume-accent-foreground);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          border: none;
        }
        
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
            line-height: 1.25 !important;
          }
          .resume { 
            margin: 0; 
            padding: 0; 
            width: 210mm !important;
          }
          .resume-content {
            padding: 40px 50px;
          }
          .resume * {
            line-height: 1.4 !important;
          }
          .resume h1, .resume h2, .resume h3 {
            margin-top: 0 !important;
            margin-bottom: 0.375rem !important;
          }
          .resume p {
            margin-top: 0 !important;
            margin-bottom: 0.375rem !important;
          }
          .section {
            page-break-inside: avoid;
            break-inside: avoid;
            page-break-before: auto;
            margin-top: 0;
          }
          .section:first-of-type {
            margin-top: 0;
          }
          .section:not(:first-of-type) {
            margin-top: 1rem;
          }
          .experience-item, .education-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 0;
          }
          @page :first {
            margin-top: 0;
          }
          @page :left {
            margin-top: 0;
          }
          @page :right {
            margin-top: 0;
          }
          /* Add space at the top of new pages */
          .section-title {
            margin-top: 1rem;
            padding-top: 0.5rem;
          }
          .section-title:first-child {
            margin-top: 0;
            padding-top: 0;
          }
          /* Ensure sections that break to new pages have proper spacing */
          .section {
            margin-top: 0;
          }
          .section:not(:first-child) {
            margin-top: 1.5rem;
          }
          /* Add extra space for content that appears at the top of any page */
          .resume-content > *:first-child {
            margin-top: 0;
          }
          .resume-content > *:not(:first-child) {
            margin-top: 1.5rem;
          }
          /* Ensure section titles at the top of pages have breathing room */
          .section-title {
            page-break-after: avoid;
            break-after: avoid;
          }
          /* Add space before sections that might appear at page top */
          .section {
            page-break-before: auto;
            break-before: auto;
          }
          /* Special handling for sections that start new pages */
          .section:not(:first-child) {
            margin-top: 1.5rem;
            padding-top: 0.5rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="resume resume-theme-${colorTheme}">
        <div class="resume-content">
        ${
          personalInfo
            ? `
          <div class="header">
            <h1 class="name">${personalInfo.fullName || "Your Name"}</h1>
            <div class="contact-info">
              ${[
                personalInfo.email
                  ? `<div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  ${personalInfo.email}
                </div>`
                  : "",
                personalInfo.phone
                  ? `<div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  ${personalInfo.phone}
                </div>`
                  : "",
                personalInfo.location
                  ? `<div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${personalInfo.location}
                </div>`
                  : "",
                personalInfo.website
                  ? `<div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  ${personalInfo.website}
                </div>`
                  : "",
                personalInfo.linkedin
                  ? `<div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: translateY(-1px);">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  ${personalInfo.linkedin}
                </div>`
                  : "",
              ]
                .filter(Boolean)
                .join('<span class="contact-separator">•</span>')}
            </div>
            ${
              personalInfo.summary
                ? `<div class="summary">${personalInfo.summary}</div>`
                : ""
            }
          </div>
        `
            : ""
        }
        
        ${
          experience?.items?.length > 0
            ? `
          <div class="section">
            <h2 class="experience-section-title">Professional Experience${
              experience.isPartial ? " (continued)" : ""
            }</h2>
            ${experience.items
              .map(
                (exp: any) => `
              <div class="experience-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${exp.jobTitle}</div>
                    <div class="item-company">${exp.company}</div>
                    ${
                      exp.location
                        ? `<div class="item-location">${exp.location}</div>`
                        : ""
                    }
                  </div>
                  <div class="item-date">
                    ${formatDate(exp.startDate)} - ${
                  exp.current ? "Present" : formatDate(exp.endDate)
                }
                  </div>
                </div>
                ${
                  exp.description
                    ? `<div class="item-description">${processDescription(
                        exp.description
                      )}</div>`
                    : ""
                }
              </div>
            `
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
            <h2 class="section-title">Education${
              education.isPartial ? " (continued)" : ""
            }</h2>
            ${education.items
              .map(
                (edu: any) => `
              <div class="education-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-company">${
                      edu.school + (edu.gpa ? ` • GPA: ${edu.gpa}` : "")
                    }</div>
                    ${
                      edu.location
                        ? `<div class="item-location">${edu.location}</div>`
                        : ""
                    }
                  </div>
                  <div class="item-date">
                    ${formatDate(edu.startDate)} - ${
                  edu.current ? "Present" : formatDate(edu.endDate)
                }
                  </div>
                </div>
                ${
                  edu.description
                    ? `<div class="item-description">${processDescription(
                        edu.description
                      )}</div>`
                    : ""
                }
              </div>
            `
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
              ${skills.skills
                .map(
                  (skill: string) => `<span class="skill-tag">${skill}</span>`
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${Object.entries(customSections)
          .map(([key, sectionData]: [string, any]) => {
            if (
              key.startsWith("custom_") &&
              sectionData?.items &&
              sectionData.items.length > 0
            ) {
              return `
            <div class="section">
              <h2 class="section-title">${
                sectionData.title ||
                key
                  .replace(/^custom_/, "")
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()) ||
                "Custom Section"
              }</h2>
              ${sectionData.items
                .map(
                  (item: any, index: number) => `
                <div class="education-item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${item.title}</div>
                    </div>
                  </div>
                  ${
                    item.description
                      ? `<div class="item-description">${processDescription(
                          item.description
                        )}</div>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `;
            }
            return "";
          })
          .join("")}
        </div>
      </div>
    </body>
    </html>
  `;
}
