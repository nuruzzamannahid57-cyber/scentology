import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { Bottle } from './Bottle';
import { useStore, useT } from '../store/StoreContext';
import { formatPrice } from '../lib/utils';

export function CartDrawer() {
  const { cart, products, moods, cartOpen, setCartOpen, setQty, removeFromCart } = useStore();
  const { t, pick, language } = useT();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCartOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [cartOpen, setCartOpen]);

  const items = cart.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.qty, 0);

  return (
    <>
      <div className={`drawer-backdrop ${cartOpen ? 'is-visible' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'is-open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Scentology BD</span>
            <h2>{t('cart.title')}</h2>
          </div>
          <button className="icon-button" onClick={() => setCartOpen(false)} aria-label={t('common.close')}><X size={20} /></button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={38} strokeWidth={1} />
            <p>{t('cart.empty')}</p>
            <Link to="/collection" className="btn btn-outline" onClick={() => setCartOpen(false)}>{t('cart.continue')}</Link>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => {
                const mood = moods.find((m) => m.id === item.product?.moodId);
                return (
                  <div className="drawer-item" key={item.productId}>
                    <Link to={`/product/${item.productId}`} onClick={() => setCartOpen(false)} className="drawer-item-img">
                      <Bottle color={mood?.color ?? '#d8b98a'} name={item.product!.name} miniature glow={false} />
                    </Link>
                    <div className="drawer-item-info">
                      <span className="drawer-item-mood" style={{ color: mood?.color }}>{language === 'bn' ? mood?.nameBn : mood?.name}</span>
                      <Link to={`/product/${item.productId}`} onClick={() => setCartOpen(false)} className="drawer-item-title">{pick(item.product!.name, item.product!.nameBn)}</Link>
                      <span className="drawer-item-price">{formatPrice(item.product!.price)}</span>
                      <div className="qty-row">
                        <div className="qty-control">
                          <button onClick={() => setQty(item.productId, item.qty - 1)} aria-label="Decrease"><Minus size={13} /></button>
                          <span>{item.qty}</span>
                          <button onClick={() => setQty(item.productId, item.qty + 1)} aria-label="Increase"><Plus size={13} /></button>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>{t('cart.remove')}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="drawer-foot">
              <div className="drawer-total"><span>{t('cart.subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
              <p className="drawer-note">Delivery calculated at checkout. Cash on Delivery available.</p>
              <Link to="/checkout" className="btn btn-gold btn-full" onClick={() => setCartOpen(false)}>
                {t('cart.checkout')} <ArrowRight size={17} />
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
