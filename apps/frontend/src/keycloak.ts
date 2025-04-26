import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  // хотелось бы не передавать эти параметры в образе, но ведь vite уже собрал все,
  // и import.meta.env определил, vite_ переменные не попадут
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export default keycloak
