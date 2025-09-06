"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "./resume-preview";
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

interface PaginatedResumePreviewProps {
  data: ResumeData;
  className?: string;
  colorTheme?: ResumeColor;
}

interface PageContent {
  personalInfo?: any;
  experience?: any;
  education?: any;
  skills?: any;
  [key: string]: any; // Allow custom sections at root level
}

export function PaginatedResumePreview({
  data,
  className = "",
  colorTheme = "purple",
}: PaginatedResumePreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageContent[]>([]);

  // Function to estimate content height in pixels for A4 preview
  const estimateContentHeight = (content: any, type: string): number => {
    const baseHeights = {
      personalInfo: 80, // Base height for personal info section
      experienceItem: 60, // Base height per experience item
      educationItem: 45, // Base height per education item
      skills: 40, // Base height for skills section
      customSection: 50, // Base height for custom sections
      sectionTitle: 25, // Height for section titles
      sectionSpacing: 20, // Spacing between sections
    };

    let height = 0;

    switch (type) {
      case "personalInfo":
        height = baseHeights.personalInfo;
        if (content?.summary) {
          // Estimate height based on summary length (roughly 60 chars per line)
          const summaryLines = Math.ceil(content.summary.length / 60);
          height += summaryLines * 16; // 16px per line
        }
        break;

      case "experienceItem":
        height = baseHeights.experienceItem;
        if (content?.description) {
          // Estimate height based on description length
          const descLines = Math.ceil(content.description.length / 60);
          height += descLines * 14; // 14px per line
        }
        break;

      case "educationItem":
        height = baseHeights.educationItem;
        if (content?.description) {
          const descLines = Math.ceil(content.description.length / 60);
          height += descLines * 14;
        }
        break;

      case "skills":
        height = baseHeights.skills;
        if (content?.skills?.length) {
          // Estimate height based on number of skills (roughly 8 skills per line)
          const skillLines = Math.ceil(content.skills.length / 8);
          height += skillLines * 20;
        }
        break;

      case "customSection":
        height = baseHeights.customSection;
        if (content?.items?.length) {
          height += content.items.length * 40; // 40px per custom item
        }
        break;
    }

    return height;
  };

  // Function to split content into pages based on precise A4 space utilization
  const splitContentIntoPages = (resumeData: ResumeData): PageContent[] => {
    const pages: PageContent[] = [];

    // A4 page dimensions in pixels (at 96 DPI)
    const A4_WIDTH = 794; // 210mm
    const A4_HEIGHT = 1123; // 297mm
    const PADDING = 80; // 40px top + 40px bottom
    const AVAILABLE_HEIGHT = A4_HEIGHT - PADDING;

    const experienceItems = resumeData.experience?.items || [];
    const educationItems = resumeData.education?.items || [];
    const skills = resumeData.skills;
    const customSections = Object.keys(resumeData).filter((key) =>
      key.startsWith("custom_")
    );

    // Start with first page
    let currentPage: PageContent = {};
    let currentHeight = 0;
    let isFirstPage = true;

    // Add personal info to first page
    if (resumeData.personalInfo) {
      const personalHeight = estimateContentHeight(
        resumeData.personalInfo,
        "personalInfo"
      );
      currentPage.personalInfo = resumeData.personalInfo;
      currentHeight += personalHeight;
    }

    // Add experience items
    if (experienceItems.length > 0) {
      const sectionTitleHeight = estimateContentHeight({}, "sectionTitle");
      currentHeight +=
        sectionTitleHeight + estimateContentHeight({}, "sectionSpacing");

      const experienceItemsToAdd: any[] = [];

      for (const item of experienceItems) {
        const itemHeight = estimateContentHeight(item, "experienceItem");

        // Check if adding this item would exceed page height
        if (
          currentHeight + itemHeight > AVAILABLE_HEIGHT &&
          experienceItemsToAdd.length > 0
        ) {
          // Add current experience items to page and start new page
          currentPage.experience = {
            ...resumeData.experience,
            items: experienceItemsToAdd,
            isPartial: true,
          };
          pages.push(currentPage);

          // Start new page
          currentPage = {};
          currentHeight =
            sectionTitleHeight + estimateContentHeight({}, "sectionSpacing");
          experienceItemsToAdd.length = 0;
          isFirstPage = false;
        }

        experienceItemsToAdd.push(item);
        currentHeight += itemHeight;
      }

      // Add remaining experience items
      if (experienceItemsToAdd.length > 0) {
        currentPage.experience = {
          ...resumeData.experience,
          items: experienceItemsToAdd,
          isPartial: experienceItemsToAdd.length < experienceItems.length,
        };
      }
    }

    // Add education section
    if (educationItems.length > 0) {
      const sectionTitleHeight = estimateContentHeight({}, "sectionTitle");
      const sectionSpacing = estimateContentHeight({}, "sectionSpacing");

      // Check if we can fit education on current page
      let educationHeight = sectionTitleHeight + sectionSpacing;
      educationItems.forEach((item) => {
        educationHeight += estimateContentHeight(item, "educationItem");
      });

      if (currentHeight + educationHeight > AVAILABLE_HEIGHT) {
        // Add current page and start new page for education
        pages.push(currentPage);
        currentPage = {};
        currentHeight = sectionTitleHeight + sectionSpacing;
        isFirstPage = false;
      }

      currentPage.education = resumeData.education;
      currentHeight += educationHeight;
    }

    // Add skills section
    if (skills?.skills?.length > 0) {
      const sectionTitleHeight = estimateContentHeight({}, "sectionTitle");
      const sectionSpacing = estimateContentHeight({}, "sectionSpacing");
      const skillsHeight = estimateContentHeight(skills, "skills");

      if (
        currentHeight + sectionTitleHeight + sectionSpacing + skillsHeight >
        AVAILABLE_HEIGHT
      ) {
        // Add current page and start new page for skills
        pages.push(currentPage);
        currentPage = {};
        currentHeight = sectionTitleHeight + sectionSpacing;
        isFirstPage = false;
      }

      currentPage.skills = skills;
      currentHeight += sectionTitleHeight + sectionSpacing + skillsHeight;
    }

    // Add custom sections
    customSections.forEach((sectionKey) => {
      const sectionData = resumeData[sectionKey];
      if (sectionData?.items?.length > 0) {
        const sectionTitleHeight = estimateContentHeight({}, "sectionTitle");
        const sectionSpacing = estimateContentHeight({}, "sectionSpacing");
        const customHeight = estimateContentHeight(
          sectionData,
          "customSection"
        );

        if (
          currentHeight + sectionTitleHeight + sectionSpacing + customHeight >
          AVAILABLE_HEIGHT
        ) {
          // Add current page and start new page for custom section
          pages.push(currentPage);
          currentPage = {};
          currentHeight = sectionTitleHeight + sectionSpacing;
          isFirstPage = false;
        }

        // Add custom section directly to the page object
        currentPage[sectionKey] = sectionData;
        currentHeight += sectionTitleHeight + sectionSpacing + customHeight;
      }
    });

    // Add the last page if it has content
    if (Object.keys(currentPage).length > 0) {
      pages.push(currentPage);
    }

    // If no pages were created, create a single page with all content
    if (pages.length === 0) {
      pages.push({ ...resumeData });
    }

    return pages;
  };

  useEffect(() => {
    const splitPages = splitContentIntoPages(data);
    setPages(splitPages);
  }, [data]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">No content to display</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Page Content - Clean A4 preview */}
      <div className="a4-preview-paginated">
        <div className="a4-content-wrapper">
          <div
            className="a4-preview-container"
            style={{
              transform: `translateY(-${currentPage * 100}%)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <ResumePreview
              data={pages[currentPage]}
              isA4Preview={true}
              colorTheme={colorTheme}
            />
          </div>
        </div>
      </div>

      {/* Page Navigation - Below preview */}
      {pages.length > 1 && (
        <div className="flex items-center justify-between mt-8 px-4 w-full max-w-2xl">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {pages.length}
            </span>
            <div className="flex gap-1">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage
                      ? "bg-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === pages.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
