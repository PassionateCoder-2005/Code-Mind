
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMe, login, logout, signUp } from "../features/auth/service/authService";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await login({
                email: data.email,
                password: data.password,
            });

            return {
                user: response.user,
                accessToken: response.accessToken,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Login failed. Please try again."
            );
        }
    }
);
export const signUpUser=createAsyncThunk(
    "auth/signUp",
    async(data,{rejectWithValue})=>{
        try {
            const response=await signUp({
                name:data.name,
                email:data.email,
                password:data.password,
            });
            return {
                user:response.user,
                accessToken:response.accessToken,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Signup failed. Please try again."
            );
        }
    }
);
export const logOutUser=createAsyncThunk(
    "auth/logout",
    async(_, {rejectWithValue})=>{
        try {
            const response=await logout();
            return {
                user:null,
                accessToken:null,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Logout failed. Please try again."
            );
        }
    }
);
export const getCurrentUser=createAsyncThunk(
    "auth/get-me",
    async(_, {rejectWithValue})=>{
        try {
            const response=await getMe();
            return {
                user:response.user,
                accessToken:response.accessToken,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch user. Please try again."
            );
        }
    }
)