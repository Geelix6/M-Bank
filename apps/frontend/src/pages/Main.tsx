import { useEffect, useState, useCallback } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { UserDataDto } from '../dto/userDataDto'
import { ErrorResponseDto } from '../dto/errorResponseDto'
import { getTimeOfDay } from '../utils/getTimeOfDay'
import { formatRubles } from '../utils/formatRoubles'
import ReloadIcon from '../components/icons/ReloadIcon'
import { fetchApi } from '../utils/fetchApi'
import { Link } from 'react-router-dom'

interface Transaction {
  fromUserId: string
  toUserId: string
  amount: number
  time: string
  type: string
  fromFirstName: string
  fromLastName: string
  toFirstName: string
  toLastName: string
}

export default function Main() {
  const { keycloak } = useKeycloak()

  const greeting = getTimeOfDay()
  const firstName = keycloak.tokenParsed?.given_name

  // balance
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // transactions
  const [txs, setTxs] = useState<Transaction[] | null>(null)
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!keycloak.token) return

    setLoading(true)
    setError(null)

    try {
      const data = await fetchApi<UserDataDto>('/api/balance', {
        method: 'POST',
        token: keycloak.token,
      })
      setBalance(data.balance)
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setBalance(null)
      setError(e.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [keycloak.token])

  // useEffect(() => {
  //   fetchBalance()
  // }, [fetchBalance])

  const fetchTxs = useCallback(async () => {
    if (!keycloak.token) return
    setTxLoading(true)
    setTxError(null)
    try {
      const data = await fetchApi<Transaction[]>('/api/transactions/history?limit=3', {
        method: 'POST',
        token: keycloak.token,
      })
      setTxs(data)
    } catch (err: any) {
      console.error(err)
      setTxs(null)
      setTxError(err.message || 'Произошла ошибка')
    } finally {
      setTxLoading(false)
    }
  }, [keycloak.token])

  useEffect(() => {
    fetchBalance()
    fetchTxs()
  }, [fetchBalance, fetchTxs])

  return (
    <>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">
          {greeting}, {firstName}!
        </h2>
        <div className="flex max-w-96 flex-col gap-y-1 rounded bg-blue-100 px-4 py-3">
          <div className="flex justify-between">
            <span>Ваш баланс</span>
            <span
              className="size-5 cursor-pointer"
              title="Обновить данные"
              onClick={() => {
                if (!loading) fetchBalance()
              }}
            >
              <ReloadIcon className="text-blue-600" />
            </span>
          </div>

          {loading || balance === null ? (
            <div role="status" className="max-w-sm animate-pulse">
              <div className="h-8 w-48 rounded-full bg-gray-500"></div>
            </div>
          ) : (
            <span className="text-2xl font-semibold text-slate-900">{formatRubles(balance)}</span>
          )}
          {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Сервисы</h2>
        <div className="flex gap-x-4">
          <div className="flex size-20 flex-col gap-y-1 rounded bg-blue-100 px-4 py-3">подарок</div>
          <div className="flex size-20 flex-col gap-y-1 rounded bg-blue-100 px-4 py-3">вклад</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Последние операции</h2>
      </section>

      {/* Последние операции */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Последние операции</h2>
          <span
            className="size-5 cursor-pointer"
            title="Обновить операции"
            onClick={() => {
              if (!txLoading) fetchTxs()
            }}
          >
            <ReloadIcon className="text-slate-700" />
          </span>
        </div>

        {txLoading || txs === null ? (
          <div role="status" className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-full max-w-md rounded bg-gray-500"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {txs.map((tx, idx) => {
              const date = new Date(tx.time).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
              const isIncoming = tx.toUserId === keycloak.tokenParsed?.sub
              const peerName = isIncoming
                ? `${tx.fromFirstName} ${tx.fromLastName}`
                : `${tx.toFirstName} ${tx.toLastName}`

              return (
                <li key={idx} className="flex justify-between">
                  <div>
                    <div className="font-medium">{peerName}</div>
                    <div className="text-sm text-gray-600">{date}</div>
                  </div>
                  <div
                    className={`font-semibold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {isIncoming ? '+' : '-'}
                    {formatRubles(tx.amount)}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {txError && <div className="mt-2 text-sm text-red-600">{txError}</div>}

        <div className="mt-6">
          <Link to="/history" className="text-blue-600 hover:underline">
            Полная история &rarr;
          </Link>
        </div>
      </section>
    </>
  )
}
