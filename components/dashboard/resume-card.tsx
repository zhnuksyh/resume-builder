"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreVertical, Edit, Copy, Trash2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Resume {
  id: string
  title: string
  template_id: string
  is_published: boolean
  created_at: string
  updated_at: string
}

interface ResumeCardProps {
  resume: Resume
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleEdit = () => {
    router.push(`/resume/${resume.id}/edit`)
  }

  const handleDuplicate = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Create a duplicate resume
      const { data: newResume, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: `${resume.title} (Copy)`,
          template_id: resume.template_id,
        })
        .select()
        .single()

      if (error) {
        console.error("Error duplicating resume:", error)
        return
      }

      // Copy all sections from the original resume
      const { data: sections } = await supabase.from("resume_sections").select("*").eq("resume_id", resume.id)

      if (sections && sections.length > 0) {
        const newSections = sections.map((section) => ({
          resume_id: newResume.id,
          section_type: section.section_type,
          title: section.title,
          content: section.content,
          order_index: section.order_index,
        }))

        await supabase.from("resume_sections").insert(newSections)
      }

      // Refresh the page
      window.location.reload()
    } catch (error) {
      console.error("Error duplicating resume:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("resumes").delete().eq("id", resume.id)

      if (error) {
        console.error("Error deleting resume:", error)
        return
      }

      // Refresh the page
      window.location.reload()
    } catch (error) {
      console.error("Error deleting resume:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {resume.title}
              </h3>
              <p className="text-sm text-gray-500">Updated {formatDate(resume.updated_at)}</p>
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
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={resume.is_published ? "default" : "secondary"}>
            {resume.is_published ? "Published" : "Draft"}
          </Badge>
          <span className="text-xs text-gray-500 capitalize">{resume.template_id} template</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button onClick={handleEdit} className="w-full bg-transparent" variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Resume
        </Button>
      </CardFooter>
    </Card>
  )
}
