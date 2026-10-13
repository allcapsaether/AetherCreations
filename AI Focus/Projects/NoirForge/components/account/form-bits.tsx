import type { ReactNode } from 'react'
import type { FormState } from '@/app/actions/account'

export function FormStatus({ state }: { state: FormState }) {
  return (
    <p
      aria-live="polite"
      className={state.status === 'error' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}
    >
      {state.message}
    </p>
  )
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start bg-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-luxe hover:text-luxe-foreground disabled:opacity-60"
    >
      {pending ? 'Saving…' : children}
    </button>
  )
}
