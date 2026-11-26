import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Search, X } from 'lucide-react';
import { useStore, useT } from '../../store/StoreContext';
import { formatDate, formatPrice } from '../../lib/utils';
import type { OrderStatus } from '../../types';

const statuses: Array<OrderStatus | 'All'> = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export function AdminOrders() {
  const { orders, setOrderStatus, confirmPayment } = useStore();
  const { t } = useT();
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = orders.filter((order) => {
    const matchesStatus = filter === 'All' || order.status === filter;
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || `${order.id} ${order.customer.name} ${order.customer.phone}`.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });
  const selected = orders.find((o) => o.id === selectedId);

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-head">
          <div><h2>{t('admin.allOrders')}</h2><p>{orders.length} orders · {orders.filter((o) => o.payment.status === 'Pending verification').length} awaiting payment confirmation</p></div>
          <div className="admin-search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, order ID" /></div>
        </div>

        <div className="status-tabs">
          {statuses.map((status) => (
            <button key={status} className={filter === status ? 'is-active' : ''} onClick={() => setFilter(status)}>
              {status} <small>{status === 'All' ? orders.length : orders.filter((o) => o.status === status).length}</small>
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>{t('admin.customer')}</th><th>{t('admin.date')}</th><th>{t('admin.status')}</th><th>{t('admin.payment')}</th><th>{t('admin.total')}</th><th></th></tr></thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id} onClick={() => setSelectedId(order.id)} className="clickable-row">
                  <td><strong>{order.id}</strong><small>{order.items.length} item(s)</small></td>
                  <td>{order.customer.name}<small>{order.customer.phone}</small></td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>{order.payment.method.toUpperCase()}<small>{order.payment.status}</small></td>
                  <td><strong>{formatPrice(order.total)}</strong></td>
                  <td><button className="view-link" onClick={(e) => { e.stopPropagation(); setSelectedId(order.id); }}>{t('admin.view')}</button></td>
                </tr>
              ))}
              {visible.length === 0 && <tr><td colSpan={7} className="empty-cell">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedId(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div><span className="eyebrow">{t('admin.orderDetails')}</span><h2>{selected.id}</h2></div>
              <button className="icon-button" onClick={() => setSelectedId(null)}><X size={19} /></button>
            </div>

            <div className="modal-section">
              <h3>{t('admin.customer')}</h3>
              <p><strong>{selected.customer.name}</strong> · {selected.customer.phone}</p>
              <p>{selected.customer.address}, {selected.customer.area}, {selected.customer.district}</p>
              {selected.customer.email && <p>{selected.customer.email}</p>}
              {selected.customer.note && <p className="order-note">“{selected.customer.note}”</p>}
            </div>

            <div className="modal-section">
              <h3>{t('invoice.items')}</h3>
              {selected.items.map((item, i) => (
                <div className="modal-item" key={i}>
                  <span className="modal-item-dot" />
                  <div><strong>{item.name}</strong><small>{item.moodName} · {item.sizeMl} ml · {item.qty} × {formatPrice(item.price)}</small></div>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="modal-totals">
                <div><span>{t('invoice.delivery')}</span><span>{formatPrice(selected.delivery)}</span></div>
                <div className="modal-total"><span>{t('invoice.total')}</span><strong>{formatPrice(selected.total)}</strong></div>
              </div>
            </div>

            <div className="modal-section">
              <h3>{t('admin.payment')}</h3>
              <p>{selected.payment.method.toUpperCase()} {selected.payment.trxId && `· TrxID: ${selected.payment.trxId}`}</p>
              <span className={`status-badge ${selected.payment.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}`}>{selected.payment.status}</span>
              {selected.payment.status === 'Pending verification' && (
                <button className="btn btn-outline btn-small confirm-pay" onClick={() => confirmPayment(selected.id)}>{t('admin.confirmPayment')}</button>
              )}
            </div>

            <div className="modal-section modal-status">
              <label className="field">
                <span>{t('admin.status')}</span>
                <select value={selected.status} onChange={(e) => setOrderStatus(selected.id, e.target.value as OrderStatus)}>
                  {statuses.filter((s) => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <Link to={`/admin/invoice/${selected.id}`} target="_blank" className="btn btn-gold btn-small"><Printer size={15} /> {t('admin.invoice')}</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
