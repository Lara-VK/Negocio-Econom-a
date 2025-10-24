import React from 'react'
import { getCurrentUser } from '../lib/auth'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children, role }){
  const user = getCurrentUser()
  if(!user) return <Navigate to="/login" replace />
  if(role && user.role !== role) return <Navigate to="/" replace />
  return children
}
