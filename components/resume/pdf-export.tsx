"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { ResumeColor } from "./color-picker";

interface PDFExportProps {
  resumeId: string;
  resumeTitle: string;
  colorTheme?: ResumeColor;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function PDFExport({
  resumeId,
  resumeTitle,
  colorTheme = "purple",
  variant = "outline",
  size = "sm",
}: PDFExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF using server-side endpoint
      const response = await fetch(
        `/api/resume/${resumeId}/pdf?colorTheme=${colorTheme}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();

      // Create download link and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeTitle
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={generatePDF}
      disabled={isGenerating}
    >
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
  );
}
