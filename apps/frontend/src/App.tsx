import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import ProtectedLayout from './components/ProtectedLayout'
import History from './pages/History'
import Transaction from './pages/Transaction'
import NotFound from './pages/NotFound'
import Main from './pages/Main'

export default function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
        <Routes>
          <Route
            element={
              <RequireAuth>
                <ProtectedLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Main />} />
            <Route path="/history" element={<History />} />
            <Route path="/transaction" element={<Transaction />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
