"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

interface AIAssistantProps {
  sectionType:
    | "experience"
    | "skills"
    | "summary"
    | "education"
    | "custom"
    | "personal_info";
  currentContent: string;
  jobTitle?: string;
  industry?: string;
  customSectionTitle?: string;
  onApplySuggestion: (suggestion: string) => void;
}

export function AIAssistant({
  sectionType,
  currentContent,
  jobTitle,
  industry,
  customSectionTitle,
  onApplySuggestion,
}: AIAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [copied, setCopied] = useState(false);

  const getSuggestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/suggest-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          currentContent,
          jobTitle,
          industry,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Failed to get suggestion: ${errorMessage}`);
      }

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error("AI suggestion error:", error);
      // You could also show a toast notification here
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copySuggestion = async () => {
    await navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applySuggestion = () => {
    onApplySuggestion(suggestion);
    setSuggestion("");
  };

  const getSectionLabel = () => {
    switch (sectionType) {
      case "experience":
        return "Work Experience";
      case "skills":
        return "Skills";
      case "summary":
        return "Professional Summary";
      case "education":
        return "Education";
      case "custom":
        return customSectionTitle
          ? customSectionTitle
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")
          : "Custom Section";
      case "personal_info":
        return "Professional Summary";
      default:
        return "Content";
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI Assistant - {getSectionLabel()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button
            onClick={getSuggestion}
            disabled={isLoading || !currentContent.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Get AI Suggestions
              </>
            )}
          </Button>
          {jobTitle && (
            <Badge variant="secondary" className="text-xs">
              {jobTitle}
            </Badge>
          )}
        </div>

        {suggestion && (
          <div className="space-y-3">
            <Textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="min-h-[120px] text-sm"
              placeholder="AI suggestions will appear here..."
            />
            <div className="flex gap-2">
              <Button
                onClick={applySuggestion}
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Suggestion
              </Button>
              <Button onClick={copySuggestion} size="sm" variant="outline">
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {!currentContent.trim() && (
          <p className="text-xs text-muted-foreground">
            Add some content first to get AI suggestions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
