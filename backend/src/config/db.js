import mongoose from "mongoose";
import CONFIG from "./config.js";
const db=async()=>{
    try{
        await mongoose.connect(CONFIG.MONGODB_URI);
        console.log("Database connected successfully");
    }
    catch(err){
        console.log("Database connection failed",err);
    }
}
export default db;