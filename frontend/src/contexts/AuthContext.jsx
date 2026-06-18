import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'smart-bus-user'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081'

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY))
    } catch {
      return null
    }
  })

  const setUser = (payload) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
    setUserState(payload)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUserState(null)
  }

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
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
    const payload = {
      name: result.name || email,
      token: result.token,
      userId: result.userId,
      role: result.role || 'passenger'
    }
    setUser(payload)
    return payload
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      login,
      authUrl: API_BASE + '/auth'
    }),
    [user, setUser, logout, login]
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
