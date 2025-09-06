"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  last_changed_section?: {
    resume_id: string;
    section_type: string;
    title: string;
    updated_at: string;
  } | null;
}

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    if (!isClient) return "Loading...";

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatSectionType = (sectionType: string) => {
    switch (sectionType) {
      case "personal_info":
        return "Personal Information";
      case "experience":
        return "Work Experience";
      case "education":
        return "Education";
      case "skills":
        return "Skills";
      case "projects":
        return "Projects";
      case "custom":
        return "Custom Section";
      default:
        return sectionType
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  };

  const capitalizeFirstWord = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleEdit = () => {
    router.push(`/resume/${resume.id}/edit`);
  };

  const handleDuplicate = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Create a duplicate resume
      const { data: newResume, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${resume.title} (Copy)`,
          template_id: resume.template_id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error duplicating resume:", error);
        return;
      }

      // Copy all sections from the original resume
      const { data: sections } = await supabase
        .from("resume_sections")
        .select("*")
        .eq("resume_id", resume.id);

      if (sections && sections.length > 0) {
        const newSections = sections.map((section) => ({
          resume_id: newResume.id,
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          order_index: section.order_index,
        }));

        await supabase.from("resume_sections").insert(newSections);
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error duplicating resume:", error);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (error) {
        console.error("Error deleting resume:", error);
        return;
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group h-[320px] flex flex-col py-0 gap-0">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                {resume.title}
              </h3>
              <p className="text-sm text-gray-500">
                Created {formatDate(resume.created_at)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant={resume.is_published ? "default" : "secondary"}>
            {resume.is_published ? "Published" : "Draft"}
          </Badge>
          <span className="text-xs text-gray-500 capitalize">
            {resume.template_id} template
          </span>
        </div>

        {resume.last_changed_section && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">Last changed:</div>
            <div className="text-sm text-gray-700 font-medium">
              {capitalizeFirstWord(resume.last_changed_section.title) ||
                formatSectionType(resume.last_changed_section.section_type)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(resume.last_changed_section.updated_at)}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          onClick={handleEdit}
          className="w-full bg-transparent"
          variant="outline"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Resume
        </Button>
      </CardFooter>
    </Card>
  );
}
