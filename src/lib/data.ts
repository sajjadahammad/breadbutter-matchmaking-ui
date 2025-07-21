export interface Talent {
  id: string
  name: string
  city: string
  categories: string[]
  skills: string[]
  experience: string
  budgetRange: string
  portfolioLink: string
  bio: string
}

export interface MatchResult extends Talent {
  score: number
  rank: number
  rationale: string
}

export const sampleTalents: Talent[] = [
  {
    id: "t1",
    name: "Alice Wonderland",
    city: "Goa",
    categories: ["Travel Photography", "Fashion Photography"],
    skills: ["Candid Portraits", "Pastel Tones", "Sustainable Fashion", "Landscape Photography"],
    experience: "5+ years",
    budgetRange: "₹60k-₹90k",
    portfolioLink: "https://alice.portfolio.com",
    bio: "Experienced travel and fashion photographer specializing in candid and natural light portraits. Passionate about sustainable brands.",
  },
  {
    id: "t2",
    name: "Bob The Builder",
    city: "Mumbai",
    categories: ["Product Photography", "Commercial Photography"],
    skills: ["Studio Lighting", "E-commerce", "High-Resolution Imaging"],
    experience: "8 years",
    budgetRange: "₹80k-₹120k",
    portfolioLink: "https://bob.portfolio.com",
    bio: "Commercial photographer with extensive experience in product and e-commerce shoots. Known for crisp, high-quality images.",
  },
  {
    id: "t3",
    name: "Charlie Chaplin",
    city: "Goa",
    categories: ["Wedding Photography", "Event Photography"],
    skills: ["Documentary Style", "Emotional Moments", "Outdoor Shoots"],
    experience: "10+ years",
    budgetRange: "₹50k-₹80k",
    portfolioLink: "https://charlie.portfolio.com",
    bio: "Award-winning wedding and event photographer capturing genuine emotions and unforgettable moments.",
  },
  {
    id: "t4",
    name: "Diana Prince",
    city: "Delhi",
    categories: ["Portrait Photography", "Fine Art Photography"],
    skills: ["Conceptual Portraits", "Dark Tones", "Studio Portraits"],
    experience: "7 years",
    budgetRange: "₹70k-₹110k",
    portfolioLink: "https://diana.portfolio.com",
    bio: "Fine art portrait photographer creating evocative and conceptual images with a unique artistic vision.",
  },
  {
    id: "t5",
    name: "Eve Harrington",
    city: "Goa",
    categories: ["Food Photography", "Lifestyle Photography"],
    skills: ["Styling", "Natural Light", "Recipe Photography"],
    experience: "4 years",
    budgetRange: "₹40k-₹70k",
    portfolioLink: "https://eve.portfolio.com",
    bio: "Passionate food and lifestyle photographer, bringing dishes to life with vibrant colors and natural light.",
  },
  {
    id: "t6",
    name: "Frank Sinatra",
    city: "Mumbai",
    categories: ["Videography", "Short Films"],
    skills: ["Cinematography", "Editing", "Storytelling"],
    experience: "6 years",
    budgetRange: "₹90k-₹150k",
    portfolioLink: "https://frank.portfolio.com",
    bio: "Videographer and filmmaker with a knack for compelling visual storytelling and high-quality production.",
  },
  {
    id: "t7",
    name: "Grace Kelly",
    city: "Bangalore",
    categories: ["Graphic Design", "Branding"],
    skills: ["Logo Design", "UI/UX", "Brand Strategy"],
    experience: "9 years",
    budgetRange: "₹70k-₹100k",
    portfolioLink: "https://grace.portfolio.com",
    bio: "Creative graphic designer and brand strategist, building strong visual identities for businesses.",
  },
  {
    id: "t8",
    name: "Harry Potter",
    city: "Goa",
    categories: ["Travel Photography", "Adventure Photography"],
    skills: ["Drone Photography", "Action Shots", "Nature Photography"],
    experience: "3 years",
    budgetRange: "₹30k-₹60k",
    portfolioLink: "https://harry.portfolio.com",
    bio: "Adventure and travel photographer capturing breathtaking landscapes and dynamic action shots, including drone work.",
  },
]

// The matchTalents function is no longer directly used by the frontend,
// but it's kept here for reference or if you decide to revert to a rule-based system.
export function matchTalents(brief: string): MatchResult[] {
  const lowerBrief = brief.toLowerCase()
  const matchedResults: MatchResult[] = []

  const extractBudget = (text: string): { min?: number; max?: number } => {
    const match = text.match(/₹(\d+k)(?:-₹(\d+k))?/)
    if (match) {
      const min = Number.parseInt(match[1].replace("k", "000"))
      const max = match[2] ? Number.parseInt(match[2].replace("k", "000")) : undefined
      return { min, max }
    }
    return {}
  }

  const briefBudget = extractBudget(lowerBrief)

  for (const talent of sampleTalents) {
    let score = 0
    const rationaleParts: string[] = []

    // Location match
    if (lowerBrief.includes(talent.city.toLowerCase())) {
      score += 2
      rationaleParts.push(`Location (${talent.city}) matches brief.`)
    }

    // Category match
    for (const category of talent.categories) {
      if (lowerBrief.includes(category.toLowerCase().replace(" photography", ""))) {
        score += 3
        rationaleParts.push(`Category (${category}) matches brief.`)
      }
    }

    // Skill match
    for (const skill of talent.skills) {
      if (lowerBrief.includes(skill.toLowerCase())) {
        score += 5
        rationaleParts.push(`Skill (${skill}) matches brief.`)
      }
    }

    // Budget match
    if (briefBudget.min || briefBudget.max) {
      const talentBudgetMatch = talent.budgetRange.match(/₹(\d+k)-₹(\d+k)/)
      if (talentBudgetMatch) {
        const talentMin = Number.parseInt(talentBudgetMatch[1].replace("k", "000"))
        const talentMax = Number.parseInt(talentBudgetMatch[2].replace("k", "000"))

        let budgetMatches = false
        if (briefBudget.min && briefBudget.max) {
          // Brief has a range, check if talent's range overlaps
          if (Math.max(briefBudget.min, talentMin) <= Math.min(briefBudget.max, talentMax)) {
            budgetMatches = true
          }
        } else if (briefBudget.min) {
          // Brief has a min, check if talent's max is above brief's min
          if (talentMax >= briefBudget.min) {
            budgetMatches = true
          }
        } else if (briefBudget.max) {
          // Brief has a max, check if talent's min is below brief's max
          if (talentMin <= briefBudget.max) {
            budgetMatches = true
          }
        }

        if (budgetMatches) {
          score += 3
          rationaleParts.push(`Budget (${talent.budgetRange}) is within brief's range.`)
        }
      }
    }

    if (score > 0) {
      matchedResults.push({
        ...talent,
        score,
        rank: 0, // Will be set after sorting
        rationale: rationaleParts.join(" ") || "General match based on brief keywords.",
      })
    }
  }

  // Sort by score and assign ranks
  matchedResults.sort((a, b) => b.score - a.score)
  matchedResults.forEach((result, index) => {
    result.rank = index + 1
  })

  return matchedResults
}
