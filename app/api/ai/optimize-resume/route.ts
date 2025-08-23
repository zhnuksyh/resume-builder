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

    const { resumeContent, targetJob } = await request.json()

    const prompt = `As an ATS and resume optimization expert, analyze this resume and provide specific improvement recommendations:

    Target Job: ${targetJob || "General position"}
    
    Resume Content:
    ${JSON.stringify(resumeContent, null, 2)}
    
    Provide actionable feedback in these areas:
    1. ATS Optimization - keyword gaps and formatting issues
    2. Content Strength - weak bullet points that need improvement
    3. Skills Alignment - missing skills for the target role
    4. Overall Impact - suggestions to increase interview chances
    
    Format your response as a JSON object with these keys:
    - atsOptimization: array of specific ATS improvements
    - contentStrength: array of content improvement suggestions
    - skillsAlignment: array of recommended skills to add
    - overallImpact: array of high-impact changes
    
    Keep suggestions specific and actionable.`

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
      maxTokens: 1000,
      temperature: 0.3,
    })

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({ analysis })
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      return NextResponse.json({
        analysis: {
          overallImpact: [text],
        },
      })
    }
  } catch (error) {
    console.error("Resume optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}
