import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function Register() {
  // --- STATE VARIABLES ---
  const [role, setRole] = useState(''); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize the navigation tool

  // --- GOOGLE SIGN UP HANDLER ---
  const handleGoogleSignUp = () => {
    setErrorMessage(''); 

    if (!role) {
      setErrorMessage("Please select a role before signing up with Google.");
      return;
    }

    alert(`Ready to connect to Google Auth as a: ${role}`);
  };

  // --- SUBMIT FUNCTION FOR MANUAL SIGN UP ---
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setErrorMessage(''); 

    if (!role) {
      setErrorMessage("Please select a role before signing up manually.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return; 
    }

    // --- PREPARE DATA FOR BACKEND ---
    const userData = {
      role: role, 

      username: username,
      password: password,
      phone: phone,
      email: email
    };

    try {
      const response = await fetch('http://localhost:8081/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Teleport the user to the login page on success!
        navigate('/login'); 
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

          {/* Compulsory Role Selection Dropdown */}
          <div className="mb-6">
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700"
            >
              <option value="" disabled>Select your role...</option>
              <option value="passenger">Passenger</option>
              <option value="driver">Driver</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* Option 1 - Google Sign Up */}
          <button 
            type="button" 
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center space-x-3 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-green-200"></div>
            <span className="px-3 text-gray-400 text-xs font-bold tracking-wider">OR FILL MANUALLY</span>
            <div className="flex-grow border-t border-green-200"></div>
          </div>

          {/* Option 2 - Manual Sign Up Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
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

            {/* Error Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium mt-2">
                {errorMessage}
              </div>
            )}

            <div className="mt-6">
              <button type="submit" className="w-full py-2 px-6 border border-gray-800 rounded font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                Sign Up
              </button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-600 font-medium">Already have an account?</p>
            <a href="/login" className="text-xs text-green-500 hover:underline">Login</a>
          </div>
          
        </div>
      </div>

    </div>
  );
}