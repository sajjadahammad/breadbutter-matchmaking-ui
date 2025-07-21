import { configureStore } from "@reduxjs/toolkit";
import matchmakingReducer from "./matchmaking-slice";

export const store = configureStore({
  reducer: {
    matchmaking: matchmakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
