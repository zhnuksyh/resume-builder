import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import puppeteer from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
          title: section.title || section.content.title, // Use database title first, then content title
        };
      }
    });

    // Generate HTML for PDF
    const html = generateResumeHTML(resumeData, resume.title);

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
        top: "0.6in",
        right: "0.6in",
        bottom: "0.6in",
        left: "0.6in",
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

function generateResumeHTML(data: any, title: string): string {
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
          return `<div style="display: flex; align-items: flex-start; margin-bottom: 0.125rem;">
          <span style="margin-right: 0.5rem;">•</span>
          <span style="flex: 1;">${trimmedLine.substring(1).trim()}</span>
        </div>`;
        } else if (/^\d+\./.test(trimmedLine)) {
          const match = trimmedLine.match(/^(\d+)\.\s*(.*)/);
          if (match) {
            return `<div style="display: flex; align-items: flex-start; margin-bottom: 0.125rem;">
            <span style="margin-right: 0.5rem;">${match[1]}.</span>
            <span style="flex: 1;">${match[2]}</span>
          </div>`;
          }
        }
        return `<p style="margin-bottom: 0.125rem;">${line}</p>`;
      })
      .join("");
  };

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
          line-height: 1.25;
          color: #333;
          background: white;
        }
        
        .resume {
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          padding: 15mm;
          background: white;
        }
        
        .header {
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .name {
          font-size: 1.25rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.375rem;
          line-height: 1.25;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .summary {
          color: #374151;
          line-height: 1.25;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: justify;
        }
        
        .section {
          margin-bottom: 0.75rem;
        }
        
        .section-title {
          font-size: 1rem;
          font-weight: bold;
          color: #111827;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 0.25rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .experience-section-title {
          font-size: 1rem;
          font-weight: bold;
          color: #111827;
          border-bottom: 1px solid #d1d5db;
          padding-bottom: 0.25rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        
        .experience-item {
          margin-bottom: 0.625rem;
        }
        
        .education-item {
          margin-bottom: 0.5rem;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }
        
        .item-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.25;
        }
        
        .item-company {
          color: #2563eb;
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
          line-height: 1.25;
        }
        
        .item-description {
          color: #374151;
          line-height: 1.25;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          text-align: justify;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        
        .skill-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          border: 1px solid #d1d5db;
        }
        
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
            line-height: 1.25 !important;
          }
          .resume { 
            margin: 0; 
            padding: 15mm; 
            page-break-inside: avoid;
            width: 210mm !important;
            height: 297mm !important;
          }
          .resume * {
            line-height: 1.25 !important;
          }
          .resume h1, .resume h2, .resume h3 {
            margin-top: 0 !important;
            margin-bottom: 0.25rem !important;
          }
          .resume p {
            margin-top: 0 !important;
            margin-bottom: 0.125rem !important;
          }
          .section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .experience-item, .education-item {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 0;
          }
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
              ${
                personalInfo.email
                  ? `<div class="contact-item">📧 ${personalInfo.email}</div>`
                  : ""
              }
              ${
                personalInfo.phone
                  ? `<div class="contact-item">📞 ${personalInfo.phone}</div>`
                  : ""
              }
              ${
                personalInfo.location
                  ? `<div class="contact-item">📍 ${personalInfo.location}</div>`
                  : ""
              }
              ${
                personalInfo.website
                  ? `<div class="contact-item">🌐 ${personalInfo.website}</div>`
                  : ""
              }
              ${
                personalInfo.linkedin
                  ? `<div class="contact-item">💼 ${personalInfo.linkedin}</div>`
                  : ""
              }
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
                  .replace(/\b\w/g, (l) => l.toUpperCase())
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
    </body>
    </html>
  `;
}
