'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Verificar si hay un usuario hardcodeado guardado
    const hardcodedUserData = localStorage.getItem('hardcoded_user')
    if (hardcodedUserData) {
      try {
        const mockUser = JSON.parse(hardcodedUserData) as User
        setUser(mockUser)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('hardcoded_user')
      }
    }

    // Obtener sesión inicial de Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    // Usuario hardcodeado
    const HARDCODED_USER = {
      email: 'manuel.ramon@iddeass.com',
      password: '123456'
    }

    // Si las credenciales coinciden con el usuario hardcodeado
    if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
      // Crear un objeto de usuario simulado compatible con Supabase User
      const mockUser = {
        id: 'hardcoded-user-id',
        email: HARDCODED_USER.email,
        app_metadata: {},
        user_metadata: { full_name: 'Manuel Ramón' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User

      // Guardar en localStorage para persistencia
      localStorage.setItem('hardcoded_user', JSON.stringify(mockUser))
      setUser(mockUser)
      setLoading(false)

      return { error: null }
    }

    // Si no es el usuario hardcodeado, intentar con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    // Limpiar usuario hardcodeado si existe
    localStorage.removeItem('hardcoded_user')
    setUser(null)
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
