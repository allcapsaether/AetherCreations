'use server'

import { and, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { getSession } from '@/lib/data'

const MAX_QUANTITY = 10

async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

function isValidId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

export async function addToCart(productId: number) {
  const session = await getSession()
  if (!session?.user) return { ok: false as const, reason: 'auth' as const }
  if (!isValidId(productId)) return { ok: false as const, reason: 'invalid' as const }

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1)
  if (!product) return { ok: false as const, reason: 'invalid' as const }

  await db
    .insert(cartItems)
    .values({ userId: session.user.id, productId, quantity: 1 })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.productId],
      set: { quantity: sql`LEAST(${cartItems.quantity} + 1, ${MAX_QUANTITY})` },
    })

  revalidatePath('/cart')
  return { ok: true as const }
}

export async function updateCartQuantity(itemId: number, quantity: number) {
  const userId = await getUserId()
  if (!isValidId(itemId) || !Number.isInteger(quantity)) return

  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
  } else {
    await db
      .update(cartItems)
      .set({ quantity: Math.min(quantity, MAX_QUANTITY) })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
  }
  revalidatePath('/cart')
}

export async function removeFromCart(itemId: number) {
  const userId = await getUserId()
  if (!isValidId(itemId)) return
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, userId)))
  revalidatePath('/cart')
}
