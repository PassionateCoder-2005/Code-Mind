import React, { useState } from "react";
import { Code2, Mail, Lock, Eye, ArrowRight,EyeOff } from "lucide-react";
import { Link } from "react-router";
import { continueWithGoogle } from "../service/authService";
const Login = () => {
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
   const [eye,setEye]=useState(false)
   const handleFromSubmit=(e)=>{
    e.preventDefault();
    console.log(email,password)

   }
  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-[#020618] text-slate-100 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12 relative overflow-x-hidden font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Background Decorative Grid and Glow (clamped to prevent horizontal overflow on mobile) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 18%, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 35%, transparent 65%),
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 36px 36px, 36px 36px",
          }}
        />
        {/* Ambient Radial Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] bg-gradient-to-tr from-blue-600/10 via-violet-600/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Centered Authentication Card Container with my-auto for vertical centering and safe scrolling */}
      <div className="w-full max-w-[460px] my-auto relative z-10">
        <div className="w-full bg-[#070D1F]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-2xl shadow-blue-950/40 p-5 sm:p-8">
          
          {/* 1. Brand Header */}
          <div className="flex flex-col items-center text-center mb-6 sm:mb-7">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md shadow-blue-500/10 mb-3">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
              Code Mind<span className="text-blue-400 font-bold">AI</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Welcome back to your coding workspace
            </p>
          </div>

          {/* 2. Login Heading */}
          <div className="mb-5 sm:mb-6 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in to continue building with AI.
            </p>
          </div>

          {/* 3. Login Form (UI Only) */}
          <form className="space-y-4" onSubmit={handleFromSubmit}>
            
            {/* Field 1: Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300"
              >
                Email Address
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-800 bg-[#040816] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all duration-150">
                <span className="absolute left-3.5 text-slate-500 pointer-events-none flex items-center">
                  <Mail className="w-4 h-4 shrink-0" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={(e)=>setEmail(e.target.value)}
                  value={email}
                  className="w-full h-11 bg-transparent pl-10 pr-3.5 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-800 bg-[#040816] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40 transition-all duration-150">
                <span className="absolute left-3.5 text-slate-500 pointer-events-none flex items-center">
                  <Lock className="w-4 h-4 shrink-0" />
                </span>
                <input
                  id="password"
                  type={eye?"password":"text"}
                  onChange={(e)=>setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  className="w-full h-11 bg-transparent pl-10 pr-10 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                {/* Decorative Show/Hide Password Icon (Visual only) */}
                <span
                  className="absolute right-3.5 text-slate-500 hover:text-slate-400 transition-colors cursor-default flex items-center"
                  aria-hidden="true"
                  onClick={()=>{setEye(!eye)}}
                >
                  {eye?<EyeOff className="w-4 h-4 shrink-0" />:<Eye className="w-4 h-4 shrink-0" />}
                </span>
              </div>
            </div>

            {/* 4. Remember Me and Forgot Password (Optional row with responsive wrap) */}
            {/* <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-300 transition-colors">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-[#040816] border-slate-700 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer hover:underline font-medium">
                Forgot password?
              </span>
            </div> */}

            {/* 5. Primary Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-[#070D1F] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 transition-all duration-150 cursor-pointer active:scale-[0.99]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </form>

          {/* 6. Divider */}
          <div className="relative my-5 sm:my-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-[#070D1F] px-3 text-[11px] font-medium tracking-wider text-slate-500 uppercase font-mono">
              OR CONTINUE WITH
            </span>
          </div>

          {/* 7. Google Login Button */}
          <button
           onClick={()=>continueWithGoogle()}
            type="button"
            className="w-full h-11 rounded-lg border border-slate-800 hover:border-slate-700 bg-[#040816]/60 hover:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 focus:ring-offset-[#070D1F] text-slate-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer active:scale-[0.99]"
          >
            {/* Google Logo SVG */}
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* 8. Sign-Up Footer */}
          <Link
            to="/signup"
            className="block mt-6 pt-5 border-t border-slate-800/70 text-center text-xs text-slate-400 hover:text-slate-300 transition-colors"
          >
            Don't have an account?{" "}
            <span className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline">
              Create account
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;