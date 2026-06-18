import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function RequireAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function RequireOwnerAuth({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== 'owner') {
    return <Navigate to="/" replace />
  }

  return children
}

