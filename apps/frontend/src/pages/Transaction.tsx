import { useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Form, Input, InputNumber, Button, Modal } from 'antd'
import { TransactionRequestDto } from '../dto/transactionRequestDto'
import { ErrorResponseDto } from '../dto/errorResponseDto'
import { fetchApi } from '../utils/fetchApi'
import { formatRubles } from '../utils/formatRoubles'
import TickIcon from '../components/icons/TickIcon'
import { formatDate } from '../utils/formatDate'

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

  return (
    <>
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
