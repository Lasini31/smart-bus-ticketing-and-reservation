import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    setErrorMessage('');

    if (!role) {
      setErrorMessage("Please select a role before signing up with Google.");
      return;
    }

    alert(`Ready to connect to Google Auth as a: ${role}`);
  };

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

    const userData = {
      role,
      username,
      password,
      phone,
      email
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

      {/* Left Side Image */}
      <div className="hidden md:flex w-1/2 justify-center items-center p-12">
        <img
          src="/bus.png"
          alt="Bus"
          className="w-full max-w-lg object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">
            Create an account
          </h1>

          {/* Role Dropdown */}
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

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center space-x-3 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors font-medium text-gray-700"
          >
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-green-200"></div>
            <span className="px-3 text-gray-400 text-xs font-bold">
              OR FILL MANUALLY
            </span>
            <div className="flex-grow border-t border-green-200"></div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-green-400 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 px-6 border border-gray-800 rounded font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </button>

          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-600 font-medium">
              Already have an account?
            </p>
            <a href="/login" className="text-xs text-green-500 hover:underline">
              Login
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}