'use client'

import { useActionState } from 'react'
import { saveShipping, type FormState } from '@/app/actions/account'
import { FormField } from '@/components/form-field'
import { FormStatus, SubmitButton } from '@/components/account/form-bits'
import type { UserProfile } from '@/lib/db/schema'

export function ShippingForm({ profile }: { profile: UserProfile | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveShipping, {
    status: 'idle',
  })

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <FormField label="Full name" name="fullName" autoComplete="name" required defaultValue={profile?.fullName ?? ''} />
      <FormField label="Address line 1" name="addressLine1" autoComplete="address-line1" required defaultValue={profile?.addressLine1 ?? ''} />
      <FormField label="Address line 2 (optional)" name="addressLine2" autoComplete="address-line2" defaultValue={profile?.addressLine2 ?? ''} />
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <FormField label="City" name="city" autoComplete="address-level2" required defaultValue={profile?.city ?? ''} />
        </div>
        <div className="flex-1">
          <FormField label="State / Region" name="region" autoComplete="address-level1" defaultValue={profile?.region ?? ''} />
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <FormField label="Postal code" name="postalCode" autoComplete="postal-code" defaultValue={profile?.postalCode ?? ''} />
        </div>
        <div className="flex-1">
          <FormField label="Country" name="country" autoComplete="country-name" required defaultValue={profile?.country ?? ''} />
        </div>
      </div>
      <FormStatus state={state} />
      <SubmitButton pending={pending}>Save address</SubmitButton>
    </form>
  )
}
