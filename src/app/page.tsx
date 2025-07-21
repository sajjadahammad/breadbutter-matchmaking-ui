"use client"

import { MatchmakingForm } from "@/components/matchmaking-form"
import { TalentResults } from "@/components/talent-results"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../store"
import { setBrief, setMatchedTalents, setLoading } from "../../store/matchmaking-slice"
import type { MatchResult } from "@/lib/data" // Import MatchResult type

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { brief, matchedTalents, isLoading } = useSelector((state: RootState) => state.matchmaking)

  const handleMatchmaking = async (inputBrief: string) => {
    dispatch(setBrief(inputBrief))
    dispatch(setLoading(true))
    dispatch(setMatchedTalents([])) // Clear previous results

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brief: inputBrief }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch matches")
      }

      const results: MatchResult[] = await response.json()
      dispatch(setMatchedTalents(results))
    } catch (error) {
      console.error("Error during matchmaking:", error)
      // Optionally dispatch an error state to Redux
      alert(`Error: ${(error as Error).message}. Please check your API key and try again.`)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-12 bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">BreadButter Talent Matchmaker</h1>
      <MatchmakingForm onSubmit={handleMatchmaking} isLoading={isLoading} initialBrief={brief} />
      {isLoading && <div className="mt-8 text-lg text-gray-600">Searching for the perfect match using AI...</div>}
      {!isLoading && matchedTalents.length > 0 && <TalentResults />}
      {!isLoading && matchedTalents.length === 0 && (
        <div className="mt-8 text-lg text-gray-600">Enter a brief above to find matching talents.</div>
      )}
    </main>
  )
}
