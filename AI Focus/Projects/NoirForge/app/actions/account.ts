'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { getSession } from '@/lib/data'

export type FormState = { status: 'idle' | 'success' | 'error'; message?: string }

const PAYMENT_TYPES = ['Credit card', 'Debit card', 'PayPal', 'Bank transfer']

function field(formData: FormData, name: string, max = 120) {
  const value = String(formData.get(name) ?? '').trim()
  return value.length > 0 ? value.slice(0, max) : null
}

async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveShipping(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getUserId()
  const values = {
    fullName: field(formData, 'fullName'),
    addressLine1: field(formData, 'addressLine1'),
    addressLine2: field(formData, 'addressLine2'),
    city: field(formData, 'city', 80),
    region: field(formData, 'region', 80),
    postalCode: field(formData, 'postalCode', 20),
    country: field(formData, 'country', 80),
  }
  if (!values.fullName || !values.addressLine1 || !values.city || !values.country) {
    return { status: 'error', message: 'Please complete the required fields.' }
  }

  await db
    .insert(userProfiles)
    .values({ userId, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...values, updatedAt: new Date() },
    })
  revalidatePath('/account')
  return { status: 'success', message: 'Shipping address saved.' }
}

export async function savePayment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const userId = await getUserId()
  const paymentType = field(formData, 'paymentType', 40)
  if (!paymentType || !PAYMENT_TYPES.includes(paymentType)) {
    return { status: 'error', message: 'Choose a payment method.' }
  }

  const isCard = paymentType.endsWith('card')
  const cardholderName = isCard ? field(formData, 'cardholderName') : null
  const cardLast4 = isCard ? field(formData, 'cardLast4', 4) : null
  const cardExpiry = isCard ? field(formData, 'cardExpiry', 5) : null

  if (isCard) {
    if (!cardholderName) return { status: 'error', message: 'Enter the cardholder name.' }
    if (!cardLast4 || !/^\d{4}$/.test(cardLast4)) {
      return { status: 'error', message: 'Enter the last 4 digits of your card.' }
    }
    if (!cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      return { status: 'error', message: 'Expiry must be in MM/YY format.' }
    }
  }

  const values = { paymentType, cardholderName, cardLast4, cardExpiry }
  await db
    .insert(userProfiles)
    .values({ userId, ...values, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...values, updatedAt: new Date() },
    })
  revalidatePath('/account')
  return { status: 'success', message: 'Payment method saved.' }
}
