"use client";

import React, { useRef } from "react";
import { useResume } from "../context/ResumeContext";
import { Download } from "lucide-react";

const ResumePreview = () => {
    const { resumeData } = useResume();
    const resumeRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (typeof window !== "undefined") {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = resumeRef.current;
            if (element) {
                const opt = {
                    margin: 0,
                    filename: "resume.pdf",
                    image: { type: "jpeg" as const, quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
                };
                html2pdf().set(opt).from(element).save();
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-transparent">
            <div className="p-4 flex justify-end">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-[#37352F] px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all border border-[#E0E0E0] text-sm font-medium text-[var(--accent-blue)]"
                >
                    <Download size={16} /> Export PDF
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                <div
                    ref={resumeRef}
                    className="bg-white w-[8.5in] min-h-[11in] shadow-lg p-12 text-[#37352F] relative overflow-hidden"
                    style={{ fontSize: "14px", lineHeight: "1.6" }}
                >
                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-green)] to-[var(--accent-orange)] opacity-80"></div>

                    {/* Header */}
                    <header className="mb-10 flex justify-between items-start gap-6">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-[#37352F] mb-2 tracking-tight">
                                {resumeData.personalInfo.fullName || "Your Name"}
                            </h1>
                            <p className="text-xl text-[var(--accent-blue)] mb-4 font-medium">
                                {resumeData.personalInfo.title || "Professional Title"}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#787774]">
                                {resumeData.personalInfo.email && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]"></span>
                                        {resumeData.personalInfo.email}
                                    </span>
                                )}
                                {resumeData.personalInfo.phone && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"></span>
                                        {resumeData.personalInfo.phone}
                                    </span>
                                )}
                                {resumeData.personalInfo.location && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)]"></span>
                                        {resumeData.personalInfo.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        {resumeData.personalInfo.photoUrl && (
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--notion-gray)] shadow-sm shrink-0">
                                <img
                                    src={resumeData.personalInfo.photoUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </header>

                    {/* Summary */}
                    {resumeData.summary && (
                        <section className="mb-8 relative">
                            <h2 className="text-sm font-bold text-[var(--accent-orange)] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[var(--notion-orange)] pb-1">
                                Summary
                            </h2>
                            <p className="text-[#37352F] whitespace-pre-wrap leading-relaxed">
                                {resumeData.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold text-[var(--accent-green)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-green)] pb-1">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {resumeData.experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-[var(--notion-green)]">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-[#37352F] text-lg">
                                                {exp.title}
                                            </h3>
                                            <span className="text-sm text-[#787774] font-medium bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-[var(--accent-green)] text-sm mb-2 font-semibold">
                                            {exp.company}
                                        </div>
                                        <p className="text-[#37352F] whitespace-pre-wrap text-sm leading-relaxed">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold text-[var(--accent-purple)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-purple)] pb-1">
                                Education
                            </h2>
                            <div className="space-y-4">
                                {resumeData.education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-[#37352F]">
                                                {edu.institution}
                                            </h3>
                                            <span className="text-sm text-[#787774] bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                                {edu.startDate} - {edu.endDate}
                                            </span>
                                        </div>
                                        <div className="text-[var(--accent-purple)] text-sm font-medium">{edu.degree}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-[var(--accent-red)] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[var(--notion-red)] pb-1">
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-[var(--notion-red)] text-[#37352F] px-3 py-1 rounded-full text-sm font-medium border border-transparent hover:border-[var(--accent-red)] transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
