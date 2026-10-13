import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageHeading } from '@/components/page-heading'
import { PaymentForm } from '@/components/account/payment-form'
import { ShippingForm } from '@/components/account/shipping-form'
import { getProfile, getSession } from '@/lib/data'

export const metadata: Metadata = { title: 'Account' }

export default async function AccountPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const profile = await getProfile(session.user.id)
  const username =
    (session.user as { displayUsername?: string | null }).displayUsername ?? session.user.name

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 md:px-8">
      <PageHeading eyebrow="Account" title={`Welcome, ${username}`} />

      <section aria-labelledby="email-heading" className="border border-border bg-card p-6 md:p-8">
        <h2 id="email-heading" className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Email address
        </h2>
        <p className="mt-3 font-serif text-2xl break-all">{session.user.email}</p>
      </section>

      <div className="flex flex-col gap-6 lg:flex-row">
        <section aria-labelledby="shipping-heading" className="flex-1 border border-border bg-card p-6 md:p-8">
          <h2 id="shipping-heading" className="font-serif text-2xl">
            Shipping address
          </h2>
          <ShippingForm profile={profile} />
        </section>
        <section aria-labelledby="payment-heading" className="flex-1 border border-border bg-card p-6 md:p-8">
          <h2 id="payment-heading" className="font-serif text-2xl">
            Payment method
          </h2>
          <PaymentForm profile={profile} />
        </section>
      </div>
    </div>
  )
}
