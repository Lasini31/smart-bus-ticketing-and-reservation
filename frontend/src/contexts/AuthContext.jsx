// src/contexts/AuthContext.jsx
import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'smart-bus-user'
const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.busmanagement.internal/v1'

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Also ensure these are set for WalletContext
        if (parsed.token) localStorage.setItem('jwt_token', parsed.token)
        if (parsed.userId) localStorage.setItem('userId', parsed.userId)
        if (parsed.role) localStorage.setItem('userRole', parsed.role)
        return parsed
      }
      return null
    } catch {
      return null
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sync user state across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === AUTH_STORAGE_KEY) {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUserState(newUser)
        } catch {
          setUserState(null)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setUser = (payload) => {
    // Store all auth data
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
    
    // IMPORTANT: Store these separately for easy access by other contexts
    if (payload?.token) {
      localStorage.setItem('jwt_token', payload.token)
    }
    if (payload?.userId) {
      localStorage.setItem('userId', payload.userId)
    }
    if (payload?.role) {
      localStorage.setItem('userRole', payload.role)
    }
    
    setUserState(payload)
  }

  const clearUser = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem('userId')
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('userRole')
    
    // Clear wallet data too
    const userId = user?.userId || localStorage.getItem('userId')
    if (userId) {
      localStorage.removeItem(`transactions_${userId}`)
      localStorage.removeItem(`wallet_balance_${userId}`)
    }
    
    setUserState(null)
  }

  // Login - POST /auth/login
  const login = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email,
          password: password
        })
      })
      
      if (!response.ok) {
        let errorMessage = 'Unable to login'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error?.message || errorData.message || errorMessage
        } catch {
          errorMessage = `Login failed (${response.status}). Please check your credentials.`
        }
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      
      // IMPORTANT: Store the user data in the format expected by WalletContext
      const payload = {
        name: result.name || email.split('@')[0],
        token: result.token,
        userId: result.userId,
        role: result.role || 'passenger',
        email: email
      }
      
      setUser(payload)
      return payload
      
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register - POST /auth/register
  const register = async ({ name, email, password, phone, role = 'passenger' }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          contactNumber: phone,
          password: password,
          role: role
        })
      })
      
      if (!response.ok) {
        let errorMessage = 'Registration failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error?.message || errorData.message || errorMessage
        } catch {
          errorMessage = `Registration failed (${response.status})`
        }
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      return result
      
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Forgot Password - POST /auth/forgot-password
  const forgotPassword = async (email) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        let errorMessage = 'Password reset failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error?.message || errorData.message || errorMessage
        } catch {
          errorMessage = `Password reset failed (${response.status})`
        }
        throw new Error(errorMessage)
      }
      
      return await response.json()
      
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout - DELETE /auth/logout
  const logout = async () => {
    setLoading(true)
    
    try {
      const token = localStorage.getItem('jwt_token')
      
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearUser()
      setLoading(false)
    }
  }

  // Helper to check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!user.token
  }

  // Helper to check user role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Get current token
  const getToken = () => {
    return user?.token || localStorage.getItem('jwt_token')
  }

  // Get current user ID
  const getUserId = () => {
    return user?.userId || localStorage.getItem('userId')
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      forgotPassword,
      isAuthenticated: isAuthenticated(),
      hasRole,
      getToken,
      getUserId,
      // Convenience getters for WalletContext
      token: user?.token || localStorage.getItem('jwt_token'),
      userId: user?.userId || localStorage.getItem('userId'),
      userRole: user?.role || localStorage.getItem('userRole')
    }),
    [user, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}