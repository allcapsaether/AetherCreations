import Link from 'next/link'
import { ProductCarousel, type CarouselItem } from '@/components/product-carousel'
import { getFeaturedProducts, getProductsByCategory } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import type { Product } from '@/lib/db/schema'

function toCarouselItems(products: Product[]): CarouselItem[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    type: p.type,
    image: p.image,
    price: formatPrice(p.price),
  }))
}

export default async function HomePage() {
  const [prebuilt, parts] = await Promise.all([
    getFeaturedProducts('prebuilt'),
    getProductsByCategory('part'),
  ])

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center md:px-8 md:pt-28">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          <span className="h-px w-8 bg-luxe" aria-hidden="true" />
          Est. 2026
          <span className="h-px w-8 bg-luxe" aria-hidden="true" />
        </p>
        <h1 className="mt-6 font-serif text-5xl tracking-[0.15em] sm:text-7xl md:text-8xl">
          NOIR<span className="text-luxe">F</span>ORGE
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          Precision-built machines for those who refuse to compromise.
        </p>
      </section>

      <section aria-labelledby="prebuilt-heading" className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="prebuilt-heading" className="font-serif text-2xl md:text-3xl">
            Prebuilt Collection
          </h2>
          <Link
            href="/prebuilt"
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <ProductCarousel items={toCarouselItems(prebuilt)} label="Prebuilt PCs" size="lg" />
      </section>

      <section aria-labelledby="about-heading" className="border-y border-border">
        <h2 id="about-heading" className="sr-only">
          About NOIRFORGE
        </h2>
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
          <div className="flex flex-col gap-4 px-4 py-16 md:w-1/2 md:border-r md:border-border md:px-8 md:py-20">
            <p className="text-[10px] uppercase tracking-[0.35em] text-luxe">Our craft</p>
            <h3 className="font-serif text-3xl">Assembled by hand. Tested without mercy.</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every NOIRFORGE system is built by a single technician from start to finish. Cables are
              measured, sleeved and routed by hand, and each machine undergoes 72 hours of thermal and
              stability testing before it leaves our atelier.
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-border px-4 py-16 md:w-1/2 md:border-t-0 md:px-8 md:py-20">
            <p className="text-[10px] uppercase tracking-[0.35em] text-luxe">Our promise</p>
            <h3 className="font-serif text-3xl">Components chosen, never compromised.</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We source only top-tier silicon, premium power delivery and whisper-quiet cooling. Each part
              we sell is one we would put in our own builds, backed by concierge support and a lifetime of
              expert care.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="parts-heading" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 id="parts-heading" className="font-serif text-2xl md:text-3xl">
            Computer Parts
          </h2>
          <Link
            href="/parts"
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <ProductCarousel items={toCarouselItems(parts)} label="Computer parts" />
      </section>
    </>
  )
}
