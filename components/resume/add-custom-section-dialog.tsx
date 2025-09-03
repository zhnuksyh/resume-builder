"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddCustomSectionDialogProps {
  onAddSection: (title: string) => void;
  trigger?: React.ReactNode;
}

export function AddCustomSectionDialog({
  onAddSection,
  trigger,
}: AddCustomSectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("volunteering");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddSection(title.trim());
    setTitle("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-transparent" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Custom Section</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Section</DialogTitle>
          <DialogDescription>
            Select the type of section you want to add
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Section Type</Label>
              <Select value={title} onValueChange={setTitle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteering">Volunteering</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="organizations">Organizations</SelectItem>
                  <SelectItem value="additional information">
                    Additional Information
                  </SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
