import { configureStore } from '@reduxjs/toolkit'
import editorReducer from "../store/slices/editorSlice"
export const store = configureStore({
  reducer: {
    editor:editorReducer,
  }
})