import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { parts, prebuilts, STUDIO_EMAIL } from "../data";

type Kind = "systems" | "parts";
type Sort = "featured" | "price-asc" | "price-desc";

const copy: Record<Kind, { title: string; intro: string }> = {
  systems: {
    title: "Prebuilt systems",
    intro: "Balanced, benchmarked, and ready to work. Each system is built by hand in our Portland studio.",
  },
  parts: {
    title: "Computer parts",
    intro: "The same rigorously selected components we trust in every AetherCreations build.",
  },
};

export default function Catalog({ kind }: { kind: Kind }) {
  const [sort, setSort] = useState<Sort>("featured");
  const products = kind === "systems" ? prebuilts : parts;

  const sorted = useMemo(() => {
    if (sort === "featured") return products;
    return [...products].sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));
  }, [products, sort]);

  return (
    <>
      <section className="container page-head">
        <h1>{copy[kind].title}</h1>
        <p>{copy[kind].intro}</p>
      </section>

      <section className="container" aria-label="Products">
        <div className="toolbar">
          <p aria-live="polite">{sorted.length} products</p>
          <label className="toolbar__sort">
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>
        </div>
        <ul className="product-grid">
          {sorted.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container studio-cta-wrap">
        <div className="studio-cta">
          <h2>Need a different configuration? Built around your work.</h2>
          <a className="btn btn--light btn--lg" href={`mailto:${STUDIO_EMAIL}`}>Email the studio</a>
        </div>
      </section>
    </>
  );
}
