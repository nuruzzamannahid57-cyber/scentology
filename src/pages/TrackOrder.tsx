import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useStore, useT } from '../store/StoreContext';
import { formatDate, formatPrice } from '../lib/utils';

export function TrackOrder() {
  const { orders } = useStore();
  const { t } = useT();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);

  const found = orders.find((o) =>
    o.id.toLowerCase() === orderId.trim().toLowerCase() && o.customer.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''),
  );

  const submit = (e: FormEvent) => { e.preventDefault(); setSearched(true); };

  return (
    <div className="page-shell">
      <div className="shell track-wrap">
        <span className="eyebrow">Scentology BD</span>
        <h1 className="page-title">Track an order</h1>
        <p className="section-sub">Enter the order number from your confirmation page and the phone number you used.</p>
        <form className="track-form" onSubmit={submit}>
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order number (SO-…)" required />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
          <button className="btn btn-gold" type="submit"><Search size={16} /> Find order</button>
        </form>

        {searched && (found ? (
          <div className="track-result">
            <div className="track-head"><div><strong>{found.id}</strong><span>{formatDate(found.createdAt)}</span></div><span className="status-badge">{found.status}</span></div>
            <div className="track-steps">
              {(['Pending', 'Confirmed', 'Shipped', 'Delivered'] as const).map((step, i) => {
                const current = ['Pending', 'Confirmed', 'Shipped', 'Delivered'].indexOf(found.status);
                return <div key={step} className={`track-step ${current >= i ? 'is-done' : ''}`}><i /><span>{step}</span></div>;
              })}
            </div>
            <p>{found.items.length} item(s) · {formatPrice(found.total)} · Delivering to {found.customer.district}</p>
          </div>
        ) : (
          <div className="empty-state compact-empty"><p>No order found with those details.</p><Link to="/collection" className="text-link">{t('cart.continue')}</Link></div>
        ))}
      </div>
    </div>
  );
}
