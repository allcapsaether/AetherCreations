'use client'

import { useActionState, useState } from 'react'
import { savePayment, type FormState } from '@/app/actions/account'
import { FormField, inputClass } from '@/components/form-field'
import { FormStatus, SubmitButton } from '@/components/account/form-bits'
import type { UserProfile } from '@/lib/db/schema'

const PAYMENT_TYPES = ['Credit card', 'Debit card', 'PayPal', 'Bank transfer']

export function PaymentForm({ profile }: { profile: UserProfile | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePayment, {
    status: 'idle',
  })
  const [type, setType] = useState(profile?.paymentType ?? 'Credit card')
  const isCard = type.endsWith('card')

  return (
    <div className="mt-6 flex flex-col gap-6">
      {profile?.paymentType && (
        <div className="flex items-center justify-between border border-border p-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">On file</p>
            <p className="mt-1 text-sm">
              {profile.paymentType}
              {profile.cardLast4 && ` ending in ${profile.cardLast4}`}
            </p>
          </div>
          {profile.cardExpiry && (
            <p className="text-xs text-muted-foreground tabular-nums">Exp {profile.cardExpiry}</p>
          )}
        </div>
      )}

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="paymentType" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Method
          </label>
          <select
            id="paymentType"
            name="paymentType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${inputClass} bg-background`}
          >
            {PAYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {isCard && (
          <>
            <FormField label="Cardholder name" name="cardholderName" autoComplete="cc-name" required defaultValue={profile?.cardholderName ?? ''} />
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <FormField
                  label="Last 4 digits"
                  name="cardLast4"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  placeholder="4242"
                  defaultValue={profile?.cardLast4 ?? ''}
                />
              </div>
              <div className="flex-1">
                <FormField
                  label="Expiry (MM/YY)"
                  name="cardExpiry"
                  autoComplete="cc-exp"
                  maxLength={5}
                  required
                  placeholder="08/29"
                  defaultValue={profile?.cardExpiry ?? ''}
                />
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              For your security we only store a reference to your card, never the full number.
            </p>
          </>
        )}

        <FormStatus state={state} />
        <SubmitButton pending={pending}>Save payment method</SubmitButton>
      </form>
    </div>
  )
}
