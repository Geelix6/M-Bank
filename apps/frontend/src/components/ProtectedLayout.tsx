import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function ProtectedLayout() {
  return (
    <div className="flex min-h-screen flex-col text-sm text-slate-800 sm:text-base">
      <div className="mx-auto mb-5 w-full max-w-6xl flex-grow px-4 pt-10 sm:mb-10 sm:px-8">
        <Header className="mb-5 sm:mb-10" />
        <main>
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
