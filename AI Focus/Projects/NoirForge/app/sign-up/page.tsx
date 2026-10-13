import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { googleEnabled } from '@/lib/auth'
import { getSession } from '@/lib/data'

export const metadata: Metadata = { title: 'Sign up' }

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user) redirect('/account')
  return (
    <div className="flex justify-center px-4 py-20">
      <AuthForm mode="sign-up" googleEnabled={googleEnabled} />
    </div>
  )
}
