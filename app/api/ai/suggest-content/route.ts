import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateWithGemini } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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

    const text = await generateWithGemini(prompt, {
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({ suggestion: text })
  } catch (error) {
    console.error("AI suggestion error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      hasApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    })
    return NextResponse.json({ 
      error: "Failed to generate suggestion",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
