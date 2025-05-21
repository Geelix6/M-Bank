import { useCallback, useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Form, Input, InputNumber, Button, Modal } from 'antd'
import { TransactionRequestDto } from '../dto/transactionRequestDto'
import { UserDataDto } from '../dto/userDataDto'
import { ErrorResponseDto } from '../dto/errorResponseDto'
import { fetchApi } from '../utils/fetchApi'
import { formatRubles } from '../utils/formatRoubles'
import { formatDate } from '../utils/formatDate'
import ReloadIcon from '../components/icons/ReloadIcon'
import TickIcon from '../components/icons/TickIcon'
import CrownIcon from '../components/icons/CrownIcon'

interface TransactionSuccess {
  toUsername: string
  amount: number
  time: string
}

export default function Transaction() {
  const { keycloak } = useKeycloak()
  const [form] = Form.useForm<TransactionRequestDto>()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [successData, setSuccessData] = useState<TransactionSuccess | null>(null)

  // Состояния для списка пользователей
  const [users, setUsers] = useState<UserDataDto[] | null>(null)
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  const onFinish = async (values: TransactionRequestDto) => {
    if (!keycloak.token) return
    setLoading(true)
    setError(null)

    try {
      await fetchApi<void>('/api/transactions/', {
        method: 'POST',
        token: keycloak.token,
        body: values,
      })

      setSuccessData({
        toUsername: values.toUsername,
        amount: values.amount,
        time: new Date().toISOString(),
      })
      setModalVisible(true)
      form.resetFields()
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setError(e.message || 'Произошла ошибка при переводе')
    } finally {
      setLoading(false)
    }
  }

  // Функция загрузки пользователей
  const fetchUsers = useCallback(async () => {
    if (!keycloak.token) return
    setUsersLoading(true)
    setUsersError(null)

    try {
      const data = await fetchApi<UserDataDto[]>('/api/users', {
        method: 'GET',
        token: keycloak.token,
      })
      setUsers(data)
    } catch (_e) {
      const e = _e as ErrorResponseDto
      setUsers(null)
      setUsersError(e.message || 'Произошла ошибка при загрузке пользователей')
    } finally {
      setUsersLoading(false)
    }
  }, [keycloak.token])

  // При монтировании страницы загружаем пользователей
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <>
      <section className="mb-12">
        <h1 className="mb-6 text-2xl font-semibold">Новый перевод</h1>

        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 400 }}>
          <Form.Item
            label="Username получателя"
            name="toUsername"
            rules={[{ required: true, message: 'Введите username получателя' }]}
          >
            <Input placeholder="toUsername" />
          </Form.Item>

          <Form.Item
            label="Сумма перевода"
            name="amount"
            rules={[
              { required: true, message: 'Введите сумму' },
              { type: 'number', min: 0.01, message: 'Сумма должна быть больше 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0.01}
              precision={2}
              step={0.01}
              placeholder="0.00"
            />
          </Form.Item>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Отправить перевод
            </Button>
          </Form.Item>
        </Form>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-x-8">
          <h2 className="text-xl font-semibold text-slate-900">Пользователи М-Банка</h2>
          <span
            className="size-5 cursor-pointer text-blue-600 hover:text-blue-400"
            title="Обновить пользователей"
            onClick={() => {
              if (!usersLoading) fetchUsers()
            }}
          >
            <ReloadIcon />
          </span>
        </div>

        {usersLoading && (
          <div role="status" className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-8 w-full max-w-md rounded bg-gray-300"></div>
            ))}
          </div>
        )}

        {usersError && <div className="mb-4 text-red-600">{usersError}</div>}

        {!usersLoading && users && (
          <ul className="flex w-full max-w-xl flex-col gap-y-4">
            {users.map((user, idx) => (
              <li
                key={user.id}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow"
              >
                <div>
                  <div className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-gray-600">Username: {user.username}</div>
                  <div className="text-gray-600">Email: {user.email}</div>
                </div>
                <div className="flex items-center gap-x-4 text-lg font-semibold text-slate-900">
                  {idx === 0 && <CrownIcon className="size-8 text-yellow-500" />}
                  {formatRubles(user.balance)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        className="font-inter"
        title="Перевод выполнен успешно!"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnHidden
      >
        {successData && (
          <div className="mt-4 flex flex-col items-center gap-y-4">
            <TickIcon className="size-32 text-green-600" />
            <div className="text-center !text-base">
              <p>
                Успешный перевод пользователю {successData.toUsername} на сумму{' '}
                {formatRubles(successData.amount)}
              </p>
              <p>Время перевода: {formatDate(new Date(successData.time))}</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
