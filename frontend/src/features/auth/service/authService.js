import { axiosIntance } from "../../../services/axiosInstance";
import axios from "axios";

export const signUp=async (data) => {
    const res=await axiosIntance.post("auth/signup",{
        name:data.name,
        email:data.email,
        password:data.password,
        
    })
    return res.data;
}
export const login=async(data)=>{
    const res=await axiosIntance.post("auth/login",{
        email:data.email,
        password:data.password,
    })
    return res.data;
}
export const logout=async()=>{
    const res=await axiosIntance.post("auth/logout")
    return res.data;
}
export const getMe=async()=>{
    const res=await axiosIntance.get("auth/get-me")
    return res.data;
}
export const refreshAccessToken=async()=>{
    const res=await axiosIntance.post("auth/refresh")
    return res.data;
}
export const continueWithGoogle = () => {
    window.location.href = "http://localhost:3000/auth/google";
};