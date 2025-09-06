"use client";

import { ResumeCard } from "./resume-card";

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

interface ResumeGridProps {
  resumes: Resume[];
}

export function ResumeGrid({ resumes }: ResumeGridProps) {
  if (resumes.length === 0) {
    return null;
  }

  return (
    <>
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </>
  );
}
