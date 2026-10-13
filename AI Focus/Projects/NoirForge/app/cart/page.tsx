import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CartItemRow } from '@/components/cart-item-row'
import { PageHeading } from '@/components/page-heading'
import { getCart, getSession } from '@/lib/data'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = { title: 'Cart' }

export default async function CartPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const items = await getCart(session.user.id)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 md:px-8">
      <PageHeading eyebrow="Cart" title="Your Cart" />

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-6 border-t border-border pt-10">
          <p className="text-muted-foreground">Cart is currently empty.</p>
          <Link
            href="/prebuilt"
            className="border border-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col border-t border-border">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                id={item.id}
                quantity={item.quantity}
                name={item.product.name}
                slug={item.product.slug}
                type={item.product.type}
                image={item.product.image}
                unitPrice={formatPrice(item.product.price)}
                lineTotal={formatPrice(item.product.price * item.quantity)}
              />
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-foreground pt-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Subtotal</p>
            <p className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</p>
          </div>
        </>
      )}
    </div>
  )
}
