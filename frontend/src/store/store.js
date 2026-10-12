import { configureStore } from '@reduxjs/toolkit'
import editorReducer from "../store/slices/editorSlice"
import authReducer from "../store/slices/authSlice"
export const store = configureStore({
  reducer: {
    editor:editorReducer,
    auth:authReducer
  }
})