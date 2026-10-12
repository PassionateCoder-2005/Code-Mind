
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signUpUser, logoutUser } from "./authThunks";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    accessToken: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        },

        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.isLoading = false;
            state.error = null;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // SIGNUP
            .addCase(signUpUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })

            // LOGOUT
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.accessToken = null;
                state.isLoading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const {
    setUser,
    setAccessToken,
    logout,
    setLoading,
    setError,
} = authSlice.actions;

export default authSlice.reducer;
