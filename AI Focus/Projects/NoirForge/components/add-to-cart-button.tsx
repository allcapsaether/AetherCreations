'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { addToCart } from '@/app/actions/cart'

export function AddToCartButton({ productId }: { productId: number }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await addToCart(productId)
      if (result.ok) {
        setAdded(true)
        router.refresh()
      } else if (result.reason === 'auth') {
        router.push('/sign-in')
      } else {
        setError('This item could not be added. Please try again.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="bg-foreground px-6 py-4 text-xs uppercase tracking-[0.3em] text-background transition-colors hover:bg-luxe hover:text-luxe-foreground disabled:opacity-60"
      >
        {pending ? 'Adding…' : 'Add to cart'}
      </button>
      <p aria-live="polite" className="min-h-5 text-sm">
        {added && (
          <span className="text-muted-foreground">
            {'Added to your cart. '}
            <Link href="/cart" className="text-foreground underline underline-offset-4">
              View cart
            </Link>
          </span>
        )}
        {error && <span className="text-destructive">{error}</span>}
      </p>
    </div>
  )
}
