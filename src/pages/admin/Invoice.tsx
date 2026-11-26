import { Link, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { useStore } from '../../store/StoreContext';
import { formatDate, formatPrice } from '../../lib/utils';

export function Invoice() {
  const { id } = useParams();
  const { orders, settings } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <div className="invoice-page"><p>Order not found. <Link to="/admin/orders">Back to orders</Link></p></div>;
  }

  return (
    <div className="invoice-page">
      <div className="invoice-toolbar no-print">
        <Link to="/admin/orders" className="text-link">← Back to orders</Link>
        <button className="btn btn-gold btn-small" onClick={() => window.print()}><Printer size={15} /> Print invoice / delivery slip</button>
      </div>

      <div className="invoice-sheet">
        <div className="invoice-head">
          <Logo className="invoice-logo" />
          <div className="invoice-head-right">
            <h1>Invoice / Delivery Slip</h1>
            <p>Order: <strong>{order.id}</strong></p>
            <p>Date: {formatDate(order.createdAt)}</p>
            <p>Status: {order.status}</p>
          </div>
        </div>

        <div className="invoice-addresses">
          <div>
            <span className="invoice-label">From</span>
            <strong>Scentology BD</strong>
            <p>{settings.storeAddress}<br />{settings.phone}<br />{settings.email}</p>
          </div>
          <div>
            <span className="invoice-label">Deliver to</span>
            <strong>{order.customer.name}</strong>
            <p>{order.customer.address}<br />{order.customer.area}{order.customer.area && ', '}{order.customer.district}<br />{order.customer.phone}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead><tr><th>#</th><th>Item</th><th>Mood</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><strong>{item.name}</strong><small>{item.sizeMl} ml · EDP</small></td>
                <td>{item.moodName}</td>
                <td>{item.qty}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{formatPrice(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div><span>Delivery</span><span>{order.delivery === 0 ? 'Free' : formatPrice(order.delivery)}</span></div>
          <div className="invoice-grand"><span>Total payable</span><strong>{formatPrice(order.total)}</strong></div>
          <div><span>Payment</span><span>{order.payment.method.toUpperCase()} · {order.payment.status}{order.payment.trxId ? ` · ${order.payment.trxId}` : ''}</span></div>
        </div>

        {order.customer.note && <p className="invoice-note"><strong>Note:</strong> {order.customer.note}</p>}

        <div className="invoice-sign">
          <div><span>Prepared by</span></div>
          <div><span>Received by</span></div>
        </div>
        <p className="invoice-thanks">Thank you for choosing Scentology BD. Scented your mood.</p>
      </div>
    </div>
  );
}
