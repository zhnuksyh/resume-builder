"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, List, Hash } from "lucide-react";
import { AIAssistant } from "@/components/resume/ai-assistant";

interface CustomItem {
  id: string;
  title: string;
  description: string;
}

interface CustomContent {
  items: CustomItem[];
}

interface CustomSectionProps {
  content: CustomContent;
  onSave: (content: CustomContent) => void;
  onDelete?: () => void;
  onContentChange?: (content: CustomContent) => void;
}

export function CustomSection({
  content,
  onSave,
  onDelete,
  onContentChange,
}: CustomSectionProps) {
  const [formData, setFormData] = useState<CustomContent>({ items: [] });

  useEffect(() => {
    setFormData(content.items ? content : { items: [] });
  }, [content]);

  const addItem = () => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    const newFormData = { items: [...formData.items, newItem] };
    setFormData(newFormData);
    onContentChange?.(newFormData);
  };

  const updateItem = (id: string, field: keyof CustomItem, value: string) => {
    const newFormData = {
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    };
    setFormData(newFormData);
    onContentChange?.(newFormData);
  };

  const removeItem = (id: string) => {
    const newFormData = {
      items: formData.items.filter((item) => item.id !== id),
    };
    setFormData(newFormData);
    onContentChange?.(newFormData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleAISuggestion = (itemId: string, suggestion: string) => {
    updateItem(itemId, "description", suggestion);
  };

  const formatAsBulletPoints = (itemId: string) => {
    const item = formData.items.find((item) => item.id === itemId);
    if (!item || !item.description) return;

    const lines = item.description.split("\n").filter((line) => line.trim());
    const bulletPoints = lines
      .map((line) => {
        const trimmed = line.trim();
        // If already a bullet point, keep as is
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          return trimmed;
        }
        // If it's a numbered list, remove the number and add bullet
        if (/^\d+\./.test(trimmed)) {
          const match = trimmed.match(/^\d+\.\s*(.*)/);
          return match ? `• ${match[1]}` : `• ${trimmed}`;
        }
        // Otherwise, add bullet point
        return `• ${trimmed}`;
      })
      .join("\n");

    updateItem(itemId, "description", bulletPoints);
  };

  const formatAsNumberedList = (itemId: string) => {
    const item = formData.items.find((item) => item.id === itemId);
    if (!item || !item.description) return;

    const lines = item.description.split("\n").filter((line) => line.trim());
    const numberedList = lines
      .map((line, index) => {
        const trimmed = line.trim();
        // If already numbered, keep as is
        if (/^\d+\./.test(trimmed)) {
          return trimmed;
        }
        // If it's a bullet point, remove the bullet and add number
        if (
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*")
        ) {
          return `${index + 1}. ${trimmed.substring(1).trim()}`;
        }
        // Otherwise, add number
        return `${index + 1}. ${trimmed}`;
      })
      .join("\n");

    updateItem(itemId, "description", numberedList);
  };

  return (
    <div className="space-y-6">
      {formData.items.map((item, index) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Item {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsBulletPoints(item.id)}
                    className="h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formatAsNumberedList(item.id)}
                    className="h-8 px-2"
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                placeholder="Enter description"
                rows={4}
              />
            </div>
            {item.title && (
              <AIAssistant
                sectionType="summary"
                currentContent={item.description}
                onApplySuggestion={(suggestion) =>
                  handleAISuggestion(item.id, suggestion)
                }
              />
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addItem}
        variant="outline"
        className="w-full bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
