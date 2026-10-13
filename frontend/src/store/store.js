import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "../store/slices/editorSlice";
import authReducer, {
    setAccessToken,
} from "../store/slices/authSlice";

import {
    injectAuthDependencies,
} from "../services/axiosInstance";

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        auth: authReducer,
    },
});

injectAuthDependencies({
    getToken: () => store.getState().auth.accessToken,
    setToken: (token) => store.dispatch(setAccessToken(token)),
});