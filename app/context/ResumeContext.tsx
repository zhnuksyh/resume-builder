"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ResumeData, Experience, Education, Volunteering, Project, Organization, Reference } from "../types";

const initialResumeData: ResumeData = {
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        photoUrl: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    volunteering: [],
    projects: [],
    organizations: [],
    additionalInfo: "",
    references: [],
    sectionOrder: ["volunteering", "projects", "organizations", "references", "additionalInfo"],
};

interface ResumeContextType {
    resumeData: ResumeData;
    updatePersonalInfo: (field: keyof ResumeData["personalInfo"], value: string) => void;
    updateSummary: (value: string) => void;
    addExperience: () => void;
    updateExperience: (id: string, field: keyof Experience, value: string) => void;
    removeExperience: (id: string) => void;
    addEducation: () => void;
    updateEducation: (id: string, field: keyof Education, value: string) => void;
    removeEducation: (id: string) => void;
    updateSkills: (skills: string[]) => void;
    addVolunteering: () => void;
    updateVolunteering: (id: string, field: keyof Volunteering, value: string) => void;
    removeVolunteering: (id: string) => void;
    addProject: () => void;
    updateProject: (id: string, field: keyof Project, value: string) => void;
    removeProject: (id: string) => void;
    addOrganization: () => void;
    updateOrganization: (id: string, field: keyof Organization, value: string) => void;
    removeOrganization: (id: string) => void;
    updateAdditionalInfo: (value: string) => void;
    addReference: () => void;
    updateReference: (id: string, field: keyof Reference, value: string) => void;
    removeReference: (id: string) => void;
    reorderSection: (fromIndex: number, toIndex: number) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
    const [resumeData, setResumeData] = useState<ResumeData>({
        ...initialResumeData,
        sectionOrder: ["volunteering", "projects", "organizations", "references", "additionalInfo"],
    });

    const updatePersonalInfo = (field: keyof ResumeData["personalInfo"], value: string) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }));
    };

    const updateSummary = (value: string) => {
        setResumeData((prev) => ({ ...prev, summary: value }));
    };

    const addExperience = () => {
        const newExperience: Experience = {
            id: crypto.randomUUID(),
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            description: "",
        };
        setResumeData((prev) => ({
            ...prev,
            experience: [...prev.experience, newExperience],
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const removeExperience = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));
    };

    const addEducation = () => {
        const newEducation: Education = {
            id: crypto.randomUUID(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
        };
        setResumeData((prev) => ({
            ...prev,
            education: [...prev.education, newEducation],
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            education: prev.education.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));
    };

    const updateSkills = (skills: string[]) => {
        setResumeData((prev) => ({ ...prev, skills }));
    };

    const addVolunteering = () => {
        setResumeData((prev) => ({
            ...prev,
            volunteering: [
                ...prev.volunteering,
                {
                    id: crypto.randomUUID(),
                    organization: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
        }));
    };

    const updateVolunteering = (id: string, field: keyof Volunteering, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            volunteering: prev.volunteering.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const removeVolunteering = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            volunteering: prev.volunteering.filter((item) => item.id !== id),
        }));
    };

    const addProject = () => {
        setResumeData((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                {
                    id: crypto.randomUUID(),
                    name: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                },
            ],
        }));
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            projects: prev.projects.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const removeProject = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            projects: prev.projects.filter((item) => item.id !== id),
        }));
    };

    const addOrganization = () => {
        setResumeData((prev) => ({
            ...prev,
            organizations: [
                ...prev.organizations,
                {
                    id: crypto.randomUUID(),
                    name: "",
                    role: "",
                    startDate: "",
                    endDate: "",
                },
            ],
        }));
    };

    const updateOrganization = (id: string, field: keyof Organization, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            organizations: prev.organizations.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const removeOrganization = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            organizations: prev.organizations.filter((item) => item.id !== id),
        }));
    };

    const updateAdditionalInfo = (value: string) => {
        setResumeData((prev) => ({ ...prev, additionalInfo: value }));
    };

    const addReference = () => {
        setResumeData((prev) => ({
            ...prev,
            references: [
                ...prev.references,
                {
                    id: crypto.randomUUID(),
                    name: "",
                    title: "",
                    company: "",
                    email: "",
                    phone: "",
                },
            ],
        }));
    };

    const updateReference = (id: string, field: keyof Reference, value: string) => {
        setResumeData((prev) => ({
            ...prev,
            references: prev.references.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
    };

    const removeReference = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            references: prev.references.filter((item) => item.id !== id),
        }));
    };

    const reorderSection = (fromIndex: number, toIndex: number) => {
        setResumeData((prev) => {
            const newOrder = [...prev.sectionOrder];
            const [movedItem] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, movedItem);
            return { ...prev, sectionOrder: newOrder };
        });
    };

    return (
        <ResumeContext.Provider
            value={{
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
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
};
