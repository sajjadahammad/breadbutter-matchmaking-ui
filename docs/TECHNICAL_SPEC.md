# Technical Specification

## Overview
The system matches creative briefs to talent using a combination of rule-based filtering and AI-powered scoring (Google Gemini API).

## Architecture
- **Frontend:** Next.js app with form for brief submission and results display
- **Backend:** Next.js API route (`/api/match`) processes requests
- **State Management:** Zustand
- **AI Integration:** Google Gemini API for scoring and rationale

## Data Flow
1. User submits a creative brief via frontend
2. Frontend sends POST request to `/api/match`
3. Backend validates input, prepares talent data, and constructs AI prompt
4. Gemini API returns scored/ranked matches
5. Backend parses and returns results to frontend
6. Frontend displays ranked talents with rationale

## API Contract
### POST `/api/match`
- **Request:** `{ "brief": "string" }`
- **Response:** `[{ id, name, score, rank, rationale, ...talentFields }]`

## AI Integration
- Uses Google Gemini API (`@google/genai`)
- Prompt includes brief and all talent data
- Expects valid JSON array of matches with score and rationale
- Handles errors and malformed responses gracefully 