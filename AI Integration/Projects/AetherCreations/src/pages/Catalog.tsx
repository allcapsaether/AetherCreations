import ProductCard from '../components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

type Props = {
  kind: 'systems' | 'parts';
};

export default function Catalog({ kind }: Props) {
  const { products, loading, error } = useProducts(kind);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading catalog from database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-400">
        {error}. Please verify the database is connected.
      </div>
    );
  }

  return (
    <div className="catalog-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}