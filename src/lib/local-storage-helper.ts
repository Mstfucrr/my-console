export function getItem(key: string) {
  if (typeof window === 'undefined') return false
  const item = localStorage.getItem(key)
  if (item) {
    return item
  }

  return ''
}

const TOKEN_KEY = 'user'

interface TokenType {
  accessToken: string | null
  refreshToken: string | null
}

export function getToken(): TokenType {
  const user = localStorage.getItem(TOKEN_KEY)
  if (user) {
    const userData: TokenType = JSON.parse(user)

    return userData
  }

  return { accessToken: null, refreshToken: null }
}

export function setToken(token: TokenType) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getItemJson(key: string) {
  const item = localStorage.getItem(key)
  if (!item) return null
  return JSON.parse(item)
}

export function getOrDefault<T>(key: string, defaultObject: T) {
  const item = localStorage.getItem(key)
  if (!item) return defaultObject
  return JSON.parse(item) as T
}

export function setItem(key: string, value: string | object) {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}

export function removeItem(key: string) {
  localStorage.removeItem(key)
}

export function clear() {
  localStorage.clear()
}
