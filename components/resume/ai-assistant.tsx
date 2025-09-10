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
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion("");

    try {
      const response = await fetch("/api/ai/suggest-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          currentContent,
          jobTitle,
          industry,
          customSectionTitle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to get suggestion`
        );
      }

      if (!data.suggestion) {
        throw new Error("No suggestion received from AI service");
      }

      setSuggestion(data.suggestion);
    } catch (error) {
      console.error("AI suggestion error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
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
            disabled={isLoading}
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

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 font-medium">Error:</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
            <Button
              onClick={() => setError(null)}
              size="sm"
              variant="outline"
              className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              Dismiss
            </Button>
          </div>
        )}

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
            Please add some content first to get AI suggestions
          </p>
        )}

        {error && error.includes("AI service configuration") && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-700">
              <strong>Setup Required:</strong> The AI service needs to be
              configured. Please ensure the GOOGLE_GENERATIVE_AI_API_KEY
              environment variable is set.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
