import { GoogleGenAI } from '@google/genai';
import { sampleTalents, type MatchResult, type Talent } from "@/lib/data"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { brief } = await req.json()

    if (!brief) {
      return NextResponse.json({ error: "Creative brief is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google API Key not configured" }, { status: 500 })
    }

    // Updated initialization as per latest SDK
    const genAI = new GoogleGenAI({ apiKey })
    // Use the latest model name as per docs (e.g., gemini-2.0-flash-001)
    const model = 'gemini-2.0-flash-001'

    // Prepare talent data for the AI prompt
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

    // Updated model call as per latest SDK
    const result = await genAI.models.generateContent({
      model,
      contents: prompt,
    })
    const text = result.text
    if (!text) {
      return NextResponse.json({ error: "No response from AI model" }, { status: 500 })
    }

    // Attempt to parse the JSON from the AI's response
    let aiMatches: { id: string; score: number; rationale: string }[] = []
    try {
      // Gemini might wrap JSON in markdown code block, try to extract it
      const jsonString = text.replace(/```json\n|```/g, "").trim()
      aiMatches = JSON.parse(jsonString)
    } catch (parseError) {
      console.error("Failed to parse AI response JSON:", parseError)
      console.error("AI Raw Text:", text)
      return NextResponse.json({ error: "Failed to parse AI response", details: text }, { status: 500 })
    }

    // Filter out talents with score 0 and merge with full talent data
    const finalMatches: MatchResult[] = []
    const talentMap = new Map<string, Talent>(sampleTalents.map((t) => [t.id, t]))

    for (const aiMatch of aiMatches) {
      if (aiMatch.score > 0) {
        const fullTalent = talentMap.get(aiMatch.id)
        if (fullTalent) {
          finalMatches.push({
            ...fullTalent,
            score: aiMatch.score,
            rank: 0, // Will be set after sorting
            rationale: aiMatch.rationale,
          })
        }
      }
    }

    // Sort by score and assign ranks
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
