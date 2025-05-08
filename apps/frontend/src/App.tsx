import { useKeycloak } from '@react-keycloak/web'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import History from './pages/History'
import Transaction from './pages/Transaction'
import NotFound from './pages/NotFound'
import Main from './pages/Main'
import AnimatedSpinnerIcon from './components/icons/AnimatedSpinnerIcon'

export default function App() {
  const { keycloak, initialized } = useKeycloak()

  if (!initialized) {
    return (
      <div className="flex h-svh w-full items-center justify-center" role="status">
        <AnimatedSpinnerIcon className="size-12 fill-blue-600 text-gray-200 dark:text-gray-600" />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return (
    <BrowserRouter>
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
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/history" element={<History />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
