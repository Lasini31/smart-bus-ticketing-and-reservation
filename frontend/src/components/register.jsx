import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth

export default function Register() {
  // --- STATE VARIABLES ---
  const [role, setRole] = useState(''); 
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  // --- GOOGLE SIGN UP HANDLER ---
  const handleGoogleSignUp = () => {
    setErrorMessage(''); 

    if (!role) {
      setErrorMessage("Please select a role before signing up with Google.");
      return;
    }

    alert(`Ready to connect to Google Auth as a: ${role}`);
  };

  useEffect(() => {
    setPasswordScore(calculatePasswordScore(password));
  }, [password]);

  function calculatePasswordScore(pw) {
    let score = 0;
    if (!pw) return 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0..4
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Basic international phone validation
    return /^\+?[0-9]{7,15}$/.test(phone.replace(/\s+/g, ''));
  }

  function validateFields() {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!validatePhone(phone)) errors.phone = 'Enter a valid phone number (digits only, include country code)';
    if (!validateEmail(email)) errors.email = 'Enter a valid email address';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) errors.terms = 'You must accept the terms and privacy policy';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // --- SUBMIT FUNCTION FOR MANUAL SIGN UP ---
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setErrorMessage(''); 

    if (!role) {
      setErrorMessage("Please select a role before signing up manually.");
      return;
    }

    if (!validateFields()) {
      setErrorMessage('Please fix highlighted errors before continuing');
      return;
    }

    // --- PREPARE DATA FOR BACKEND ---
    const userData = {
      name: name,
      email: email,
      password: password,
      contactNumber: phone, // Using 'contactNumber' as per API contract
      role: role
    };

    setLoading(true);
    try {
      // First, register the user
      const registerResponse = await fetch('http://localhost:8081/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setErrorMessage(registerData.message || registerData.error?.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Registration successful - now auto-login
      try {
        // Call the login function from AuthContext
        await login({ 
          email: email, 
          password: password 
        });

        // Clear sensitive fields
        setPassword('');
        setConfirmPassword('');

        // Navigate based on role
        if (role === 'owner') {
          navigate('/owner/bus-setup');
        } else {
          navigate('/');
        }
      } catch (loginError) {
        // If login fails, redirect to login page
        console.error('Auto-login failed:', loginError);
        setErrorMessage('Account created! Please login manually.');
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please login.',
            email: email 
          } 
        });
      }

    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Server error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // If role not selected yet, show role selection screen
  if (!role) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Who are you?</h1>
            <p className="mb-6 text-sm text-gray-600">Select your account type to continue.</p>
            <div className="space-y-3">
              <button onClick={() => setRole('passenger')} className="w-full rounded-full border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">I'm a passenger</button>
              <button onClick={() => setRole('owner')} className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">I'm a bus owner</button>
            </div>
            <p className="mt-6 text-xs text-gray-500">You can register as a driver later from your profile.</p>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 justify-center items-center p-12">
          <img src="/bus.png" alt="bus" className="w-full max-w-lg object-contain" />
        </div>
      </div>
    )
  }

  // Passenger registration form
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:flex w-1/2 justify-center items-center p-12">
        <img 
          src="/bus.png" 
          alt="White Bus" 
          className="w-full max-w-lg object-contain"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">{role === 'owner' ? 'Owner Signup' : 'Passenger Signup'}</h1>
          {role === 'owner' && (
            <p className="text-sm text-gray-600 text-center mb-4">You'll be able to add buses and assign staff after completing this signup.</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'error-name' : undefined}
                className={`block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${fieldErrors.name ? 'border-red-400 focus:ring-red-500' : 'border-green-400 focus:ring-green-500'}`} 
              />
              {fieldErrors.name && <div id="error-name" className="text-sm text-red-600 mt-1">{fieldErrors.name}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'error-phone' : undefined}
                placeholder="+947XXXXXXXX or +1XXXXXXXXXX"
                className={`block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${fieldErrors.phone ? 'border-red-400 focus:ring-red-500' : 'border-green-400 focus:ring-green-500'}`} 
              />
              {fieldErrors.phone && <div id="error-phone" className="text-sm text-red-600 mt-1">{fieldErrors.phone}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'error-email' : undefined}
                autoComplete="email"
                className={`block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${fieldErrors.email ? 'border-red-400 focus:ring-red-500' : 'border-green-400 focus:ring-green-500'}`} 
              />
              {fieldErrors.email && <div id="error-email" className="text-sm text-red-600 mt-1">{fieldErrors.email}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'error-password' : 'pw-help'}
                  autoComplete="new-password"
                  className={`block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${fieldErrors.password ? 'border-red-400 focus:ring-red-500' : 'border-green-400 focus:ring-green-500'}`} 
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-sm text-gray-600">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              <div id="pw-help" className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                  <div style={{ width: `${(passwordScore / 4) * 100}%` }} className={`h-full ${passwordScore >= 3 ? 'bg-emerald-500' : passwordScore === 2 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Use at least 8 characters, mix upper/lowercase letters, numbers and symbols.</div>
                {fieldErrors.password && <div id="error-password" className="text-sm text-red-600 mt-1">{fieldErrors.password}</div>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'error-confirm' : undefined}
                  autoComplete="new-password"
                  className={`block w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${fieldErrors.confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-green-400 focus:ring-green-500'}`} 
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-2 top-2 text-sm text-gray-600">{showConfirm ? 'Hide' : 'Show'}</button>
              </div>
              {fieldErrors.confirmPassword && <div id="error-confirm" className="text-sm text-red-600 mt-1">{fieldErrors.confirmPassword}</div>}
            </div>

            <div className="flex items-center gap-2">
              <input id="terms" type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
              <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <a href="/terms" className="text-green-600 hover:underline">terms</a> and <a href="/privacy" className="text-green-600 hover:underline">privacy policy</a>.</label>
            </div>
            {fieldErrors.terms && <div className="text-sm text-red-600">{fieldErrors.terms}</div>}

            {errorMessage && (
              <div className="text-red-500 text-sm font-medium mt-2">
                {errorMessage}
              </div>
            )}

            <div className="mt-6">
              <button type="submit" disabled={loading} className={`w-full py-2 px-6 rounded font-semibold text-white transition-colors ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {loading ? 'Signing up…' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-600 font-medium">Already have an account?</p>
            <a href="/login" className="text-xs text-green-500 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}