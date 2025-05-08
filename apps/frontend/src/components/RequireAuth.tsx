import React, { useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useLocation } from 'react-router-dom'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { keycloak, initialized } = useKeycloak()
  const location = useLocation()

  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login({ redirectUri: window.location.origin + location.pathname })
    }
  }, [initialized, keycloak, location.pathname])

  if (!initialized || !keycloak.authenticated) {
    return null
  }

  return children
}
