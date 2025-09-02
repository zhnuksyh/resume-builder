"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye } from "lucide-react"
import { ResumePreview } from "./resume-preview"
import Link from "next/link"

interface LivePreviewPanelProps {
  resumeData: any
  resumeId: string
  resumeTitle: string
  onOpenFullPreview: () => void
}

export function LivePreviewPanel({ resumeData, resumeId, resumeTitle, onOpenFullPreview }: LivePreviewPanelProps) {
  return (
    <Card className="h-fit max-h-[calc(100vh-200px)] overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onOpenFullPreview}>
              <Eye className="h-4 w-4 mr-1" />
              Modal
            </Button>
            <Link href={`/resume/${resumeId}/preview`} target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Full
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-y-auto max-h-[calc(100vh-280px)] p-4">
          <div className="transform scale-50 origin-top-left w-[200%]">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
