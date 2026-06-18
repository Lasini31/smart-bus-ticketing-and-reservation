// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
    const navigate = useNavigate()
    const { login, loading: authLoading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        
        // Clear previous errors
        setError('')
        
        if (!email.trim() || !password.trim()) {
            setError('Please enter both your email and password.')
            return
        }

        // Basic email validation
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address.')
            return
        }

        setIsLoading(true)
        try {
            // Call backend API to validate credentials
            // The AuthContext login expects { email, password }
            const result = await login({ 
                email: email.trim(), 
                password: password.trim() 
            })
            
            // If successful, redirect based on role
            if (result.role === 'owner') {
                navigate('/owner/dashboard')
            } else {
                const redirectTo = location.state?.from?.pathname || '/'
                navigate(redirectTo)
            }
            
        } catch (err) {
            // Show error message from backend or generic message
            setError(err.message || 'Invalid username or password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError('Please enter your email address to reset your password.')
            return
        }

        try {
            const { forgotPassword } = useAuth()
            await forgotPassword(email.trim())
            alert('Password reset instructions have been sent to your registered email.')
        } catch (err) {
            setError(err.message || 'Failed to send password reset email. Please try again.')
        }
    }

    return (
        <section className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-100 sm:p-10">
                {/* Header Text */}
                <div className="text-center sm:text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Secure Access</p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to manage your tickets, wallet, and fast bookings.
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    
                    {/* Error Message Display */}
                    {error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}
                    
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="Enter your email address"
                                required
                                disabled={isLoading || authLoading}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <button 
                                type="button" 
                                onClick={handleForgotPassword}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                disabled={isLoading || authLoading}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                placeholder="••••••••"
                                required
                                disabled={isLoading || authLoading}
                                autoComplete="current-password"
                            />
                            {/* Password Visibility Toggle Icon */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                disabled={isLoading || authLoading}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20"
                            disabled={isLoading || authLoading}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-600 select-none">
                            Keep me logged in
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isLoading || authLoading}
                        className="w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-[0.99] focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading || authLoading ? 'Signing In...' : 'Sign In securely'}
                    </button>
                </form>

                {/* Go to Register Navigation */}
                <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm">
                    <p className="text-slate-500">
                        New to Smart Bus?{' '}
                        <button 
                            type="button"
                            onClick={() => navigate('/register')} 
                            className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                            Create an account
                        </button>
                    </p>
                </div>
            </div>
        </section>
    )
}