import { useEffect } from 'react'
import { setToken, hasToken } from '../lib/github'

const TOKEN_KEY = 'life-manager-token'

export function useConfig() {
  useEffect(() => {
    if (!hasToken()) {
      const saved = localStorage.getItem(TOKEN_KEY)
      if (saved) {
        setToken(saved)
      }
    }
  }, [])
}

/** 토큰 저장 */
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  setToken(token)
}

/** 저장된 토큰 조회 */
export function getSavedToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}