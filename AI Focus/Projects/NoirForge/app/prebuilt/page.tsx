import type { Metadata } from 'next'
import { PageHeading } from '@/components/page-heading'
import { ProductCard } from '@/components/product-card'
import { ProductCarousel } from '@/components/product-carousel'
import { getFeaturedProducts, getProductsByCategory } from '@/lib/data'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Prebuilt PCs',
  description: 'Hand-assembled luxury prebuilt gaming desktops, workstations and compact systems.',
}

export default async function PrebuiltPage() {
  const [featured, all] = await Promise.all([
    getFeaturedProducts('prebuilt'),
    getProductsByCategory('prebuilt'),
  ])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-16 md:px-8">
      <PageHeading
        eyebrow="Prebuilt PC"
        title="The Prebuilt Collection"
        description="Turnkey systems, hand-assembled and stress-tested in our atelier. Unbox, plug in, and perform."
      />

      <ProductCarousel
        label="Highlighted prebuilt PCs"
        highlight
        items={featured.map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          type: p.type,
          image: p.image,
          price: formatPrice(p.price),
        }))}
      />

      <section aria-labelledby="all-prebuilt">
        <h2 id="all-prebuilt" className="mb-8 font-serif text-2xl">
          All systems
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((product) => (
            <li key={product.id} className="flex">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
