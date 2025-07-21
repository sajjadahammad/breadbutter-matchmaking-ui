import { GoogleGenAI } from '@google/genai';
import { sampleTalents, type MatchResult, type Talent } from "@/lib/data"
import { NextResponse } from "next/server"


// Helper to check if a brief is meaningful (not just empty, whitespace, or too short)
function isMeaningfulBrief(brief: string): boolean {
  if (!brief) return false;
  // Remove whitespace and check length
  const trimmed = brief.trim();
  // Consider a brief not meaningful if less than 10 non-whitespace chars
  return trimmed.length >= 10;
}

export async function POST(req: Request) {
  try {
    const { brief } = await req.json()

    if (!brief) {
      return NextResponse.json({ error: "Creative brief is required" }, { status: 400 })
    }

    if (!isMeaningfulBrief(brief)) {
      return NextResponse.json({ error: "Creative brief is not meaningful. Please provide more details." }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google API Key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenAI({ apiKey })
    const model = 'gemini-2.0-flash-001'

    const talentsForAI = sampleTalents.map((talent) => ({
      id: talent.id,
      name: talent.name,
      city: talent.city,
      categories: talent.categories.join(", "),
      skills: talent.skills.join(", "),
      experience: talent.experience,
      budgetRange: talent.budgetRange,
      bio: talent.bio,
    }))

    const prompt = `
      You are a talent matchmaking engine. Your task is to match a creative brief with a list of available talents.
      For each talent, provide a score (an integer from 0 to 100) and a concise rationale (string explanation) based on how well they match the brief.
      Consider factors like location, categories, skills, experience, budget, and overall fit.
      Only include talents that have a score greater than 0.
      Rank the matched talents by score in descending order.

      Creative Brief:
      "${brief}"

      Available Talents (JSON array):
      ${JSON.stringify(talentsForAI, null, 2)}

      Output a JSON array of objects, where each object has the following structure:
      {
        "id": "talent_id_from_input",
        "score": "integer_score",
        "rationale": "string_explanation_of_match"
      }
      Ensure the output is a valid JSON array and nothing else.
    `

    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
    })
    const text = result.text
    if (!text) {
      return NextResponse.json({ error: "No response from AI model" }, { status: 500 })
    }

    let aiMatches: { id: string; score: number; rationale: string }[] = []
    try {
      const jsonString = text.replace(/```json\n|```/g, "").trim()
      aiMatches = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("Failed to parse AI response JSON:", parseError)
      console.error("AI Raw Text:", text)
      return NextResponse.json({ error: "Failed to parse AI response", details: text }, { status: 500 })
    }

    const finalMatches: MatchResult[] = []
    const talentMap = new Map<string, Talent>(sampleTalents.map((t) => [t.id, t]))

    for (const aiMatch of aiMatches) {
      if (aiMatch.score > 0) {
        const fullTalent = talentMap.get(aiMatch.id)
        if (fullTalent) {
          finalMatches.push({
            ...fullTalent,
            score: aiMatch.score,
            rank: 0,
            rationale: aiMatch.rationale,
          })
        }
      }
    }

    finalMatches.sort((a, b) => b.score - a.score)
    finalMatches.forEach((result, index) => {
      result.rank = index + 1
    })

    return NextResponse.json(finalMatches)
  } catch (error) {
    console.error("Error in matchmaking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
