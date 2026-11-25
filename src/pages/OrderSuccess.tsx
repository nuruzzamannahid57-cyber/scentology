import { Link, useParams } from 'react-router-dom';
import { Check, PackageCheck } from 'lucide-react';
import { useStore, useT } from '../store/StoreContext';
import { formatDate, formatPrice } from '../lib/utils';

export function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useStore();
  const { t } = useT();
  const order = orders.find((o) => o.id === id);

  return (
    <div className="page-shell success-page">
      <div className="shell success-card">
        <div className="success-icon"><Check size={34} /></div>
        <span className="eyebrow">Scentology BD</span>
        <h1 className="page-title">{t('success.title')}</h1>
        <p className="section-sub">{t('success.sub')}</p>

        {order ? (
          <div className="success-receipt">
            <div className="receipt-line"><span>{t('success.order')}</span><strong>{order.id}</strong></div>
            <div className="receipt-line"><span>{t('admin.date')}</span><span>{formatDate(order.createdAt)}</span></div>
            <div className="receipt-line"><span>{t('checkout.delivery')}</span><span>{order.customer.district}{order.customer.area ? `, ${order.customer.area}` : ''}</span></div>
            <div className="receipt-line"><span>{t('admin.payment')}</span><span>{order.payment.method.toUpperCase()} · {order.payment.status}</span></div>
            <div className="receipt-line receipt-total"><span>{t('checkout.total')}</span><strong>{formatPrice(order.total)}</strong></div>
            <div className="receipt-status"><PackageCheck size={16} /> {order.status}</div>
          </div>
        ) : (
          <p className="section-sub">Order details are saved in this browser and will appear in the admin panel.</p>
        )}

        <div className="success-actions">
          <Link to="/collection" className="btn btn-gold">{t('success.continue')}</Link>
          <Link to="/track" className="btn btn-outline">Track order</Link>
        </div>
      </div>
    </div>
  );
}
