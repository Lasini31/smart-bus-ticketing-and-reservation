import { useState } from 'react';

export default function Register() {
  // --- 1. STATE VARIABLES ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // --- 2. SUBMIT FUNCTION ---
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the page from refreshing

    setErrorMessage(''); // Clear old errors

    // --- 3. CLIENT-SIDE VALIDATION ---
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return; 
    }

    // --- 4. PREPARE DATA FOR BACKEND ---
    // Match these names with what your backend team asks for
    const userData = {
      username: username,
      password: password,
      phone: phone,
      email: email
    };

    try {
      // Connect to the backend (Replace URL when backend team gives it to you)
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert("Registration Successful! You can now log in.");
        // Usually, you would use React Router here to navigate to the Login page
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }

    } catch (error) {
      console.log("Failed to connect to backend", error);
      setErrorMessage("Server error. Please make sure the backend is running.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* Left Side: Bus Image */}
      <div className="hidden md:flex w-1/2 justify-center items-center p-12">
        <img 
          src="/bus.png" 
          alt="White Bus" 
          className="w-full max-w-lg object-contain"
        />
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">Create an account</h1>

          {/* ADDED onSubmit to the form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500" 
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500" 
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500" 
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500" 
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500" 
              />
            </div>

            {/* NEW: Error Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium mt-2">
                {errorMessage}
              </div>
            )}

            {/* Sign Up Button (Changed type to "submit") */}
            <div className="mt-6">
              <button type="submit" className="py-1 px-6 border border-gray-800 rounded font-semibold text-gray-800 hover:bg-gray-50">
                Sign Up
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-green-200"></div>
            <span className="px-3 text-gray-400 text-xs font-semibold">OR</span>
            <div className="flex-grow border-t border-green-200"></div>
          </div>

          {/* Bottom Links & Social Buttons */}
          <div className="text-center space-y-3">
            <div className="flex justify-center space-x-4">
              
              {/* Google Button */}
              <button type="button" className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </button>

              {/* Facebook Button */}
              <button type="button" className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              
            </div>

            <p className="text-xs text-gray-600 font-medium mt-6">Already have an account?</p>
            <a href="#" className="text-xs text-green-500 hover:underline">Login</a>
          </div>
        </div>
      </div>

    </div>
  );
}