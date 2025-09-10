import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

// Get the Gemini Pro model
export const getGeminiModel = () => {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set")
  }
  
  return genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  })
}

// Helper function to generate text using Gemini
export async function generateWithGemini(
  prompt: string,
  options?: {
    temperature?: number
    maxOutputTokens?: number
  }
): Promise<string> {
  // Check if API key is available
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set")
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: options?.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: options?.maxOutputTokens || 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    console.log("Generating content with Gemini...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log("Gemini response received successfully")
    return text
  } catch (error) {
    console.error("Gemini generation error:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API_KEY")) {
        throw new Error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set or invalid")
      } else if (error.message.includes("quota")) {
        throw new Error("AI service quota exceeded. Please try again later.")
      } else if (error.message.includes("safety")) {
        throw new Error("Content was blocked by safety filters. Please try with different content.")
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        throw new Error("Network error. Please check your internet connection and try again.")
      }
    }
    
    throw new Error(`Gemini AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
