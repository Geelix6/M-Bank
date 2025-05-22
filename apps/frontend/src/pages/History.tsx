import { useKeycloak } from '@react-keycloak/web'
import { useEffect, useState, useCallback } from 'react'
import { fetchApi } from '../utils/fetchApi'
import { ErrorResponseDto } from '../dto/errorResponseDto'
import { TransactionDto } from '../dto/transactionDto'
import { formatRubles } from '../utils/formatRoubles'
import { formatDate } from '../utils/formatDate'
import ReloadIcon from '../components/icons/ReloadIcon'
import PrizeIcon from '../components/icons/PrizeIcon'
import RubleIcon from '../components/icons/RubleIcon'

export default function History() {
  const { keycloak } = useKeycloak()

  const [txs, setTxs] = useState<TransactionDto[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTxs = useCallback(async () => {
    if (!keycloak.token) return

    setLoading(true)
    setError(null)
    try {
      const data = await fetchApi<TransactionDto[]>('/api/transactions/history', {
        method: 'GET',
        token: keycloak.token,
      })
      setTxs(data)
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setTxs(null)
      setError(e.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [keycloak.token])

  useEffect(() => {
    fetchTxs()
  }, [fetchTxs])

  const grouped: Record<string, TransactionDto[]> = {}
  if (txs) {
    txs.forEach((tx) => {
      const dateKey = new Date(tx.time).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
      })
      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(tx)
    })
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">История транзакций</h1>
        <button
          onClick={() => {
            if (!loading) fetchTxs()
          }}
          title="Обновить историю"
          className="size-5 cursor-pointer text-blue-600 hover:text-blue-400"
        >
          <ReloadIcon />
        </button>
      </div>

      {loading && (
        <div role="status" className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
            <div key={i} className="h-10 w-full rounded-lg bg-slate-300"></div>
          ))}
        </div>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {!loading && !error && txs && txs.length === 0 && <p>Нет ни одной транзакции</p>}

      {!loading &&
        !error &&
        txs &&
        txs.length > 0 &&
        Object.entries(grouped).map(([date, items]) => (
          <section key={date} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">{date}</h2>
            <ul className="space-y-4">
              {items.map((tx, idx) => {
                const isIncoming = tx.toUserId === keycloak.tokenParsed?.sub
                const isGift = tx.type === 'GIFT'
                const peerName = isIncoming
                  ? `${tx.fromFirstName} ${tx.fromLastName}`
                  : `${tx.toFirstName} ${tx.toLastName}`

                return (
                  <li
                    key={idx}
                    className="flex items-center rounded-lg bg-white px-4 py-3 shadow-sm"
                  >
                    <div className="mr-4 size-10 rounded-full bg-blue-100 p-2">
                      {isGift ? (
                        <PrizeIcon className="text-blue-600" />
                      ) : (
                        <RubleIcon className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{isGift ? 'Подарок от М-Банка' : peerName}</div>
                      <div className="text-sm text-gray-600">{formatDate(new Date(tx.time))}</div>
                    </div>
                    <div
                      className={`text-lg font-semibold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {isIncoming ? '+' : '-'}
                      {formatRubles(tx.amount)}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
    </>
  )
}
