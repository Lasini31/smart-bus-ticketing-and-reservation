import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6 font-sans">
      {/* Container holding image on the left and form on the right */}
      <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl w-full gap-12 md:gap-16">
        
        {/* Left Side: Bus Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="/icons/Bus2.png" // Replace with your actual bus image path if different
            alt="Smart Bus" 
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 max-w-md flex flex-col">
          <h1 className="text-5xl font-semibold text-gray-900 text-center mb-10">Login</h1>
          
          <form className="flex flex-col w-full">
            {/* Username Input */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">Username</label>
              <input 
                type="text" 
                placeholder="Username" 
                className="w-full border border-emerald-500 rounded px-3 py-2 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <label className="block text-gray-700 font-medium mb-1 text-sm md:text-base">Password</label>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full border border-emerald-500 rounded px-3 py-2 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Forget Password link */}
            <div className="text-right mb-6">
              <a href="#forgot" className="text-emerald-600 text-sm hover:underline">
                Forget Password?
              </a>
            </div>

            {/* Login Button */}
            <div className="mb-10">
              <button 
                type="submit" 
                className="border border-emerald-600 text-gray-900 font-bold px-6 py-1.5 rounded text-base hover:bg-emerald-50 transition-colors"
              >
                Login
              </button>
            </div>

            {/* OR Separator line */}
            <div className="relative flex py-2 items-center justify-center mb-6">
              <div className="flex-grow border-t border-emerald-400 max-w-[100px]"></div>
              <span className="flex-shrink mx-4 text-emerald-500 font-medium text-xs">OR</span>
              <div className="flex-grow border-t border-emerald-400 max-w-[100px]"></div>
            </div>

            {/* Social Icons */}
                        {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-8">
              {/* Google Button */}
              <button 
                type="button" 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.054 14.968 0 12 0 7.354 0 3.373 2.668 1.417 6.564l3.849 3.201z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M1.417 6.564A11.946 11.946 0 0 0 0 12c0 1.922.454 3.734 1.261 5.348l4.032-3.125A6.994 6.994 0 0 1 5 12c0-.793.13-1.554.37-2.266L1.417 6.564z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.974-1.077 7.964-2.922l-3.79-2.936c-1.114.747-2.54 1.192-4.174 1.192-3.224 0-5.96-2.176-6.93-5.112l-4.01 3.107C3.013 21.218 6.91 24 12 24z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.755 12.227c0-.79-.07-1.54-.2-2.273H12v4.51h6.605A5.666 5.666 0 0 1 16.14 18.23l3.79 2.936c2.214-2.04 3.825-5.04 3.825-8.939z"
                  />
                </svg>
              </button>

              {/* Facebook Button */}
              <button 
                type="button" 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>


            {/* Bottom Register Prompt */}
            <div className="text-center">
              <p className="text-gray-900 font-medium text-sm md:text-base mb-1">Don't have an account?</p>
              <a href="#register" className="text-emerald-500 text-xs md:text-sm font-medium hover:underline">
                Create new account
              </a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
