async function handleCheckout(cartItems: { id: number; quantity: number }[]) {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: 'Customer Name',
          street: '123 Tech Way',
          city: 'San Francisco',
          state: 'CA',
          zip: '94107',
        },
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Order #${data.orderId} placed successfully! Total: $${data.totalAmount}`);
      // Clear cart and navigate to account/orders page
    } else {
      alert(`Checkout error: ${data.error}`);
    }
  } catch (err) {
    alert('Network error connecting to database server.');
  }
}