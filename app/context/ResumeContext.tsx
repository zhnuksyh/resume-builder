"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ResumeData, Experience, Education } from "../types";

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
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

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
