import { useState } from 'react'

interface IUser {
  accountNumber: string
  name: string
  balance: string
}

export default function App() {
  const [data, setData] = useState<IUser>()

  const fetchUserData = async () => {
    const res = await fetch('/api/trigger') // порт auth-service
    const json = await res.json()
    setData(json)
  }

  return (
    <div className="p-4">
      <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={fetchUserData}>
        Получить данные
      </button>

      {data && (
        <div className="mt-4 rounded border bg-gray-100 p-4">
          <p>Имя: {data.name}</p>
          <p>Счет: {data.accountNumber}</p>
          <p>Баланс: {data.balance}</p>
        </div>
      )}
    </div>
  )
}
