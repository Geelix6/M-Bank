import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { Modal } from 'antd'
import { UserDataDto } from '../dto/userDataDto'
import { ErrorResponseDto } from '../dto/errorResponseDto'
import { TransactionDto } from '../dto/transactionDto'
import { fetchApi } from '../utils/fetchApi'
import { getTimeOfDay } from '../utils/getTimeOfDay'
import { formatRubles } from '../utils/formatRoubles'
import { formatDate } from '../utils/formatDate'
import ReloadIcon from '../components/icons/ReloadIcon'
import ArrowRightIcon from '../components/icons/ArrowRightIcon'
import PrizeIcon from '../components/icons/PrizeIcon'
import BankIcon from '../components/icons/BankIcon'
import RubleIcon from '../components/icons/RubleIcon'
import { FortuneWheel } from '../components/FortuneWheel'
import IncomeIcon from '../components/icons/IncomeIcon'

export default function Main() {
  const { keycloak } = useKeycloak()

  const greeting = getTimeOfDay()
  const firstName = keycloak.tokenParsed?.given_name

  // modals
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const toggleGiftModal = () => setIsGiftModalOpen((prev) => !prev)
  const toggleDepositModalOpen = () => setIsDepositModalOpen((prev) => !prev)

  // balance
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState<string | null>(null)

  // transactions
  const [txs, setTxs] = useState<TransactionDto[] | null>(null)
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!keycloak.token) return

    setBalanceLoading(true)
    setBalanceError(null)

    try {
      const data = await fetchApi<UserDataDto>('/api/balance', {
        method: 'GET',
        token: keycloak.token,
      })
      setBalance(data.balance)
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setBalance(null)
      setBalanceError(e.message || 'Произошла ошибка')
    } finally {
      setBalanceLoading(false)
    }
  }, [keycloak.token])

  const fetchTxs = useCallback(async () => {
    if (!keycloak.token) return
    setTxLoading(true)
    setTxError(null)
    try {
      const data = await fetchApi<TransactionDto[]>('/api/transactions/history', {
        method: 'GET',
        token: keycloak.token,
      })
      setTxs(data)
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setTxs(null)
      setTxError(e.message || 'Произошла ошибка')
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
                if (!balanceLoading) fetchBalance()
                if (!txLoading) fetchTxs()
              }}
            >
              <ReloadIcon className="text-blue-600" />
            </span>
          </div>

          {balanceLoading || balance === null ? (
            <div role="status" className="max-w-sm animate-pulse">
              <div className="h-8 w-48 rounded-lg bg-slate-300"></div>
            </div>
          ) : (
            <span className="text-2xl font-semibold text-slate-900">{formatRubles(balance)}</span>
          )}
          {balanceError && <div className="mt-1 text-sm text-red-600">{balanceError}</div>}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Сервисы</h2>
        <div className="flex gap-x-4">
          <div
            onClick={toggleGiftModal}
            className="flex size-32 cursor-pointer flex-col gap-y-1 rounded bg-blue-100 px-4 py-3"
          >
            <PrizeIcon className="text-blue-600" />
            <h3 className="text-center text-sm font-semibold text-slate-900">
              Получить подарок от банка
            </h3>
          </div>
          <div
            onClick={toggleDepositModalOpen}
            className="flex size-32 cursor-pointer flex-col gap-y-1 rounded bg-blue-100 px-4 py-3"
          >
            <BankIcon className="text-blue-600" />
            <h3 className="text-center text-sm font-semibold text-slate-900">
              Открыть вклад в М-Банке
            </h3>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-x-8">
          <h2 className="text-xl font-semibold text-slate-900">Последние операции</h2>
          <span
            className="size-5 cursor-pointer"
            title="Обновить операции"
            onClick={() => {
              if (!txLoading) fetchTxs()
              if (!balanceError) fetchBalance()
            }}
          >
            <ReloadIcon className="text-blue-600" />
          </span>
        </div>

        {txLoading || txs === null ? (
          <div role="status" className="flex animate-pulse flex-col gap-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-full max-w-md rounded-lg bg-slate-300"></div>
            ))}
          </div>
        ) : (
          <ul className="flex max-w-xl flex-col gap-y-4">
            {txs.map((tx, idx) => {
              if (idx >= 3) {
                return
              }

              const isIncoming = tx.toUserId === keycloak.tokenParsed?.sub
              const isGift = tx.type === 'GIFT'
              const peerName = isIncoming
                ? `${tx.fromFirstName} ${tx.fromLastName}`
                : `${tx.toFirstName} ${tx.toLastName}`

              return (
                <li
                  key={idx}
                  className="flex flex-col items-center gap-y-2 rounded px-3 py-2 shadow sm:flex-row"
                >
                  <div className="size-10 rounded-full bg-blue-100 p-2 sm:mr-6">
                    {isGift ? (
                      <PrizeIcon className="text-blue-600" />
                    ) : (
                      <RubleIcon className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-col items-center sm:mr-auto sm:items-start">
                    <div className="text-lg font-medium">
                      {isGift ? 'Подарок от М-Банка' : peerName}
                    </div>
                    <div className="text-gray-600">{formatDate(new Date(tx.time))}</div>
                  </div>
                  <span
                    className={`text-lg font-semibold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {isIncoming ? '+' : '-'}
                    {formatRubles(tx.amount)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {txError && <div className="mt-2 text-sm text-red-600">{txError}</div>}

        <div className="mt-6">
          <Link
            to="/history"
            className="flex items-center gap-x-1 text-blue-600 transition-colors duration-200 hover:text-blue-400"
          >
            Полная история <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <Modal
        className="font-inter"
        title="Получить подарок от М-Банка"
        open={isGiftModalOpen}
        onCancel={toggleGiftModal}
        footer={null}
        destroyOnHidden
      >
        <FortuneWheel />
      </Modal>

      <Modal
        className="font-inter"
        title="Открыть вклад в М-Банке"
        open={isDepositModalOpen}
        onCancel={toggleDepositModalOpen}
        footer={null}
        destroyOnHidden
      >
        <div className="flex flex-col items-center gap-y-8">
          <p>Совсем скоро Вы сможете открыть вклад в нашем банке под 23% годовых! </p>
          <IncomeIcon className="size-32 text-blue-600" />
        </div>
      </Modal>
    </>
  )
}
