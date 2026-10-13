import { ArrowRight, Minus, Plus } from "../components/Icons";
import Mark from "../components/Mark";
import Photo from "../components/Photo";
import { formatPrice } from "../lib";
import { href } from "../router";
import { MAX_QTY, useCart } from "../state/cart";
import { useToast } from "../state/toast";

export default function Cart() {
  const { lines, count, subtotal, setQty, remove } = useCart();
  const { notify } = useToast();

  return (
    <section className="container page-top">
      <h1 className="page-title">
        Cart{count > 0 && <span className="page-title__count"> ({count})</span>}
      </h1>

      {lines.length === 0 ? (
        <div className="empty">
          <Mark />
          <h2>Your cart is empty.</h2>
          <p>Start with a complete system, or pick individual components for your own build.</p>
          <div className="empty__actions">
            <a className="btn btn--lg" href={href("systems")}>Browse systems</a>
            <a className="btn btn--outline btn--lg" href={href("parts")}>Browse parts</a>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {lines.map(({ product, qty }) => (
              <li className="cart-item" key={product.id}>
                <div className="cart-item__media">
                  <Photo photo={product.photo} alt="" widths={[240, 400]} sizes="120px" />
                </div>
                <div className="cart-item__info">
                  <h2>{product.name}</h2>
                  <p>{product.type}</p>
                  <div className="stepper" role="group" aria-label={`Quantity of ${product.name}`}>
                    <button type="button" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQty(product.id, qty - 1)}>
                      <Minus />
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${product.name}`}
                      disabled={qty >= MAX_QTY}
                      onClick={() => setQty(product.id, qty + 1)}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
                <div className="cart-item__side">
                  <strong>{formatPrice(product.price * qty)}</strong>
                  <button type="button" className="text-button" onClick={() => remove(product.id)} aria-label={`Remove ${product.name} from cart`}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div><dt>Insured shipping</dt><dd>At checkout</dd></div>
              <div className="summary__total"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
            </dl>
            <button
              type="button"
              className="btn btn--lg btn--block"
              // TODO: connect to your payment provider.
              onClick={() => notify("Checkout isn't connected yet.")}
            >
              Check out <ArrowRight />
            </button>
            <p className="summary__note">Complimentary insured shipping on systems.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
