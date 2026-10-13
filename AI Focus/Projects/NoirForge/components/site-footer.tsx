import Link from 'next/link'
import { Logo } from '@/components/logo'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/prebuilt', label: 'Prebuilt PC' },
  { href: '/parts', label: 'Computer Parts' },
  { href: '/cart', label: 'Cart' },
  { href: '/account', label: 'Account' },
  { href: '/sign-up', label: 'Sign up' },
  { href: '/sign-in', label: 'Sign in' },
]

const socials = [
  { href: 'https://instagram.com', label: 'Instagram', handle: '@noirforge' },
  { href: 'https://x.com', label: 'X (Twitter)', handle: '@noirforge' },
  { href: 'https://youtube.com', label: 'YouTube', handle: 'NOIRFORGE Builds' },
  { href: 'https://discord.com', label: 'Discord', handle: 'NOIRFORGE Society' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-3 md:px-8">
        <section aria-labelledby="footer-company">
          <h2 id="footer-company" className="sr-only">
            Company details
          </h2>
          <Logo />
          <address className="mt-6 flex flex-col gap-1 text-sm not-italic leading-relaxed text-muted-foreground">
            <span>NOIRFORGE Systems Ltd.</span>
            <span>88 Atelier Row, Suite 12</span>
            <span>Los Angeles, CA 90013</span>
            <a href="mailto:concierge@noirforge.com" className="mt-3 hover:text-foreground">
              concierge@noirforge.com
            </a>
            <a href="tel:+18005550199" className="hover:text-foreground">
              +1 (800) 555-0199
            </a>
          </address>
        </section>

        <nav aria-labelledby="footer-links">
          <h2
            id="footer-links"
            className="text-xs uppercase tracking-[0.25em] text-foreground"
          >
            Navigate
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-social">
          <h2
            id="footer-social"
            className="text-xs uppercase tracking-[0.25em] text-foreground"
          >
            Follow
          </h2>
          <ul className="mt-6 flex flex-col gap-3 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-border pb-3 text-muted-foreground hover:text-foreground"
                >
                  <span>{s.label}</span>
                  <span className="text-xs group-hover:text-luxe">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs tracking-wider text-muted-foreground md:px-8">
          {'© 2026 NOIRFORGE Systems Ltd. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}
