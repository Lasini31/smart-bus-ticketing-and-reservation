import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import OwnerDashboard from './OwnerDashboard'

export default function OwnerLayout() {
  const { user } = useAuth()

  // Redirect non-owners to home
  if (user && user.role !== 'owner') {
    return <Navigate to="/" replace />
  }

  return <OwnerDashboard />
}
