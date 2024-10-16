// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (!(auth?.user?.role === 'guest') && !auth.user && !window.localStorage.getItem('userData')) {
        if (!['/login', '/register'].includes(router.asPath)) auth.setUser({
          id: 0,
          role: 'guest',
          password: 'guest',
          fullName: 'guest',
          username: 'guest',
          email: '',
          token: ''
        })
      } else {
        // auth.setUser(window.localStorage.getItem('userData') as any)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (auth.loading && auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
