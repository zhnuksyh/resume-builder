import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sectionType, currentContent, jobTitle, industry } = await request.json()

    let prompt = ""

    switch (sectionType) {
      case "experience":
        prompt = `As a professional resume writer, help improve this work experience description. 
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        Current content: ${currentContent}
        
        Provide 3-5 improved bullet points that are:
        - Action-oriented with strong verbs
        - Quantified with metrics when possible
        - Tailored to the job title and industry
        - ATS-friendly with relevant keywords
        
        Return only the bullet points, one per line, starting with "•"`
        break

      case "skills":
        prompt = `As a career expert, suggest relevant skills for this professional profile:
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        Current skills: ${currentContent}
        
        Suggest 8-12 additional relevant skills that are:
        - Industry-specific and in-demand
        - Mix of technical and soft skills
        - ATS-optimized keywords
        
        Return only the skill names, separated by commas.`
        break

      case "summary":
        prompt = `Write a compelling professional summary for this resume:
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        Current summary: ${currentContent}
        
        Create a 3-4 sentence professional summary that:
        - Highlights key strengths and experience
        - Includes relevant industry keywords
        - Shows value proposition to employers
        - Is engaging and professional
        
        Return only the summary text.`
        break

      default:
        return NextResponse.json({ error: "Invalid section type" }, { status: 400 })
    }

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ suggestion: text })
  } catch (error) {
    console.error("AI suggestion error:", error)
    return NextResponse.json({ error: "Failed to generate suggestion" }, { status: 500 })
  }
}
