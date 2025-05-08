import './styles.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import App from './App.tsx'
import AnimatedSpinnerIcon from './components/icons/AnimatedSpinnerIcon.tsx'

const root = createRoot(document.getElementById('root')!)

root.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      checkLoginIframe: false,
    }}
    LoadingComponent={
      <div className="flex h-svh w-full items-center justify-center" role="status">
        <AnimatedSpinnerIcon className="size-12 fill-blue-600 text-gray-200 dark:text-gray-600" />
        <span className="sr-only">Loading...</span>
      </div>
    }
  >
    <StrictMode>
      <App />
    </StrictMode>
  </ReactKeycloakProvider>,
)
