import { createContext } from 'react'

export const AuthContext = createContext<{
  user: any
  setUser: (user: any) => void
}>({ user: null, setUser: () => {} })
