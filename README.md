# BreadButter Talent Matchmaking Engine

## Overview
BreadButter is a creative matchmaking platform connecting clients with top creative talent. This project implements a Talent Matchmaking Engine that takes a creative brief and returns a ranked list of recommended talents, using both rule-based and AI-enhanced logic.

## Features
- Submit a creative brief and get ranked talent recommendations
- AI-powered scoring and rationale (Google Gemini API)
- Modern Next.js frontend and backend
- Extensible for future scale and production use

## Tech Stack
- **Frontend/Backend:** Next.js (App Router, API routes)
- **Language:** TypeScript
- **State Management:** Zustand
- **AI/LLM:** Google Gemini API (via @google/genai)
- **Styling:** CSS Modules

## Setup
1. **Clone the repo**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file with:
     ```
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
4. **Run the app:**
   ```bash
   npm run dev
   ```

## API Usage
### POST `/api/match`
- **Request Body:**
  ```json
  { "brief": "I need a travel photographer in Goa for 3 days in November for a sustainable fashion brand. I want pastel tones and candid portraits. ₹75k max." }
  ```
- **Response:**
  ```json
  [
    {
      "id": "talent_id",
      "name": "...",
      "score": 87,
      "rank": 1,
      "rationale": "Strong match on location, skills, and budget."
    },
    ...
  ]
  ```

## Folder Structure
- `src/app/api/match/route.ts` — Matchmaking API logic
- `src/components/` — UI components
- `src/lib/data.ts` — Sample talent data
- `store/` — State management

## Documentation & Diagrams
All product and technical documentation, as well as system diagrams and future ideas, are available in the `/docs` folder:

- `PROPOSAL.md`: Project proposal and approach
- `PRD.md`: Product Requirements Document
- `TECHNICAL_SPEC.md`: Technical specification
- `IDEAS.md`: Thoughts and future directions
- Diagrams: System flow and architecture (see below)

## Diagrams
- System flow and architecture diagrams are provided in Mermaid format in this repo and can be viewed with any Mermaid-compatible viewer.

## License
MIT
