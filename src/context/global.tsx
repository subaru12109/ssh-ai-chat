import type { ReactNode } from 'react'
import type { Locale } from '@/i18n/runtime.js'
import { createContext, use, useMemo } from 'react'

export type User = Record<string, string>
export type Env = Record<string, string>

interface GlobalContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  user: User
  env: Env
  navigate: (path: string) => void
  isInputFocused: boolean
  focusInput: () => void
  path: string
  dimensions: {
    columns: number
    rows: number
  }
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

interface GlobalProviderProps extends GlobalContextType {
  children: ReactNode
}

export function GlobalProvider({ locale, setLocale, navigate, user, env, path, dimensions, isInputFocused, focusInput, children }: GlobalProviderProps) {
  const value = useMemo(() => ({ locale, setLocale, navigate, user, env, path, dimensions, isInputFocused, focusInput }), [locale, setLocale, navigate, user, env, path, dimensions, isInputFocused, focusInput])
  return (
    <GlobalContext value={value}>
      {children}
    </GlobalContext>
  )
}

export function useGlobal() {
  const context = use(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider')
  }
  return context
}
