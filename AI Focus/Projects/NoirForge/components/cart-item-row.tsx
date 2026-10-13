'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTransition } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { removeFromCart, updateCartQuantity } from '@/app/actions/cart'
import { cn } from '@/lib/utils'

type CartItemRowProps = {
  id: number
  quantity: number
  name: string
  slug: string
  type: string
  image: string
  unitPrice: string
  lineTotal: string
}

export function CartItemRow({
  id,
  quantity,
  name,
  slug,
  type,
  image,
  unitPrice,
  lineTotal,
}: CartItemRowProps) {
  const [pending, startTransition] = useTransition()

  return (
    <li
      className={cn(
        'flex items-center gap-4 border-b border-border py-5 transition-opacity',
        pending && 'opacity-50',
      )}
    >
      <Link href={`/products/${slug}`} className="relative size-20 shrink-0 overflow-hidden bg-black">
        <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/products/${slug}`} className="truncate font-serif text-lg hover:underline">
          {name}
        </Link>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{type}</p>
        <p className="text-xs text-muted-foreground tabular-nums">{unitPrice} each</p>
      </div>
      <div className="flex items-center border border-border">
        <button
          type="button"
          aria-label={`Decrease quantity of ${name}`}
          disabled={pending}
          onClick={() => startTransition(() => updateCartQuantity(id, quantity - 1))}
          className="flex size-8 items-center justify-center hover:bg-accent"
        >
          <Minus className="size-3" />
        </button>
        <span className="w-8 text-center text-sm tabular-nums" aria-label={`Quantity ${quantity}`}>
          {quantity}
        </span>
        <button
          type="button"
          aria-label={`Increase quantity of ${name}`}
          disabled={pending || quantity >= 10}
          onClick={() => startTransition(() => updateCartQuantity(id, quantity + 1))}
          className="flex size-8 items-center justify-center hover:bg-accent disabled:opacity-40"
        >
          <Plus className="size-3" />
        </button>
      </div>
      <p className="hidden w-28 text-right text-sm tabular-nums sm:block">{lineTotal}</p>
      <button
        type="button"
        aria-label={`Remove ${name} from cart`}
        disabled={pending}
        onClick={() => startTransition(() => removeFromCart(id))}
        className="flex size-8 items-center justify-center text-muted-foreground hover:text-luxe"
      >
        <X className="size-4" />
      </button>
    </li>
  )
}
