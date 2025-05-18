import { useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Link, NavLink } from 'react-router-dom'
import MBankLogoIcon from './icons/MBankLogoIcon'
import GearIcon from './icons/GearIcon'

interface Props {
  className?: string
}

export default function Header({ className }: Props) {
  const { keycloak } = useKeycloak()
  const [showConfirm, setShowConfirm] = useState(false)

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}
     px-1.5 py-1 rounded transition-colors duration-200 sm:px-2`

  const handleLogoutClick = () => {
    setShowConfirm((prev) => !prev)
  }

  const confirmLogout = () => {
    setShowConfirm(false)
    keycloak.logout()
  }

  return (
    <>
      <header
        className={`relative flex items-center justify-between border-b border-neutral-500/30 pb-4 ${className}`}
      >
        <nav className="flex items-center gap-x-2 sm:gap-x-8">
          <Link to="/" className="hidden sm:mr-8 sm:block">
            <MBankLogoIcon className="h-10 text-sky-500" />
          </Link>

          <NavLink to="/" className={getNavLinkClass}>
            Главная
          </NavLink>
          <NavLink to="/history" className={getNavLinkClass} end>
            Истории
          </NavLink>
          <NavLink to="/transaction" className={getNavLinkClass} end>
            Транзакции
          </NavLink>
          {/* <NavLink to="/not-found">404</NavLink> */}
        </nav>
        {/* <button
          className="size-8 cursor-pointer rounded-md bg-gray-200 p-1"
          onClick={handleLogoutClick}
          // onClick={() => keycloak.logout()}
        >
          <GearIcon className="text-gray-700"></GearIcon>
        </button> */}

        {/* Кнопка с тултипом ниже */}
        <div className="relative">
          <button
            className="size-8 cursor-pointer rounded-md bg-gray-800/10 p-1"
            onClick={handleLogoutClick}
          >
            <GearIcon className="text-gray-700" />
          </button>

          {showConfirm && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded border border-gray-200 bg-white p-3 shadow-lg">
              <p className="mb-2 text-sm text-gray-700">Выйти из аккаунта?</p>
              <button
                className="w-full rounded bg-red-600 py-1 text-white transition hover:bg-red-700"
                onClick={confirmLogout}
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
