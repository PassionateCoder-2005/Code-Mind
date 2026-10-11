import dotenv from "dotenv"
dotenv.config();
const CONFIG={
    MONGODB_URI: process.env.MONGODB_URI,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
}
if(!CONFIG.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in the environment variables");   
}
if(!CONFIG.ACCESS_TOKEN_SECRET){
    throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");   
}
if(!CONFIG.REFRESH_TOKEN_SECRET){
    throw new Error("REFRESH_TOKEN_SECRET is not defined in the environment variables");   
}
if(!CONFIG.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined in the environment variables");   
}
if(!CONFIG.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined in the environment variables");   
}
if(!CONFIG.GOOGLE_CALLBACK_URL){
    throw new Error("GOOGLE_CALLBACK_URL is not defined in the environment variables");   
}
export default CONFIG;