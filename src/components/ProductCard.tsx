import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Bottle } from './Bottle';
import { useStore, useT } from '../store/StoreContext';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  dimmed?: boolean;
}

export function ProductCard({ product, dimmed = false }: ProductCardProps) {
  const { moods, addToCart } = useStore();
  const { t, pick, language } = useT();
  const mood = moods.find((m) => m.id === product.moodId);
  const color = mood?.color ?? '#d8b98a';

  return (
    <article className={`product-card ${dimmed ? 'is-dimmed' : ''}`} style={{ '--card-glow': color } as React.CSSProperties}>
      <Link to={`/product/${product.id}`} className="product-image-link" aria-label={product.name}>
        <Bottle color={color} name={product.name} size={product.sizeMl} miniature />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </Link>
      <div className="product-card-body">
        <span className="mood-label" style={{ color }}>
          <i style={{ background: color }} />
          {language === 'bn' ? mood?.nameBn : mood?.name}
        </span>
        <Link to={`/product/${product.id}`} className="product-title">
          {pick(product.name, product.nameBn)}
        </Link>
        <div className="product-meta">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-size">{product.sizeMl} ml</span>
        </div>
        <button
          className="add-small"
          onClick={() => addToCart(product.id)}
          disabled={product.stock <= 0}
          aria-label={`${t('product.addToCart')}: ${product.name}`}
        >
          <Plus size={16} /> {product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
        </button>
      </div>
    </article>
  );
}
