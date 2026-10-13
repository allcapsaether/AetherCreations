import Link from 'next/link'
import { getSession } from '@/lib/data'
import { HeaderNav } from '@/components/header-nav'
import { Logo } from '@/components/logo'

export async function SiteHeader() {
  const session = await getSession()
  const user = session?.user
    ? {
        name:
          (session.user as { displayUsername?: string | null }).displayUsername ??
          session.user.name,
      }
    : null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" aria-label="NOIRFORGE home">
          <Logo />
        </Link>
        <HeaderNav user={user} />
      </div>
    </header>
  )
}
