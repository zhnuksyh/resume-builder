"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface CustomSectionProps {
  content: any;
  onSave: (content: any) => void;
  onDelete?: () => void;
}

interface CustomItem {
  id: string;
  title: string;
  description: string;
}

export function CustomSection({
  content,
  onSave,
  onDelete,
}: CustomSectionProps) {
  const [items, setItems] = useState<CustomItem[]>(content.items || []);

  const addItem = () => {
    const newItem: CustomItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof CustomItem, value: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    onSave({ items });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Label>Item {items.indexOf(item) + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(item.id, "title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, "description", e.target.value)
                }
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={addItem} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
