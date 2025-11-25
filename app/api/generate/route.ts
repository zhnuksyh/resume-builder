import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Google API Key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const { prompt, context } = await req.json();

        const fullPrompt = `
      You are a professional resume writer.
      Context: ${context}
      Task: ${prompt}
      
      Output requirements:
      - Professional, action-oriented language.
      - Concise and impactful.
      - If asking for bullet points, provide them starting with "• ".
      - Do not include markdown formatting like **bold** or *italic* unless necessary for the resume structure.
      - Do not include conversational filler ("Here is the text..."). Just the content.
    `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
