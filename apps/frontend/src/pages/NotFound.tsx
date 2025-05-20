import { Link } from 'react-router-dom'
import MBankLogoIcon from '../components/icons/MBankLogoIcon'
import ArrowRight from '../components/icons/ArrowRight'

export default function NotFound() {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col items-center gap-y-2 p-2">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="text-lg text-slate-600">Страница не найдена</p>
        <p className="text-center text-sm text-slate-500">
          Возможно, вы ввели неверный адрес или страница была удалена.
        </p>
        <Link
          to="/"
          className="mb-4 flex items-center gap-x-1 text-blue-600 transition-colors duration-200 hover:text-blue-400"
        >
          На главную <ArrowRight className="size-4" />
        </Link>
        <div className="mb-8 h-px w-full bg-gray-500"></div>
        <div className="flex items-center gap-x-2">
          <MBankLogoIcon className="size-12 text-blue-600" />
          <span className="text-lg font-semibold">Он такой единственный</span>
        </div>
      </div>
    </div>
  )
}
