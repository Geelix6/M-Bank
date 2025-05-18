import { useKeycloak } from '@react-keycloak/web'
import { Link, NavLink } from 'react-router-dom'
import { Popover } from 'antd'
import MBankLogoIcon from './icons/MBankLogoIcon'
import GearIcon from './icons/GearIcon'

interface Props {
  className?: string
}

export default function Header({ className }: Props) {
  const { keycloak } = useKeycloak()

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}
     px-1.5 py-1 rounded transition-colors duration-200 sm:px-2`

  const popoverContent = (
    <p className="font-inter cursor-pointer text-red-600" onClick={() => keycloak.logout()}>
      Выйти из аккаунта
    </p>
  )

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
        </nav>

        <Popover content={popoverContent} placement="bottomRight" trigger="click">
          <button className="size-8 cursor-pointer rounded-md bg-gray-200 p-1">
            <GearIcon className="text-gray-700"></GearIcon>
          </button>
        </Popover>
      </header>
    </>
  )
}
