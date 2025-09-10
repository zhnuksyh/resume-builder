"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function CreateResumeCard() {
  const router = useRouter();
  const supabase = createClient();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateResume = async () => {
    setIsCreating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Create a new resume
      const { data: resume, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: "Untitled Resume",
          template_id: "modern",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating resume:", error);
        return;
      }

      // Redirect to the resume builder
      router.push(`/resume/${resume.id}/edit`);
    } catch (error) {
      console.error("Error creating resume:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary transition-colors cursor-pointer group h-[320px] flex flex-col py-0 gap-0">
      <CardContent className="flex flex-col items-center justify-center p-6 flex-1">
        <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary/20 transition-colors">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Create New Resume
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Start building your professional resume with AI assistance
        </p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          onClick={handleCreateResume}
          disabled={isCreating}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isCreating ? "Creating..." : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}
