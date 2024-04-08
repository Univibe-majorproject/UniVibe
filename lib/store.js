import { configureStore } from '@reduxjs/toolkit'
import postReducer from "@/lib/features/posts/postSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      post:postReducer,
    },
  })
}