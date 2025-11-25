"use client";

import React, { useState, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface FormSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    accentColor?: "blue" | "green" | "orange" | "red" | "purple";
}

const colorMap = {
    blue: "bg-[#EBF5FA] text-[#0B6E99]",
    green: "bg-[#EDF3EC] text-[#0F7B6C]",
    orange: "bg-[#FAEBDD] text-[#D9730D]",
    red: "bg-[#FBE4E4] text-[#D44C47]",
    purple: "bg-[#F6F3F9] text-[#6940A5]",
};

const FormSection: React.FC<FormSectionProps> = ({
    title,
    children,
    defaultOpen = false,
    accentColor = "blue",
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-2 group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-[#F1F1EF] transition-colors text-left"
            >
                <div
                    className={clsx(
                        "transition-transform duration-200 text-[#9B9A97]",
                        isOpen ? "rotate-90" : "rotate-0"
                    )}
                >
                    <ChevronRight size={18} />
                </div>
                <div className="flex items-center gap-2">
                    <span className={clsx("w-2 h-2 rounded-full", colorMap[accentColor].split(" ")[1].replace("text-", "bg-"))}></span>
                    <h3 className="font-medium text-[#37352F]">{title}</h3>
                </div>
            </button>

            <div
                className={clsx(
                    "overflow-hidden transition-all duration-300 ease-in-out pl-8",
                    isOpen ? "max-h-[2000px] opacity-100 mb-4" : "max-h-0 opacity-0"
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default FormSection;
