"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface MatchmakingFormProps {
  onSubmit: (brief: string) => void
  isLoading: boolean
  initialBrief?: string // Added to pre-fill from Redux state if needed
}

export function MatchmakingForm({ onSubmit, isLoading, initialBrief = "" }: MatchmakingFormProps) {
  const [brief, setBrief] = useState(initialBrief)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(brief)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Talent Matchmaking Engine</CardTitle>
        <CardDescription>Enter your creative brief to find the best-matched talents.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="brief">Creative Brief</Label>
              <Textarea
                id="brief"
                placeholder="E.g., I need a travel photographer in Goa for 3 days in November for a sustainable fashion brand. I want pastel tones and candid portraits. ₹75k max."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault() // Prevent default new line
                    if (brief.trim() !== "" && !isLoading) {
                      onSubmit(brief)
                    }
                  }
                }}
                rows={6}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Matching..." : "Find Matches"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
