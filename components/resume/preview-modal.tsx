import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { ResumePreview } from "./resume-preview"
import { PDFExport } from "./pdf-export"
import Link from "next/link"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  resumeData: any
  resumeId: string
  resumeTitle: string
}

export function PreviewModal({ isOpen, onClose, resumeData, resumeId, resumeTitle }: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{resumeTitle} - Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Link href={`/resume/${resumeId}/preview`} target="_blank">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full Screen
                </Button>
              </Link>
              <PDFExport resumeId={resumeId} resumeTitle={resumeTitle} variant="outline" size="sm" />
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <ResumePreview data={resumeData} className="scale-75 origin-top" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
