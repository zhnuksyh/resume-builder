"use client";

import React, { useRef, useState } from "react";
import { useResume } from "../context/ResumeContext";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

const ResumePreview = () => {
    const { resumeData } = useResume();
    const resumeRef = useRef<HTMLDivElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleDownload = async () => {
        if (typeof window !== "undefined") {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = resumeRef.current;
            if (element) {
                const opt = {
                    margin: 0,
                    filename: "rouge_resume.pdf",
                    image: { type: "jpeg" as const, quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
                };
                html2pdf().set(opt).from(element).save();
            }
        }
    };

    const renderDescription = (text: string) => {
        if (!text) return null;

        const lines = text.split('\n');
        const renderedContent: React.ReactNode[] = [];
        let currentListItems: string[] = [];

        const flushList = () => {
            if (currentListItems.length > 0) {
                renderedContent.push(
                    <ul key={`list-${renderedContent.length}`} className="list-disc ml-4 space-y-1 mb-2">
                        {currentListItems.map((item, i) => (
                            <li key={i} className="text-[#37352F] text-sm leading-relaxed pl-1 marker:text-[#9B9A97]">
                                {item}
                            </li>
                        ))}
                    </ul>
                );
                currentListItems = [];
            }
        };

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                // Remove the bullet char and trim again
                currentListItems.push(trimmedLine.substring(1).trim());
            } else {
                flushList();
                if (trimmedLine) {
                    renderedContent.push(
                        <p key={`p-${index}`} className="text-[#37352F] whitespace-pre-wrap text-sm leading-relaxed break-words mb-1">
                            {line}
                        </p>
                    );
                } else {
                    // Preserve empty lines
                    renderedContent.push(<div key={`br-${index}`} className="h-2"></div>);
                }
            }
        });

        flushList();

        return <div className="text-sm">{renderedContent}</div>;
    };

    const renderExtraSection = (sectionKey: string) => {
        switch (sectionKey) {
            case "volunteering":
                if (resumeData.volunteering.length === 0) return null;
                return (
                    <section key="volunteering" className="mb-8">
                        <h2 className="text-sm font-bold text-[var(--accent-blue)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-blue)] pb-1">
                            Volunteering
                        </h2>
                        <div className="space-y-6">
                            {resumeData.volunteering.map((vol) => (
                                <div key={vol.id} className="relative pl-4 border-l-2 border-[var(--notion-blue)]">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-[#37352F] text-lg">{vol.role}</h3>
                                        <span className="text-sm text-[#787774] font-medium bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                            {vol.startDate} - {vol.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[var(--accent-blue)] text-sm mb-2 font-semibold">{vol.organization}</div>
                                    {renderDescription(vol.description)}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case "projects":
                if (resumeData.projects.length === 0) return null;
                return (
                    <section key="projects" className="mb-8">
                        <h2 className="text-sm font-bold text-[var(--accent-green)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-green)] pb-1">
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {resumeData.projects.map((proj) => (
                                <div key={proj.id} className="relative pl-4 border-l-2 border-[var(--notion-green)]">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-[#37352F] text-lg">{proj.name}</h3>
                                        <span className="text-sm text-[#787774] font-medium bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                            {proj.startDate} - {proj.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[var(--accent-green)] text-sm mb-2 font-semibold">{proj.role}</div>
                                    {renderDescription(proj.description)}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case "organizations":
                if (resumeData.organizations.length === 0) return null;
                return (
                    <section key="organizations" className="mb-8">
                        <h2 className="text-sm font-bold text-[var(--accent-purple)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-purple)] pb-1">
                            Organizations
                        </h2>
                        <div className="space-y-4">
                            {resumeData.organizations.map((org) => (
                                <div key={org.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-[#37352F]">{org.name}</h3>
                                        <span className="text-sm text-[#787774] bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                            {org.startDate} - {org.endDate}
                                        </span>
                                    </div>
                                    <div className="text-[var(--accent-purple)] text-sm font-medium">{org.role}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case "references":
                if (resumeData.references.length === 0) return null;
                return (
                    <section key="references" className="mb-8">
                        <h2 className="text-sm font-bold text-[var(--accent-orange)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--notion-orange)] pb-1">
                            References
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resumeData.references.map((ref) => (
                                <div key={ref.id} className="p-3 border border-[#E0E0E0] rounded bg-[#FAFAFA]">
                                    <h3 className="font-bold text-[#37352F]">{ref.name}</h3>
                                    <div className="text-sm text-[var(--accent-orange)] font-medium mb-1">{ref.title}</div>
                                    <div className="text-sm text-[#787774]">{ref.company}</div>
                                    <div className="text-sm text-[#787774] mt-2">{ref.email}</div>
                                    <div className="text-sm text-[#787774]">{ref.phone}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case "additionalInfo":
                if (!resumeData.additionalInfo) return null;
                return (
                    <section key="additionalInfo" className="mb-8">
                        <h2 className="text-sm font-bold text-[var(--accent-red)] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[var(--notion-red)] pb-1">
                            Additional Information
                        </h2>
                        {renderDescription(resumeData.additionalInfo)}
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Toolbar */}
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm border border-[#E0E0E0]">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-[#F7F7F5] rounded disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-medium text-[#37352F]">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 hover:bg-[#F7F7F5] rounded disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white text-[#37352F] px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all border border-[#E0E0E0] text-sm font-medium text-[var(--accent-blue)]"
                >
                    <Download size={16} /> Export PDF
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#EAEAE8]">
                <div
                    ref={resumeRef}
                    className="bg-white shadow-lg text-[#37352F] relative overflow-hidden box-border"
                    style={{
                        width: "8.5in",
                        minHeight: "11in",
                        padding: "0.75in", // Fixed padding for print layout
                    }}
                >
                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-green)] to-[var(--accent-orange)] opacity-80"></div>

                    {/* Header */}
                    <header className="mb-10 flex justify-between items-start gap-6">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-[#37352F] mb-2 tracking-tight break-words">
                                {resumeData.personalInfo.fullName || "Your Name"}
                            </h1>
                            <p className="text-xl text-[var(--accent-blue)] mb-4 font-medium break-words">
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
                            <p className="text-[#37352F] whitespace-pre-wrap leading-relaxed break-words">
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
                                            <h3 className="font-bold text-[#37352F] text-lg">{exp.title}</h3>
                                            <span className="text-sm text-[#787774] font-medium bg-[var(--notion-gray)] px-2 py-0.5 rounded">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        <div className="text-[var(--accent-green)] text-sm mb-2 font-semibold">
                                            {exp.company}
                                        </div>
                                        {renderDescription(exp.description)}
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
                                            <h3 className="font-bold text-[#37352F]">{edu.institution}</h3>
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
                        <section className="mb-8">
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

                    {/* Extra Sections (Reorderable) */}
                    {resumeData.sectionOrder.map((sectionKey) => renderExtraSection(sectionKey))}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
