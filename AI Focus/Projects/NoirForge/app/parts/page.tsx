import type { Metadata } from 'next'
import { PageHeading } from '@/components/page-heading'
import { ProductCard } from '@/components/product-card'
import { getProductsByCategory } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Computer Parts',
  description: 'Premium graphics cards, processors, memory, storage, cooling and cases.',
}

export default async function PartsPage() {
  const parts = await getProductsByCategory('part')

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 md:px-8">
      <PageHeading
        eyebrow="Computer Parts"
        title="Premium Components"
        description="The same top-tier hardware we trust in our own builds, available for yours."
      />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {parts.map((product) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
