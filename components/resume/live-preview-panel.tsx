"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumePreview } from "./resume-preview";
import { PDFExport } from "./pdf-export";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface LivePreviewPanelProps {
  resumeData: any;
  resumeId: string;
  resumeTitle: string;
}

export function LivePreviewPanel({
  resumeData,
  resumeId,
  resumeTitle,
}: LivePreviewPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");

  // Advanced pagination logic with better content estimation
  const { pages, totalPages } = useMemo(() => {
    const { personalInfo, experience, education, skills } = resumeData;

    // A4 page content height in mm (297mm - 30mm margins = 267mm available)
    const PAGE_HEIGHT = 267;
    const HEADER_HEIGHT = 65; // Personal info header (reduced)
    const SECTION_TITLE_HEIGHT = 10; // Section title height (reduced)
    const EXPERIENCE_ITEM_HEIGHT = 40; // Per experience item (reduced)
    const EDUCATION_ITEM_HEIGHT = 32; // Per education item (reduced)
    const SKILLS_HEIGHT = 25; // Skills section height (reduced)
    const SECTION_SPACING = 6; // Spacing between sections (reduced)

    const pageArray: Array<Array<{ type: string; content: any }>> = [];
    let currentPageItems: Array<{ type: string; content: any }> = [];
    let currentHeight = 0;

    const addItemToPage = (type: string, content: any, itemHeight: number) => {
      // Check if we need to start a new page
      if (
        currentHeight + itemHeight > PAGE_HEIGHT &&
        currentPageItems.length > 0
      ) {
        // Start new page
        pageArray.push([...currentPageItems]);
        currentPageItems = [{ type, content }];
        currentHeight = itemHeight;
      } else {
        currentPageItems.push({ type, content });
        currentHeight += itemHeight;
      }
    };

    // Helper function to calculate dynamic content height
    const calculateContentHeight = (content: any, baseHeight: number) => {
      if (content?.summary) {
        // Estimate height based on summary length
        const summaryLines = Math.ceil(content.summary.length / 80); // ~80 chars per line
        return baseHeight + summaryLines * 4; // 4mm per line
      }
      if (content?.description) {
        // Estimate height based on description length
        const descLines = Math.ceil(content.description.length / 80);
        return baseHeight + descLines * 4;
      }
      return baseHeight;
    };

    // Personal Info (always on first page)
    if (personalInfo) {
      const personalHeight = calculateContentHeight(
        personalInfo,
        HEADER_HEIGHT
      );
      addItemToPage("personalInfo", personalInfo, personalHeight);
    }

    // Experience section - improved pagination
    if (experience?.items?.length > 0) {
      // Calculate total height for all experience items
      let totalExpHeight = SECTION_TITLE_HEIGHT + SECTION_SPACING;
      experience.items.forEach((item: any) => {
        totalExpHeight += calculateContentHeight(item, EXPERIENCE_ITEM_HEIGHT);
      });

      // Check if we can fit the entire experience section
      if (
        currentHeight + totalExpHeight <= PAGE_HEIGHT ||
        currentPageItems.length === 0
      ) {
        addItemToPage("experience", experience, totalExpHeight);
      } else {
        // Split experience items across pages intelligently
        const availableHeight = PAGE_HEIGHT - currentHeight;
        const sectionHeaderHeight = SECTION_TITLE_HEIGHT + SECTION_SPACING;

        if (availableHeight > sectionHeaderHeight + EXPERIENCE_ITEM_HEIGHT) {
          // Can fit at least one item on current page
          const remainingHeight = availableHeight - sectionHeaderHeight;
          let itemsOnCurrentPage = 0;
          let currentItemHeight = 0;

          for (let i = 0; i < experience.items.length; i++) {
            const itemHeight = calculateContentHeight(
              experience.items[i],
              EXPERIENCE_ITEM_HEIGHT
            );
            if (currentItemHeight + itemHeight <= remainingHeight) {
              currentItemHeight += itemHeight;
              itemsOnCurrentPage++;
            } else {
              break;
            }
          }

          if (itemsOnCurrentPage > 0) {
            // Add partial experience section to current page
            const partialExp = {
              items: experience.items.slice(0, itemsOnCurrentPage),
              isPartial: true,
            };
            addItemToPage(
              "experience",
              partialExp,
              sectionHeaderHeight + currentItemHeight
            );

            // Add remaining items to new pages
            const remainingItems = experience.items.slice(itemsOnCurrentPage);
            if (remainingItems.length > 0) {
              const remainingExp = { items: remainingItems };
              const remainingHeight =
                sectionHeaderHeight +
                remainingItems.reduce(
                  (sum: number, item: any) =>
                    sum + calculateContentHeight(item, EXPERIENCE_ITEM_HEIGHT),
                  0
                );
              addItemToPage("experience", remainingExp, remainingHeight);
            }
          } else {
            // Start new page for experience section
            addItemToPage("experience", experience, totalExpHeight);
          }
        } else {
          // Start new page for experience section
          addItemToPage("experience", experience, totalExpHeight);
        }
      }
    }

    // Education section - improved pagination
    if (education?.items?.length > 0) {
      // Calculate total height for all education items
      let totalEduHeight = SECTION_TITLE_HEIGHT + SECTION_SPACING;
      education.items.forEach((item: any) => {
        totalEduHeight += calculateContentHeight(item, EDUCATION_ITEM_HEIGHT);
      });

      if (
        currentHeight + totalEduHeight <= PAGE_HEIGHT ||
        currentPageItems.length === 0
      ) {
        addItemToPage("education", education, totalEduHeight);
      } else {
        // Split education items across pages intelligently
        const availableHeight = PAGE_HEIGHT - currentHeight;
        const sectionHeaderHeight = SECTION_TITLE_HEIGHT + SECTION_SPACING;

        if (availableHeight > sectionHeaderHeight + EDUCATION_ITEM_HEIGHT) {
          // Can fit at least one item on current page
          const remainingHeight = availableHeight - sectionHeaderHeight;
          let itemsOnCurrentPage = 0;
          let currentItemHeight = 0;

          for (let i = 0; i < education.items.length; i++) {
            const itemHeight = calculateContentHeight(
              education.items[i],
              EDUCATION_ITEM_HEIGHT
            );
            if (currentItemHeight + itemHeight <= remainingHeight) {
              currentItemHeight += itemHeight;
              itemsOnCurrentPage++;
            } else {
              break;
            }
          }

          if (itemsOnCurrentPage > 0) {
            // Add partial education section to current page
            const partialEdu = {
              items: education.items.slice(0, itemsOnCurrentPage),
              isPartial: true,
            };
            addItemToPage(
              "education",
              partialEdu,
              sectionHeaderHeight + currentItemHeight
            );

            // Add remaining items to new pages
            const remainingItems = education.items.slice(itemsOnCurrentPage);
            if (remainingItems.length > 0) {
              const remainingEdu = { items: remainingItems };
              const remainingHeight =
                sectionHeaderHeight +
                remainingItems.reduce(
                  (sum: number, item: any) =>
                    sum + calculateContentHeight(item, EDUCATION_ITEM_HEIGHT),
                  0
                );
              addItemToPage("education", remainingEdu, remainingHeight);
            }
          } else {
            // Start new page for education section
            addItemToPage("education", education, totalEduHeight);
          }
        } else {
          // Start new page for education section
          addItemToPage("education", education, totalEduHeight);
        }
      }
    }

    // Skills section
    if (skills?.skills?.length > 0) {
      const skillsHeight =
        SECTION_TITLE_HEIGHT + SECTION_SPACING + SKILLS_HEIGHT;
      addItemToPage("skills", skills, skillsHeight);
    }

    // Add the last page if it has content
    if (currentPageItems.length > 0) {
      pageArray.push(currentPageItems);
    }

    // Ensure at least one page exists
    if (pageArray.length === 0) {
      pageArray.push([]);
    }

    return { pages: pageArray, totalPages: pageArray.length };
  }, [resumeData]);

  // Update page input when current page changes
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // Navigation functions
  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(
    () => setCurrentPage(totalPages),
    [totalPages]
  );
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);
  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  // Handle page input change
  const handlePageInputChange = (value: string) => {
    setPageInputValue(value);
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevPage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextPage();
          break;
        case "Home":
          e.preventDefault();
          goToFirstPage();
          break;
        case "End":
          e.preventDefault();
          goToLastPage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage, goToFirstPage, goToLastPage]);

  // Get content for current page
  const currentPageContent = pages[currentPage - 1] || [];

  return (
    <Card className="h-fit overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              A4 Format
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PDFExport
              resumeId={resumeId}
              resumeTitle={resumeTitle}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col items-center px-4 pt-1 pb-2 min-h-[400px]">
          {/* A4 Paper Container */}
          <div className="a4-live-preview">
            <div className="a4-preview-container">
              <ResumePreview
                data={currentPageContent}
                isA4Preview={true}
                isPageContent={true}
              />
            </div>
          </div>

          {/* Enhanced Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-3 mt-8 p-2 bg-gray-50 rounded-lg border">
              {/* First page */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                title="First page (Home)"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous page */}
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                title="Previous page (←)"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page input */}
              <div className="flex items-center gap-2 text-sm">
                <span>Page</span>
                <Input
                  type="number"
                  value={pageInputValue}
                  onChange={(e) => handlePageInputChange(e.target.value)}
                  className="w-16 h-8 text-center text-sm"
                  min={1}
                  max={totalPages}
                />
                <span>of {totalPages}</span>
              </div>

              {/* Next page */}
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                title="Next page (→)"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last page */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                title="Last page (End)"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Single page message */}
          {totalPages === 1 && (
            <div className="mt-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded">
              Single page • A4 format
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
