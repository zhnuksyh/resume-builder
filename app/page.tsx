import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Download, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Image
              src="/rougeresume-logo.png"
              alt="RougeResume Logo"
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <span className="text-2xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
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
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Your Perfect Resume with{" "}
            <span className="text-blue-600">AI Assistance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create professional, ATS-friendly resumes in minutes. Get AI-powered
            suggestions, real-time feedback, and beautiful templates that land
            you interviews.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8 py-3">
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI-Powered Suggestions</CardTitle>
              <CardDescription>
                Get intelligent recommendations for content, formatting, and
                keywords tailored to your industry.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See your resume come to life in real-time as you make changes.
                What you see is what you get.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Professional Export</CardTitle>
              <CardDescription>
                Download your resume as a high-quality PDF ready for job
                applications and ATS systems.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 ResumeAI. Built with AI to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
}
