export function getItem(key: string) {
  if (typeof window === 'undefined') return false
  const item = localStorage.getItem(key)
  if (item) {
    return item
  }

  return ''
}

const TOKEN_KEY = 'token'

interface TokenType {
  accessToken: string
  refreshToken: string
}

export function getToken(): TokenType {
  const user = localStorage.getItem(TOKEN_KEY)
  if (user) {
    const userData: TokenType = JSON.parse(user)

    return userData
  }

  throw new Error('Token not found')
}

export function setToken(token: TokenType) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getItemJson(key: string) {
  const item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item)
  }

  return null
}

export function getOrDefault<T>(key: string, defaultObject: T) {
  const item = localStorage.getItem(key)
  if (item) {
    return JSON.parse(item) as T
  }

  return defaultObject
}

export function setItem(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function removeItem(key: string) {
  localStorage.removeItem(key)
}

export function clear() {
  localStorage.clear()
}
