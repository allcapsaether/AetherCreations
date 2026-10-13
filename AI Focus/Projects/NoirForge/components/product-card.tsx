import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/db/schema'
import { formatPrice } from '@/lib/format'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col border border-border bg-card transition-colors hover:border-foreground/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl">{product.name}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {product.type}
            </p>
          </div>
          <p className="text-sm tabular-nums">{formatPrice(product.price)}</p>
        </div>
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="flex items-center justify-between border-t border-border px-5 py-3 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        View more
        <span className="sr-only"> about {product.name}</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:text-luxe" aria-hidden="true" />
      </Link>
    </article>
  )
}
