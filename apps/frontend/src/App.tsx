import { useRef, useState } from 'react'

interface IUser {
  accountNumber: number
  name: string
  balance: number
}

export default function App() {
  const [data, setData] = useState<IUser | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = inputRef.current?.value?.trim()

    if (!name) {
      // валидация
      // alert('Введите имя!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        throw new Error(`Ошибка: ${res.statusText}`)
      }

      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Ошибка при получении данных:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={fetchUserData}>
        <div className="mb-2 max-w-xl">
          <label
            htmlFor="first_name"
            className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ваше имя
          </label>
          <input
            ref={inputRef}
            type="text"
            id="first_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Имя"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-8 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : 'Получить данные'}
        </button>
      </form>

      {data && (
        <div className="rounded border bg-gray-100 p-4 dark:bg-gray-800 dark:text-white">
          <p>Имя: {data.name}</p>
          <p>Счет: {data.accountNumber}</p>
          <p>Баланс: {data.balance}</p>
        </div>
      )}
    </div>
  )
}
