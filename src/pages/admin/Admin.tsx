import { useState, type FormEvent } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { Boxes, CircleDollarSign, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Palette, Settings2 } from 'lucide-react';
import { useStore, useT } from '../../store/StoreContext';
import { formatPrice } from '../../lib/utils';
import { AdminProducts } from './AdminProducts';
import { AdminMoods } from './AdminMoods';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';

const navItems = [
  { path: '', labelKey: 'admin.dashboard' as const, icon: LayoutDashboard },
  { path: 'products', labelKey: 'admin.products' as const, icon: Boxes },
  { path: 'moods', labelKey: 'admin.moods' as const, icon: Palette },
  { path: 'orders', labelKey: 'admin.orders' as const, icon: ClipboardList },
  { path: 'settings', labelKey: 'admin.settings' as const, icon: Settings2 },
];

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { t } = useT();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'scentology') onLogin();
    else setError(true);
  };
  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="eyebrow">Scentology BD</span>
        <h1>{t('admin.login')}</h1>
        <p>{t('admin.subtitle')}</p>
        <label className="field">
          <span>{t('admin.password')}</span>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} autoFocus />
        </label>
        {error && <p className="form-error">{t('admin.badPassword')}</p>}
        <button className="btn btn-gold btn-full" type="submit">{t('admin.signIn')}</button>
        <small className="login-hint">Demo password: scentology</small>
      </form>
    </div>
  );
}

function Dashboard() {
  const { orders, products, moods } = useStore();
  const { t } = useT();
  const pending = orders.filter((o) => o.payment.status === 'Pending verification').length;
  const value = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="admin-content">
      <div className="admin-stats">
        <div className="stat-card"><ClipboardList size={20} /><span>{t('admin.ordersCount')}</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><Boxes size={20} /><span>{t('admin.productsCount')}</span><strong>{products.length}</strong></div>
        <div className="stat-card"><CircleDollarSign size={20} /><span>{t('admin.revenue')}</span><strong>{formatPrice(value)}</strong></div>
        <div className="stat-card pending-card"><Palette size={20} /><span>{t('admin.pending')}</span><strong>{pending}</strong><small>{moods.length} moods configured</small></div>
      </div>

      <div className="admin-panel">
        <div className="panel-head">
          <h2>{t('admin.recent')}</h2>
          <Link to="/admin/orders" className="text-link">View all →</Link>
        </div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>{t('admin.customer')}</th><th>{t('admin.status')}</th><th>{t('admin.payment')}</th><th>{t('admin.total')}</th></tr></thead>
            <tbody>
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleDateString('en-GB')}</small></td>
                  <td>{order.customer.name}<small>{order.customer.phone}</small></td>
                  <td><span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>{order.payment.method.toUpperCase()}<small>{order.payment.status}</small></td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  const { t } = useT();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('scentology-admin') === '1');

  const login = () => { sessionStorage.setItem('scentology-admin', '1'); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem('scentology-admin'); setAuthed(false); };

  if (!authed) return <AdminLogin onLogin={login} />;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <strong className="admin-wordmark">SCENTOLOGY<span>BD</span></strong>
          <span>{t('admin.subtitle')}</span>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={`/admin${item.path ? `/${item.path}` : ''}`} end={item.path === ''} className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}>
              <item.icon size={17} /> {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-nav-link"><ExternalLink size={17} /> {t('admin.viewSite')}</Link>
          <button className="admin-nav-link" onClick={logout}><LogOut size={17} /> {t('admin.logout')}</button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div><h1>{t('admin.title')}</h1><p>{t('admin.subtitle')}</p></div>
          <Link to="/" className="btn btn-outline btn-small">{t('admin.viewSite')}</Link>
        </div>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="moods" element={<AdminMoods />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
}
