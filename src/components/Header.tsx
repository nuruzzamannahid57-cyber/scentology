import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Logo } from './Logo';
import { useStore, useT } from '../store/StoreContext';

export function Header() {
  const { cart, setCartOpen, language, setLanguage } = useStore();
  const { t } = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/collection', label: t('nav.collection'), end: false },
    { to: '/#mood-selector', label: t('nav.moods'), end: false },
    { to: '/#our-story', label: t('nav.story'), end: false },
  ];

  const handleNav = (to: string) => {
    if (!to.includes('#')) return;
    const id = to.split('#')[1];
    if (location.pathname !== '/') return;
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
  };

  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link to="/" className="brand-link" aria-label="Scentology BD home">
          <Logo className="header-logo" />
        </Link>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => handleNav(link.to)}
              className={({ isActive }) => `nav-link ${isActive && !link.to.includes('#') ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/admin" className="nav-link admin-link">{t('nav.admin')}</Link>
        </nav>

        <div className="header-actions">
          <button
            className="lang-toggle"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            title="বাংলা / English"
            aria-label="Toggle language"
          >
            <span className={language === 'en' ? 'is-active' : ''}>EN</span>
            <i />
            <span className={language === 'bn' ? 'is-active' : ''}>BN</span>
          </button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={t('nav.cart')}>
            <ShoppingBag size={19} strokeWidth={1.6} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </button>
          <button className="menu-button" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
