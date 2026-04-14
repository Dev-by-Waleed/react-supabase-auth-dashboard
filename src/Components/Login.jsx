import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { supabase } from './SupabaseClient'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/Dashboard')
      }
    }
    checkUser()
  }, [navigate])
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const Log = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error("We ran into an error, please try again.")
      setLoading(false)
    } else {
      toast.success("Successfully logged in!")
      setLoading(false)
      navigate('/Dashboard')
    }
  }

  const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/Dashboard`
      }
    })
    if (error) toast.error("Google login failed.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="bg-[#1e293b] w-full max-w-[440px] rounded-2xl p-8 shadow-xl">

        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>

        {/* Social Login Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={googleLogin}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Log in with Google</span>
          </button>

          <button type="button" className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-600 hover:bg-gray-700/50 transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.26.7 2.92.7 1.01-.06 2.12-.83 3.51-.7 1.66.08 2.89.65 3.65 1.76-3.06 1.83-2.54 5.92.51 7.15-.71 1.76-1.57 3.05-2.59 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Log in with Apple</span>
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Form */}
        <form onSubmit={Log}>
          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              required
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="Enter your email"
              className="w-full bg-[#334155] text-white text-sm placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              required
              onChange={(e) => { setPassword(e.target.value) }}
              placeholder="••••••••"
              className="w-full bg-[#334155] text-white text-sm placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition-all"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800 bg-[#334155]"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className=" w-full bg-[#2563eb] hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6 cursor-pointer flex items-center justify-center disabled:opacity-70"
          >
            {!loading ? "Log in" :
              <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
              </div>}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-400 text-center">
          Don't have an account yet?{' '}
          <Link className="text-blue-500 hover:text-blue-400 font-medium transition-colors" to={'/'}>Sign Up</Link>
        </p>

      </div>
    </div>
  )
}