import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { getProductBySlug } from '@/lib/data'
import { formatPrice } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Not found' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const backHref = product.category === 'prebuilt' ? '/prebuilt' : '/parts'
  const backLabel = product.category === 'prebuilt' ? 'Prebuilt PC' : 'Computer Parts'

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-black lg:w-3/5">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 lg:w-2/5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {product.type}
            </p>
            <h1 className="mt-2 font-serif text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl tabular-nums">{formatPrice(product.price)}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <dl className="flex flex-col border-t border-border">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-border py-3 text-sm">
                <dt className="text-muted-foreground">{key}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}
