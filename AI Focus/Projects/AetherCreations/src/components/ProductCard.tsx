import type { Product } from "../data";
import { formatPrice } from "../lib";
import { useCart } from "../state/cart";
import { useToast } from "../state/toast";
import Photo from "./Photo";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { notify } = useToast();

  const addToCart = () => {
    add(product);
    notify(`${product.name} added to cart.`, { label: "View cart", route: "cart" });
  };

  return (
    <article className="card">
      <div className="card__media">
        {product.label && <span className="tag">{product.label}</span>}
        <Photo
          photo={product.photo}
          alt={`${product.name}, ${product.type}`}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <div className="card__body">
        <div>
          <h3 className="card__name">{product.name}</h3>
          <p className="card__type">{product.type}</p>
        </div>
        <p className="card__price">{formatPrice(product.price)}</p>
      </div>
      <button type="button" className="btn btn--outline btn--block" onClick={addToCart} aria-label={`Add ${product.name} to cart`}>
        Add to cart
      </button>
    </article>
  );
}
