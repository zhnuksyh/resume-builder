import { NextResponse } from "next/server"
import { checkGeminiAPIStatus } from "@/lib/gemini"

export async function GET() {
  try {
    const status = await checkGeminiAPIStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("API status check error:", error)
    return NextResponse.json({ 
      valid: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
