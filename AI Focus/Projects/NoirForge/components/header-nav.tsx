'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/prebuilt', label: 'Prebuilt PC' },
  { href: '/parts', label: 'Computer Parts' },
]

type HeaderNavProps = { user: { name: string } | null }

export function HeaderNav({ user }: HeaderNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await authClient.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const linkClass = (href: string) =>
    cn(
      'relative py-1 text-xs uppercase tracking-[0.2em] transition-colors hover:text-foreground',
      isActive(href)
        ? 'text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-luxe'
        : 'text-muted-foreground',
    )

  const links = (
    <>
      {primaryLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClass(link.href)}
          aria-current={isActive(link.href) ? 'page' : undefined}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/cart"
        className={cn(linkClass('/cart'), 'flex items-center gap-2')}
        aria-current={isActive('/cart') ? 'page' : undefined}
        onClick={() => setOpen(false)}
      >
        <ShoppingBag className="size-4" aria-hidden="true" />
        Cart
      </Link>
      <Link
        href="/account"
        className={cn(linkClass('/account'), 'flex items-center gap-2')}
        aria-current={isActive('/account') ? 'page' : undefined}
        onClick={() => setOpen(false)}
      >
        <User className="size-4" aria-hidden="true" />
        Account
      </Link>
    </>
  )

  const authLinks = user ? (
    <button
      type="button"
      onClick={handleSignOut}
      className="border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      Sign out
    </button>
  ) : (
    <>
      <Link
        href="/sign-up"
        onClick={() => setOpen(false)}
        className="px-1 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign up
      </Link>
      <Link
        href="/sign-in"
        onClick={() => setOpen(false)}
        className="bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-luxe hover:text-luxe-foreground"
      >
        Sign in
      </Link>
    </>
  )

  return (
    <>
      <nav aria-label="Main" className="hidden flex-1 items-center justify-between lg:flex">
        <div className="flex items-center gap-8 pl-6">{links}</div>
        <div className="flex items-center gap-4">{authLinks}</div>
      </nav>

      <button
        type="button"
        className="flex size-10 items-center justify-center lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="absolute inset-x-0 top-16 flex flex-col gap-5 border-b border-border bg-background px-4 py-6 lg:hidden"
        >
          {links}
          <div className="flex items-center gap-4 border-t border-border pt-5">{authLinks}</div>
        </nav>
      )}
    </>
  )
}
