import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { MatchResult } from "@/lib/data"

interface MatchmakingState {
  brief: string
  matchedTalents: MatchResult[]
  isLoading: boolean
}

const initialState: MatchmakingState = {
  brief: "",
  matchedTalents: [],
  isLoading: false,
}

export const matchmakingSlice = createSlice({
  name: "matchmaking",
  initialState,
  reducers: {
    setBrief: (state, action: PayloadAction<string>) => {
      state.brief = action.payload
    },
    setMatchedTalents: (state, action: PayloadAction<MatchResult[]>) => {
      state.matchedTalents = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    resetMatchmakingState: (state) => {
      state.brief = ""
      state.matchedTalents = []
      state.isLoading = false
    },
  },
})

export const { setBrief, setMatchedTalents, setLoading, resetMatchmakingState } = matchmakingSlice.actions

export default matchmakingSlice.reducer
