import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Bottle } from '../components/Bottle';
import { ProductCard } from '../components/ProductCard';
import { useStore, useT } from '../store/StoreContext';
import { formatPrice } from '../lib/utils';

export function ProductDetail() {
  const { id } = useParams();
  const { products, moods, addToCart, cartOpen, setCartOpen } = useStore();
  const { t, pick, language } = useT();
  const [qty, setQty] = useState(1);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="page-shell shell empty-state">
        <p>Perfume not found.</p>
        <Link to="/collection" className="btn btn-outline">{t('collection.title')}</Link>
      </div>
    );
  }

  const mood = moods.find((m) => m.id === product.moodId);
  const color = mood?.color ?? '#d8b98a';
  const related = products.filter((p) => p.id !== product.id && p.moodId === product.moodId).slice(0, 4);
  const fallbackRelated = related.length ? related : products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="page-shell product-page">
      <div className="shell">
        <Link to="/collection" className="back-link"><ArrowLeft size={15} /> {t('collection.title')}</Link>
        <div className="product-detail-grid">
          <div className="product-detail-visual" style={{ '--card-glow': color } as React.CSSProperties}>
            <div className="detail-halo" />
            <Bottle color={color} name={product.name} size={product.sizeMl} />
            <span className="detail-mood" style={{ color }}><i style={{ background: color }} /> {language === 'bn' ? mood?.nameBn : mood?.name}</span>
          </div>

          <div className="product-detail-info">
            <span className="eyebrow">Scentology BD · {product.sizeMl} ml EDP</span>
            <h1 className="detail-title">{pick(product.name, product.nameBn)}</h1>
            <div className="detail-price">{formatPrice(product.price)}</div>
            <p className="detail-description">{pick(product.description, product.descriptionBn)}</p>

            <div className="detail-divider" />
            <div className="detail-size-row">
              <span className="detail-label">{t('product.size')}</span>
              <span className="size-chip is-active">{product.sizeMl} ml</span>
            </div>

            <div className="notes-block">
              <h3>{t('product.notes')}</h3>
              <div className="note-line"><span>{t('product.top')}</span><strong>{product.topNotes}</strong></div>
              <div className="note-line"><span>{t('product.heart')}</span><strong>{product.heartNotes}</strong></div>
              <div className="note-line"><span>{t('product.base')}</span><strong>{product.baseNotes}</strong></div>
            </div>

            <div className="detail-actions">
              <div className="qty-control large">
                <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease"><Minus size={15} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((n) => Math.min(product.stock, n + 1))} aria-label="Increase"><Plus size={15} /></button>
              </div>
              <button
                className="btn btn-gold detail-add"
                disabled={product.stock <= 0}
                onClick={() => { addToCart(product.id, qty); if (cartOpen) setCartOpen(false); }}
              >
                <ShoppingBag size={18} /> {product.stock > 0 ? t('product.addToCart') : t('product.outOfStock')}
              </button>
            </div>
            <p className="detail-stock"><Check size={14} /> {product.stock > 0 ? `${product.stock} in stock · Ships in 1–2 days` : 'Currently out of stock'}</p>
          </div>
        </div>

        <section className="related-section">
          <div className="section-head split-head">
            <h2 className="section-title">{t('product.related')}</h2>
            {mood && <Link to={`/collection?mood=${mood.id}`} className="text-link">{language === 'bn' ? mood.nameBn : mood.name} <ArrowLeft size={14} className="flip" /></Link>}
          </div>
          <div className="product-grid">
            {fallbackRelated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
