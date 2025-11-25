"use client";

import React, { useState, useRef } from "react";
import { useResume } from "../context/ResumeContext";
import { Plus, Trash2, X, Upload, Check, Info, List, Sparkles, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

const TABS = [
    { id: "personal", label: "Personal", color: "blue" },
    { id: "summary", label: "Summary", color: "orange" },
    { id: "experience", label: "Experience", color: "green" },
    { id: "education", label: "Education", color: "purple" },
    { id: "skills", label: "Skills", color: "red" },
    { id: "extra", label: "Extra", color: "gray" },
] as const;

const SECTION_LABELS: Record<string, string> = {
    volunteering: "Volunteering",
    projects: "Projects",
    organizations: "Organizations",
    references: "References",
    additionalInfo: "Additional Info",
};

const Input = ({
    label,
    tooltip,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; tooltip?: string }) => (
    <div className="group relative">
        {label && (
            <label className="block text-xs font-medium text-[#9B9A97] mb-1 uppercase tracking-wider flex items-center gap-1">
                {label}
                {tooltip && (
                    <div className="relative group/tooltip cursor-help">
                        <Info size={12} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#37352F] text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>
        )}
        <div className="relative">
            <input
                {...props}
                className="w-full bg-transparent border-b border-[#E0E0E0] focus:border-[var(--accent-blue)] px-1 py-2 outline-none transition-colors placeholder-[#9B9A97] text-sm peer"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--accent-green)] opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                <Check size={14} />
            </div>
        </div>
    </div>
);

const TextArea = ({
    label,
    tooltip,
    value,
    onChange,
    enableAI = false,
    aiContext = "",
    enableBullets = true,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    tooltip?: string;
    enableAI?: boolean;
    aiContext?: string;
    enableBullets?: boolean;
}) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleBulletClick = () => {
        const textarea = document.getElementById(props.id || "") as HTMLTextAreaElement;
        // Simple append if not selected, or wrap selection
        // For simplicity, we just append a bullet
        const newValue = value ? value + "\n• " : "• ";
        const event = {
            target: { value: newValue },
            currentTarget: { value: newValue },
        } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        onChange?.(event);
    };

    const handleAIGenerate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Write a description for ${label}.`,
                    context: aiContext,
                }),
            });
            const data = await response.json();
            if (data.text) {
                const event = {
                    target: { value: data.text },
                    currentTarget: { value: data.text },
                } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
                onChange?.(event);
            }
        } catch (error) {
            console.error("AI Error", error);
            alert("Failed to generate content. Check API Key.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="group relative">
            <div className="flex justify-between items-end mb-1">
                {label && (
                    <label className="block text-xs font-medium text-[#9B9A97] uppercase tracking-wider flex items-center gap-1">
                        {label}
                        {tooltip && (
                            <div className="relative group/tooltip cursor-help">
                                <Info size={12} />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#37352F] text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                                    {tooltip}
                                </div>
                            </div>
                        )}
                    </label>
                )}
                <div className="flex items-center gap-1">
                    {enableBullets && (
                        <button
                            onClick={handleBulletClick}
                            className="p-1 rounded text-[#9B9A97] hover:bg-[#F1F1EF] hover:text-[#37352F] transition-colors"
                            title="Add Bullet Point"
                            type="button"
                        >
                            <List size={14} />
                        </button>
                    )}
                    {enableAI && (
                        <button
                            onClick={handleAIGenerate}
                            disabled={isGenerating}
                            className={clsx(
                                "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-all",
                                isGenerating
                                    ? "bg-gray-100 text-gray-400 cursor-wait"
                                    : "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200"
                            )}
                            title="Generate with AI"
                            type="button"
                        >
                            <Sparkles size={12} />
                            {isGenerating ? "Generating..." : "AI Generate"}
                        </button>
                    )}
                </div>
            </div>
            <textarea
                {...props}
                value={value}
                onChange={onChange}
                className="w-full bg-[#F7F7F5] border border-transparent focus:border-[var(--accent-orange)] focus:bg-white rounded p-3 outline-none transition-all placeholder-[#9B9A97] text-sm resize-none"
            />
        </div>
    );
};

const ResumeForm = () => {
    const {
        resumeData,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        addVolunteering,
        updateVolunteering,
        removeVolunteering,
        addProject,
        updateProject,
        removeProject,
        addOrganization,
        updateOrganization,
        removeOrganization,
        updateAdditionalInfo,
        addReference,
        updateReference,
        removeReference,
        reorderSection,
    } = useResume();

    const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("personal");
    const [skillInput, setSkillInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault();
            if (!resumeData.skills.includes(skillInput.trim())) {
                updateSkills([...resumeData.skills, skillInput.trim()]);
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        updateSkills(resumeData.skills.filter((skill) => skill !== skillToRemove));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePersonalInfo("photoUrl", reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < resumeData.sectionOrder.length) {
            reorderSection(index, newIndex);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-4 border-b border-[#F1F1EF] overflow-x-auto no-scrollbar">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? `bg-[var(--notion-${tab.color})] text-[var(--notion-${tab.color}-text)] shadow-sm`
                                : "text-[#9B9A97] hover:bg-[#F7F7F5] hover:text-[#37352F]"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Personal Info Tab */}
                {activeTab === "personal" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-20 h-20 rounded-full bg-[#F7F7F5] flex items-center justify-center overflow-hidden border border-[#E0E0E0] cursor-pointer hover:bg-[#F1F1EF] transition-colors relative group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {resumeData.personalInfo.photoUrl ? (
                                    <img
                                        src={resumeData.personalInfo.photoUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Upload className="text-[#9B9A97] group-hover:text-[#37352F]" size={24} />
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-[#37352F]">Profile Photo</h3>
                                <p className="text-xs text-[#9B9A97]">Click to upload a professional headshot.</p>
                            </div>
                        </div>

                        <Input
                            label="Full Name"
                            placeholder="e.g. Jane Doe"
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                            tooltip="Use your full legal name."
                        />
                        <Input
                            label="Job Title"
                            placeholder="e.g. Software Engineer"
                            value={resumeData.personalInfo.title}
                            onChange={(e) => updatePersonalInfo("title", e.target.value)}
                            tooltip="Your current or desired professional title."
                        />
                        <Input
                            label="Email"
                            placeholder="e.g. jane@example.com"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        />
                        <Input
                            label="Phone"
                            placeholder="e.g. +1 234 567 890"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        />
                        <Input
                            label="Location"
                            placeholder="e.g. San Francisco, CA"
                            value={resumeData.personalInfo.location}
                            onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        />
                    </div>
                )}

                {/* Summary Tab */}
                {activeTab === "summary" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <TextArea
                            label="Professional Summary"
                            placeholder="Write a brief summary of your career highlights and goals..."
                            value={resumeData.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                            rows={8}
                            tooltip="Keep it concise (2-3 sentences). Focus on your unique value proposition."
                            enableBullets={false}
                            enableAI={true}
                            aiContext={`Job Title: ${resumeData.personalInfo.title}`}
                        />
                    </div>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative group">
                                <div className="absolute -left-3 top-4 w-6 h-6 bg-[var(--accent-green)] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                    {index + 1}
                                </div>
                                <div className="grid grid-cols-1 gap-4 mb-3">
                                    <Input
                                        label="Company"
                                        placeholder="Company Name"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                    />
                                    <Input
                                        label="Job Title"
                                        placeholder="Job Title"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Start Date"
                                            placeholder="MM/YYYY"
                                            value={exp.startDate}
                                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                        />
                                        <Input
                                            label="End Date"
                                            placeholder="Present"
                                            value={exp.endDate}
                                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                        />
                                    </div>
                                    <TextArea
                                        label="Description"
                                        placeholder="• Achieved X by doing Y..."
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                        rows={4}
                                        tooltip="Use bullet points. Start with action verbs."
                                        enableAI={true}
                                        aiContext={`Role: ${exp.title} at ${exp.company}`}
                                    />
                                </div>
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="text-[#D44C47] text-xs flex items-center gap-1 hover:bg-[#FBE4E4] px-2 py-1 rounded transition-colors"
                                >
                                    <Trash2 size={14} /> Remove Position
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addExperience}
                            className="flex items-center gap-2 text-white bg-[var(--accent-green)] hover:bg-[#219150] px-4 py-2 rounded shadow-sm transition-colors w-full justify-center font-medium"
                        >
                            <Plus size={16} /> Add Position
                        </button>
                    </div>
                )}

                {/* Education Tab */}
                {activeTab === "education" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative group">
                                <div className="absolute -left-3 top-4 w-6 h-6 bg-[var(--accent-purple)] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                    {index + 1}
                                </div>
                                <div className="grid grid-cols-1 gap-4 mb-3">
                                    <Input
                                        label="Institution"
                                        placeholder="University / College"
                                        value={edu.institution}
                                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                    />
                                    <Input
                                        label="Degree"
                                        placeholder="e.g. Bachelor of Science"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Start Date"
                                            placeholder="YYYY"
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                        />
                                        <Input
                                            label="End Date"
                                            placeholder="YYYY"
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="text-[#D44C47] text-xs flex items-center gap-1 hover:bg-[#FBE4E4] px-2 py-1 rounded transition-colors"
                                >
                                    <Trash2 size={14} /> Remove Education
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addEducation}
                            className="flex items-center gap-2 text-white bg-[var(--accent-purple)] hover:bg-[#7D3C98] px-4 py-2 rounded shadow-sm transition-colors w-full justify-center font-medium"
                        >
                            <Plus size={16} /> Add Education
                        </button>
                    </div>
                )}

                {/* Skills Tab */}
                {activeTab === "skills" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-4">
                            <Input
                                label="Add Skill"
                                placeholder="Type a skill and press Enter..."
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleSkillAdd}
                                tooltip="Press Enter to add. Click 'x' to remove."
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="bg-[#F1F1EF] text-[#37352F] px-3 py-1.5 rounded-full text-sm flex items-center gap-2 border border-[#E0E0E0] group hover:border-[var(--accent-red)] transition-colors"
                                >
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="text-[#9B9A97] hover:text-[var(--accent-red)]"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extra Tab (Consolidated) */}
                {activeTab === "extra" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Reorder Controls */}
                        <div className="bg-[#F7F7F5] p-3 rounded-lg border border-[#E0E0E0]">
                            <h3 className="text-xs font-bold text-[#9B9A97] uppercase tracking-wider mb-2">Section Order</h3>
                            <div className="space-y-1">
                                {resumeData.sectionOrder.map((sectionKey, index) => (
                                    <div key={sectionKey} className="flex items-center justify-between bg-white p-2 rounded border border-[#E0E0E0] shadow-sm">
                                        <span className="text-sm font-medium text-[#37352F]">{SECTION_LABELS[sectionKey]}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => moveSection(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 hover:bg-[#F1F1EF] rounded disabled:opacity-30"
                                            >
                                                <ChevronUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveSection(index, 'down')}
                                                disabled={index === resumeData.sectionOrder.length - 1}
                                                className="p-1 hover:bg-[#F1F1EF] rounded disabled:opacity-30"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Render Sections based on Order */}
                        {resumeData.sectionOrder.map((sectionKey) => {
                            if (sectionKey === "volunteering") {
                                return (
                                    <div key="volunteering" className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#37352F] border-b pb-1">Volunteering</h3>
                                        {resumeData.volunteering.map((vol) => (
                                            <div key={vol.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative">
                                                <div className="grid grid-cols-1 gap-4 mb-3">
                                                    <Input label="Organization" value={vol.organization} onChange={(e) => updateVolunteering(vol.id, "organization", e.target.value)} />
                                                    <Input label="Role" value={vol.role} onChange={(e) => updateVolunteering(vol.id, "role", e.target.value)} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Start" value={vol.startDate} onChange={(e) => updateVolunteering(vol.id, "startDate", e.target.value)} />
                                                        <Input label="End" value={vol.endDate} onChange={(e) => updateVolunteering(vol.id, "endDate", e.target.value)} />
                                                    </div>
                                                    <TextArea label="Description" value={vol.description} onChange={(e) => updateVolunteering(vol.id, "description", e.target.value)} rows={3} enableAI={true} aiContext={`Volunteer Role: ${vol.role}`} />
                                                </div>
                                                <button onClick={() => removeVolunteering(vol.id)} className="text-[#D44C47] text-xs flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                                            </div>
                                        ))}
                                        <button onClick={addVolunteering} className="flex items-center gap-2 text-[var(--accent-blue)] text-sm font-medium"><Plus size={14} /> Add Volunteering</button>
                                    </div>
                                );
                            }
                            if (sectionKey === "projects") {
                                return (
                                    <div key="projects" className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#37352F] border-b pb-1">Projects</h3>
                                        {resumeData.projects.map((proj) => (
                                            <div key={proj.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative">
                                                <div className="grid grid-cols-1 gap-4 mb-3">
                                                    <Input label="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, "name", e.target.value)} />
                                                    <Input label="Role" value={proj.role} onChange={(e) => updateProject(proj.id, "role", e.target.value)} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Start" value={proj.startDate} onChange={(e) => updateProject(proj.id, "startDate", e.target.value)} />
                                                        <Input label="End" value={proj.endDate} onChange={(e) => updateProject(proj.id, "endDate", e.target.value)} />
                                                    </div>
                                                    <TextArea label="Description" value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} rows={3} enableAI={true} aiContext={`Project: ${proj.name}`} />
                                                </div>
                                                <button onClick={() => removeProject(proj.id)} className="text-[#D44C47] text-xs flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                                            </div>
                                        ))}
                                        <button onClick={addProject} className="flex items-center gap-2 text-[var(--accent-green)] text-sm font-medium"><Plus size={14} /> Add Project</button>
                                    </div>
                                );
                            }
                            if (sectionKey === "organizations") {
                                return (
                                    <div key="organizations" className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#37352F] border-b pb-1">Organizations</h3>
                                        {resumeData.organizations.map((org) => (
                                            <div key={org.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative">
                                                <div className="grid grid-cols-1 gap-4 mb-3">
                                                    <Input label="Organization" value={org.name} onChange={(e) => updateOrganization(org.id, "name", e.target.value)} />
                                                    <Input label="Role" value={org.role} onChange={(e) => updateOrganization(org.id, "role", e.target.value)} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Start" value={org.startDate} onChange={(e) => updateOrganization(org.id, "startDate", e.target.value)} />
                                                        <Input label="End" value={org.endDate} onChange={(e) => updateOrganization(org.id, "endDate", e.target.value)} />
                                                    </div>
                                                </div>
                                                <button onClick={() => removeOrganization(org.id)} className="text-[#D44C47] text-xs flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                                            </div>
                                        ))}
                                        <button onClick={addOrganization} className="flex items-center gap-2 text-[var(--accent-purple)] text-sm font-medium"><Plus size={14} /> Add Organization</button>
                                    </div>
                                );
                            }
                            if (sectionKey === "references") {
                                return (
                                    <div key="references" className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#37352F] border-b pb-1">References</h3>
                                        {resumeData.references.map((ref) => (
                                            <div key={ref.id} className="p-4 border border-[#E0E0E0] rounded-lg bg-[#FAFAFA] relative">
                                                <div className="grid grid-cols-1 gap-4 mb-3">
                                                    <Input label="Name" value={ref.name} onChange={(e) => updateReference(ref.id, "name", e.target.value)} />
                                                    <Input label="Title" value={ref.title} onChange={(e) => updateReference(ref.id, "title", e.target.value)} />
                                                    <Input label="Company" value={ref.company} onChange={(e) => updateReference(ref.id, "company", e.target.value)} />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Email" value={ref.email} onChange={(e) => updateReference(ref.id, "email", e.target.value)} />
                                                        <Input label="Phone" value={ref.phone} onChange={(e) => updateReference(ref.id, "phone", e.target.value)} />
                                                    </div>
                                                </div>
                                                <button onClick={() => removeReference(ref.id)} className="text-[#D44C47] text-xs flex items-center gap-1"><Trash2 size={14} /> Remove</button>
                                            </div>
                                        ))}
                                        <button onClick={addReference} className="flex items-center gap-2 text-[var(--accent-orange)] text-sm font-medium"><Plus size={14} /> Add Reference</button>
                                    </div>
                                );
                            }
                            if (sectionKey === "additionalInfo") {
                                return (
                                    <div key="additionalInfo" className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#37352F] border-b pb-1">Additional Info</h3>
                                        <TextArea
                                            label="Details"
                                            value={resumeData.additionalInfo}
                                            onChange={(e) => updateAdditionalInfo(e.target.value)}
                                            rows={6}
                                            enableAI={true}
                                            aiContext="Additional Skills, Awards, Languages"
                                        />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeForm;
