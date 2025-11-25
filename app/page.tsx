"use client";

import { ResumeProvider } from "./context/ResumeContext";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import Image from "next/image";

export default function Home() {
  return (
    <ResumeProvider>
      <main className="flex h-screen w-full bg-[#F7F7F5] overflow-hidden">
        {/* Sidebar / Left Panel */}
        <div className="w-[40%] h-full flex flex-col border-r border-[#E0E0E0] bg-white z-10">
          {/* Header with Logo */}
          <div className="p-6 border-b border-[#F1F1EF] flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/logo.png"
                alt="Nano Banana Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="font-bold text-lg text-[#37352F] tracking-tight">
              Nano Resume
            </h1>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-hidden">
            <ResumeForm />
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="w-[60%] h-full">
          <ResumePreview />
        </div>
      </main>
    </ResumeProvider>
  );
}
