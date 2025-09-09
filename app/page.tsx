import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/rougeresume-logo.png"
              alt="RougeResume Logo"
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <span className="text-2xl font-bold text-foreground">
              RougeResume
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 flex-1 flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="whitespace-nowrap">
              Build your perfect{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Resume</span>
                <svg
                  className="absolute bottom-0 left-0 w-full h-4 text-purple-600"
                  viewBox="0 0 100 16"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="underlineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgb(147 51 234)" />
                      <stop offset="50%" stopColor="rgb(168 85 247)" />
                      <stop offset="100%" stopColor="rgb(147 51 234)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2,10 Q20,4 40,10 T80,10 T98,10"
                    stroke="url(#underlineGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    filter="drop-shadow(0 2px 4px rgba(147, 51, 234, 0.3))"
                  />
                </svg>
              </span>
              ,
            </span>
            <br />
            <span className="text-purple-600">Land your dream job</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-4xl mx-auto">
            Transform your career with professional, ATS-friendly resumes.
            <br />
            <span className="whitespace-nowrap">
              Get AI-powered suggestions and create stunning resumes that get
              you hired.
            </span>
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="px-8 py-3 flex items-center justify-center"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Building Free
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 RougeResume. Forked from zhnuksyh repo.</p>
        </div>
      </footer>
    </div>
  );
}
