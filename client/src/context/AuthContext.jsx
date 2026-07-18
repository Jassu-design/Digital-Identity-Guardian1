import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../api/authApi.js'

export const AuthContext = createContext(null)

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user')

    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(getStoredUser)
  const [isLoading, setIsLoading] = useState(true)

  const saveAuthentication = useCallback(
    ({token, user: authenticatedUser}) => {
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify(authenticatedUser),
      )

      setUser(authenticatedUser)
    },
    [],
  )

  const clearAuthentication = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const login = useCallback(
    async credentials => {
      const response = await loginUser(credentials)

      saveAuthentication({
        token: response.token,
        user: response.data.user,
      })

      return response.data.user
    },
    [saveAuthentication],
  )

  const register = useCallback(
    async userData => {
      const response = await registerUser(userData)

      saveAuthentication({
        token: response.token,
        user: response.data.user,
      })

      return response.data.user
    },
    [saveAuthentication],
  )

  const logout = useCallback(() => {
    clearAuthentication()
  }, [clearAuthentication])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const response = await getCurrentUser()
      const currentUser = response.data.user

      localStorage.setItem(
        'user',
        JSON.stringify(currentUser),
      )

      setUser(currentUser)
    } catch {
      clearAuthentication()
    } finally {
      setIsLoading(false)
    }
  }, [clearAuthentication])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}