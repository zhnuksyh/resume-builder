"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";

interface AIAssistantProps {
  sectionType: "experience" | "skills" | "summary" | "education" | "custom";
  currentContent: string;
  jobTitle?: string;
  industry?: string;
  onApplySuggestion: (suggestion: string) => void;
}

export function AIAssistant({
  sectionType,
  currentContent,
  jobTitle,
  industry,
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

      if (!response.ok) throw new Error("Failed to get suggestion");

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error("AI suggestion error:", error);
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
        return "Professional Summary";
      default:
        return "Content";
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-700">
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
            className="bg-purple-600 hover:bg-purple-700"
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
          <p className="text-xs text-gray-500">
            Add some content first to get AI suggestions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
