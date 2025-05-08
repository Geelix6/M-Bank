import { useKeycloak } from '@react-keycloak/web'
import { Outlet, Link } from 'react-router-dom'

export default function ProtectedLayout() {
  const { keycloak } = useKeycloak()

  return (
    <div className="p-4">
      <div className="mb-10 flex justify-between">
        <nav>
          <Link to="/" className="mr-4">
            Главная
          </Link>
          <Link to="/history" className="mr-4">
            Истории
          </Link>
          <Link to="/transaction" className="mr-4">
            Транзакции
          </Link>
          <Link to="/not-found">404</Link>
        </nav>
        <button className="cursor-pointer border p-1" onClick={() => keycloak.logout()}>
          Выйти из аккаунта
        </button>
      </div>

      <Outlet />
    </div>
  )
}
