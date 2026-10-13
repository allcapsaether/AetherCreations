'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { authClient } from '@/lib/auth-client'
import { FormField } from '@/components/form-field'

type AuthFormProps = { mode: 'sign-in' | 'sign-up'; googleEnabled: boolean }

export function AuthForm({ mode, googleEnabled }: AuthFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const username = String(form.get('username') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const result = isSignUp
      ? await authClient.signUp.email({ email, password, name: username, username })
      : await authClient.signIn.email({ email, password })

    if (result.error) {
      setLoading(false)
      setError(
        isSignUp
          ? 'We could not create your account. Try a different username or email.'
          : 'Those credentials do not match our records.',
      )
      return
    }

    if (!isSignUp && username) {
      const signedInUsername = (result.data?.user as { username?: string | null } | undefined)?.username
      if (signedInUsername && signedInUsername.toLowerCase() !== username.toLowerCase()) {
        await authClient.signOut()
        setLoading(false)
        setError('Those credentials do not match our records.')
        return
      }
    }

    router.push('/account')
    router.refresh()
  }

  async function handleGoogle() {
    setError(null)
    const { error } = await authClient.signIn.social({ provider: 'google', callbackURL: '/account' })
    if (error) setError('Google sign-in is unavailable right now.')
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8 border border-border bg-card p-8 md:p-10">
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
          <span className="h-px w-8 bg-luxe" aria-hidden="true" />
          {isSignUp ? 'Join the atelier' : 'Welcome back'}
        </p>
        <h1 className="font-serif text-4xl">{isSignUp ? 'Sign up' : 'Sign in'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Username"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z0-9_.]+"
          title="Letters, numbers, underscores and periods only"
        />
        <FormField label="Email address" name="email" type="email" autoComplete="email" required />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          minLength={8}
        />
        <p aria-live="polite" className="min-h-5 text-sm text-destructive">
          {error}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="bg-foreground px-6 py-3.5 text-xs uppercase tracking-[0.3em] text-background transition-colors hover:bg-luxe hover:text-luxe-foreground disabled:opacity-60"
        >
          {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={!googleEnabled}
          className="flex items-center justify-center gap-3 border border-border px-6 py-3.5 text-sm transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
          </svg>
          Continue with Google
        </button>
        {!googleEnabled && (
          <p className="text-center text-xs text-muted-foreground">Google sign-in is not configured yet.</p>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account? ' : 'New to NOIRFORGE? '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="text-foreground underline underline-offset-4 hover:text-luxe"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}
