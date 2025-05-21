import type { ErrorResponseDto } from '../dto/errorResponseDto'

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  token?: string
}

export async function fetchApi<T>(url: string, options: RequestOptions): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`

  const resp = await fetch(url, {
    method: options.method,
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  })

  if (!resp.ok) {
    let errMsg = `Ошибка ${resp.status}`
    try {
      const errorData = (await resp.json()) as ErrorResponseDto
      errMsg = errorData.message || errMsg
    } catch {
      /**/
    }
    throw new Error(errMsg)
  }

  if (resp.status === 204) {
    return undefined as T
  }

  const contentType = resp.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  const data = (await resp.json()) as T
  return data
}
