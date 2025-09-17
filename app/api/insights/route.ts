import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { summary } = body;

    const prompt = `
You are a financial assistant. Here is the user's monthly transaction summary:

${JSON.stringify(summary)}

Generate 3-5 actionable insights in plain, friendly language:
- Insights about spending habits
- Tips for saving more
- Tips for investing smarter
- Predict next month’s balance

⚠ Important: Output ONLY a valid JSON array of strings. Do NOT include markdown, code blocks, or any extra text. Example:

["Insight 1", "Insight 2", "Insight 3"]

Output strictly in this JSON format.
`;

    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // Gemini returns text in result.response.text()
    const text = result.response.text();

    // Parse JSON array
    let insights: string[] = [];
    try {
      insights = JSON.parse(text);
    } catch {
      insights = [text]; // fallback if not JSON
    }

    return NextResponse.json({ insights });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
