"use client" // Ensure this is a client component if it uses hooks

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

export function TalentResults() {
  const matches = useSelector((state: RootState) => state.matchmaking.matchedTalents)

  if (matches.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>No Matches Found</CardTitle>
          <CardDescription>Try a different brief or broaden your criteria.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const top3Matches = matches.slice(0, 3)
  const allOtherMatches = matches.slice(3)

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 3 Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3Matches.map((talent) => (
            <Card key={talent.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {talent.name}
                  <div className="flex gap-2">
                    <Badge variant="secondary">Rank {talent.rank}</Badge>
                    <Badge>Score: {talent.score}</Badge>
                  </div>
                </CardTitle>
                <CardDescription>{talent.categories.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>City:</strong> {talent.city}
                </p>
                <p>
                  <strong>Skills:</strong> {talent.skills.join(", ")}
                </p>
                <p>
                  <strong>Experience:</strong> {talent.experience}
                </p>
                <p>
                  <strong>Budget:</strong> {talent.budgetRange}
                </p>
                <p>
                  <strong>Rationale:</strong> {talent.rationale}
                </p>
                <p className="text-muted-foreground line-clamp-2">{talent.bio}</p>
                <a
                  href={talent.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Portfolio
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {allOtherMatches.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">All Matching Profiles</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOtherMatches.map((talent) => (
                  <TableRow key={talent.id}>
                    <TableCell>{talent.rank}</TableCell>
                    <TableCell className="font-medium">{talent.name}</TableCell>
                    <TableCell>{talent.city}</TableCell>
                    <TableCell>{talent.categories.join(", ")}</TableCell>
                    <TableCell>{talent.skills.join(", ")}</TableCell>
                    <TableCell>{talent.budgetRange}</TableCell>
                    <TableCell className="text-right">{talent.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  )
}
