import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  type: text('type').notNull(),
  price: integer('price').notNull(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  specs: jsonb('specs').$type<Record<string, string>>().notNull(),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const cartItems = pgTable(
  'cart_items',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    productId: integer('productId').notNull(),
    quantity: integer('quantity').notNull().default(1),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => [unique('cart_items_userId_productId_key').on(t.userId, t.productId)],
)

export const userProfiles = pgTable('user_profiles', {
  userId: text('userId').primaryKey(),
  fullName: text('fullName'),
  addressLine1: text('addressLine1'),
  addressLine2: text('addressLine2'),
  city: text('city'),
  region: text('region'),
  postalCode: text('postalCode'),
  country: text('country'),
  paymentType: text('paymentType'),
  cardholderName: text('cardholderName'),
  cardLast4: text('cardLast4'),
  cardExpiry: text('cardExpiry'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Product = typeof products.$inferSelect
export type UserProfile = typeof userProfiles.$inferSelect
