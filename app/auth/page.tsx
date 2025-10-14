'use client'

import { useState } from 'react'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import ForgotPasswordForm from '@/components/ForgotPasswordForm'

type AuthView = 'login' | 'register' | 'forgot-password'

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('login')

  return (
    <>
      {view === 'login' && (
        <LoginForm
          onSwitchToRegister={() => setView('register')}
          onSwitchToForgotPassword={() => setView('forgot-password')}
        />
      )}
      {view === 'register' && <RegisterForm onSwitchToLogin={() => setView('login')} />}
      {view === 'forgot-password' && <ForgotPasswordForm onSwitchToLogin={() => setView('login')} />}
    </>
  )
}
