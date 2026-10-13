import { and, asc, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItems, products, userProfiles } from '@/lib/db/schema'

export const BRAND = 'NOIRFORGE'

export type Category = 'prebuilt' | 'part'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getProductsByCategory(category: Category) {
  return db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .orderBy(desc(products.featured), asc(products.id))
}

export async function getFeaturedProducts(category: Category) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.category, category), eq(products.featured, true)))
    .orderBy(asc(products.id))
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
  return product ?? null
}

export async function getCart(userId: string) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(asc(cartItems.createdAt))
}

export async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1)
  return profile ?? null
}
