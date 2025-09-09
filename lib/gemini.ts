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

// Helper function to check if API key is valid and quota is available
export async function checkGeminiAPIStatus(): Promise<{ valid: boolean; error?: string }> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return { valid: false, error: "API key not configured" }
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 10,
      },
    })

    // Make a minimal test request
    const result = await model.generateContent("test")
    await result.response.text()
    return { valid: true }
  } catch (error) {
    console.error("API status check failed:", error)
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        return { valid: false, error: "API quota exceeded" }
      }
      if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
        return { valid: false, error: "Invalid API key" }
      }
    }
    return { valid: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
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
    
    // Check for specific error types
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      
      // Handle rate limit/quota errors
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('limit exceeded')) {
        throw new Error('API quota exceeded. Please try again later or upgrade your Google AI plan.')
      }
      
      // Handle authentication errors
      if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
        throw new Error('Invalid or missing Google AI API key. Please check your configuration.')
      }
      
      // Handle other specific errors
      if (errorMessage.includes('safety')) {
        throw new Error('Content was blocked by safety filters. Please try rephrasing your request.')
      }
    }
    
    throw new Error(`Gemini AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
