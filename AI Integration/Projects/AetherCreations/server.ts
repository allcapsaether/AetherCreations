import express from 'express';
import { query } from './src/db/index.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ----------------------------------------------------
// 1. GET ALL PRODUCTS (or filter by ?category=systems / ?category=parts)
// ----------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM products';
    const params: any[] = [];

    if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }
    sql += ' ORDER BY id ASC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// ----------------------------------------------------
// 2. GET SINGLE PRODUCT BY ID
// ----------------------------------------------------
app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// ----------------------------------------------------
// 3. POST ORDER (CHECKOUT)
// Saves order and line items inside a single SQL transaction
// ----------------------------------------------------
app.post('/api/orders', async (req, res) => {
  const { items, shippingAddress, email } = req.body;
  // items format: [{ productId: 1, quantity: 2 }, ...]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Start SQL Transaction
    await query('BEGIN');

    // Calculate subtotal securely from actual database prices (prevents price tampering)
    let subtotal = 0;
    const validatedItems: { product: any; quantity: number }[] = [];

    for (const item of items) {
      const prodRes = await query('SELECT * FROM products WHERE id = $1', [item.productId]);
      if (prodRes.rows.length === 0) {
        throw new Error(`Product ${item.productId} does not exist`);
      }
      const product = prodRes.rows[0];
      subtotal += product.price * item.quantity;
      validatedItems.push({ product, quantity: item.quantity });
    }

    const shippingCost = 0; // Free white-glove shipping
    const totalAmount = subtotal + shippingCost;

    // Insert into orders table
    const orderInsert = await query(
      `INSERT INTO orders (subtotal, shipping_cost, total_amount, shipping_address)
       VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
      [subtotal, shippingCost, totalAmount, JSON.stringify(shippingAddress || {})]
    );

    const orderId = orderInsert.rows[0].id;

    // Insert line items
    for (const line of validatedItems) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, line.product.id, line.quantity, line.product.price]
      );

      // Decrement product stock
      await query(
        `UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2`,
        [line.quantity, line.product.id]
      );
    }

    // Commit Transaction
    await query('COMMIT');

    res.status(201).json({
      success: true,
      orderId,
      totalAmount,
      itemsCount: validatedItems.length,
    });
  } catch (error: any) {
    // Rollback if any step fails
    await query('ROLLBACK');
    console.error('Checkout failed:', error);
    res.status(500).json({ error: error.message || 'Failed to place order' });
  }
});

// ----------------------------------------------------
// 4. GET ORDER HISTORY
// ----------------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    const ordersRes = await query(`
      SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.created_at,
        json_agg(
          json_build_object(
            'productId', p.id,
            'name', p.name,
            'price', oi.unit_price,
            'quantity', oi.quantity,
            'photo', p.photo
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 20
    `);

    res.json(ordersRes.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

export default app;