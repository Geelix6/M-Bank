import { useRef, useState } from 'react'

interface IUser {
  accountNumber: number
  name: string
  balance: number
}

interface IApiError {
  message: string
}

export default function App() {
  const [data, setData] = useState<IUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const fetchUserData = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const phoneNumber = inputRef.current?.value?.trim()

    if (!phoneNumber) {
      // валидация
      // alert('Введите номер!')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!res.ok) {
        const errorData: IApiError = await res.json()
        throw new Error(errorData.message)
      }

      const json: IUser = await res.json()
      setData(json)
    } catch (error) {
      let errorMessage = 'Ошибка при получении данных'
      if (error && typeof error === 'object' && 'message' in error && error.message !== '') {
        errorMessage = (error as { message: string }).message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={fetchUserData}>
        <div className="mb-2 max-w-xl">
          <label
            htmlFor="phone_number"
            className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Номер телефона
          </label>
          <input
            ref={inputRef}
            type="text"
            id="phone_number"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Введите номер телефона"
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

      {error && (
        <div className="mb-4 rounded border border-red-500 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

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
