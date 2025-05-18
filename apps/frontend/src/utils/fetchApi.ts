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

  const data = (await resp.json()) as T | ErrorResponseDto

  if (!resp.ok) {
    const err = data as ErrorResponseDto
    throw new Error(err.message || `Ошибка ${resp.status}`)
  }

  return data as T
}
