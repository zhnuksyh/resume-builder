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

    const { sectionType, currentContent, jobTitle, industry, customSectionTitle } = await request.json()

    // Validate required fields
    if (!sectionType || !currentContent) {
      return NextResponse.json({ 
        error: "Missing required fields: sectionType and currentContent are required" 
      }, { status: 400 })
    }

    let prompt = ""

    switch (sectionType) {
      case "experience":
        prompt = `As a professional resume writer, ${currentContent.trim() ? 'improve this work experience description' : 'create a work experience description'} for a resume.
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        ${currentContent.trim() ? `Current content: ${currentContent}` : 'No existing content provided'}
        
        Provide exactly 3-4 concise bullet points that are:
        - Action-oriented with strong verbs
        - Quantified with metrics when possible
        - Tailored to the job title and industry
        - ATS-friendly with relevant keywords
        - Each bullet point should be 1-2 lines maximum
        
        Return only the bullet points, one per line, starting with "•". Do not provide multiple options or explanations.`
        break

      case "skills":
        prompt = `As a career expert, suggest relevant skills for this professional profile:
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        ${currentContent.trim() ? `Current skills: ${currentContent}` : 'No existing skills provided'}
        
        Suggest 6-8 relevant skills that are:
        - Industry-specific and in-demand
        - Mix of technical and soft skills
        - ATS-optimized keywords
        - Tailored to the job title and industry
        
        Return only the skill names, separated by commas. Do not provide multiple options or explanations.`
        break

      case "summary":
        prompt = `Write a compelling professional summary for this resume:
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        ${currentContent.trim() ? `Current summary: ${currentContent}` : 'No existing summary provided'}
        
        Create a concise 2-3 sentence professional summary that:
        - Highlights key strengths and experience
        - Includes relevant industry keywords
        - Shows value proposition to employers
        - Is engaging and professional
        
        Return only the summary text. Do not provide multiple options or explanations.`
        break

      case "education":
        prompt = `As a professional resume writer, ${currentContent.trim() ? 'improve this education description' : 'create an education description'} for a resume.
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        ${currentContent.trim() ? `Current content: ${currentContent}` : 'No existing content provided'}
        
        Provide exactly 2-3 concise bullet points for education details that are:
        - Relevant to the job title and industry
        - Highlight academic achievements, relevant coursework, or projects
        - Include honors, awards, or extracurricular activities
        - Show leadership or technical skills gained
        - ATS-friendly with relevant keywords
        - Each bullet point should be 1-2 lines maximum
        
        Return only the bullet points, one per line, starting with "•". Do not provide multiple options or explanations.`
        break

      case "personal_info":
        prompt = `As a professional resume writer, improve this personal information section for a resume:
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        Current content: ${currentContent}
        
        Provide concise suggestions to improve the personal information that:
        - Makes it more professional and polished
        - Includes relevant contact information formatting
        - Adds professional social media links if appropriate
        - Ensures ATS-friendly formatting
        
        Return only the improved content. Do not provide multiple options or explanations.`
        break

      case "custom":
        prompt = `As a professional resume writer, ${currentContent.trim() ? 'improve this custom section' : 'create content for this custom section'} for a resume:
        Section Title: ${customSectionTitle || "Custom Section"}
        Job Title: ${jobTitle || "Not specified"}
        Industry: ${industry || "Not specified"}
        ${currentContent.trim() ? `Current content: ${currentContent}` : 'No existing content provided'}
        
        Provide concise content for this custom section that:
        - Is relevant to the job title and industry
        - Uses professional language and formatting
        - Highlights achievements and skills
        - Is ATS-friendly with relevant keywords
        - Keep content brief and impactful
        
        Return only the content. Do not provide multiple options or explanations.`
        break

      default:
        return NextResponse.json({ 
          error: `Invalid section type: ${sectionType}. Supported types: experience, skills, summary, education, personal_info, custom` 
        }, { status: 400 })
    }

    const text = await generateWithGemini(prompt, {
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    // Clean up the response by removing markdown formatting
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold formatting **
      .replace(/\*/g, '') // Remove italic formatting *
      .replace(/`/g, '') // Remove code formatting `
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim()

    return NextResponse.json({ suggestion: cleanText })
  } catch (error) {
    console.error("AI suggestion error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
      hasApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    })

    // Provide more specific error messages based on the error type
    let errorMessage = "Failed to generate suggestion"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
        errorMessage = "AI service configuration error. Please contact support."
        statusCode = 503
      } else if (error.message.includes("Unauthorized")) {
        errorMessage = "Authentication failed. Please log in again."
        statusCode = 401
      } else if (error.message.includes("Invalid section type")) {
        errorMessage = error.message
        statusCode = 400
      } else if (error.message.includes("Missing required fields")) {
        errorMessage = error.message
        statusCode = 400
      }
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: statusCode })
  }
}
