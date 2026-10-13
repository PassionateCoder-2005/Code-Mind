import { getCurrentUser, loginUser, logOutUser, signUpUser } from "../../../store/authThunk"

export const useAuth=async () => {
    const loginTheUser=async (data)=>{
        return await loginUser(data)
    }

    const signUpTheUser=async (data)=>{
        return await signUpUser(data)
    }

    const logOutTheUser=async ()=>{
        return await logOutUser()
    }

    const getCurrentUserTheUser=async ()=>{
        return await getCurrentUser()
    }
 
    return {loginTheUser,signUpTheUser,logOutTheUser,getCurrentUserTheUser}
}