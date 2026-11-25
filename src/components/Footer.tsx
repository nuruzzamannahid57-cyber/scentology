import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { Logo } from './Logo';
import { useStore, useT } from '../store/StoreContext';

export function Footer() {
  const { settings, moods } = useStore();
  const { t } = useT();

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo"><Logo className="footer-logo-svg" /></Link>
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <p className="footer-blurb">Niche-inspired perfumes, composed by feeling and delivered across Bangladesh.</p>
          <div className="footer-socials">
            <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
            <a href={settings.messenger} target="_blank" rel="noreferrer" aria-label="Messenger"><MessageCircle size={17} /></a>
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Send size={17} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.shop')}</h4>
          <Link to="/collection">{t('nav.collection')}</Link>
          {moods.slice(0, 5).map((mood) => (
            <Link key={mood.id} to={`/collection?mood=${mood.id}`}>{mood.name}</Link>
          ))}
        </div>

        <div className="footer-col">
          <h4>{t('footer.help')}</h4>
          <Link to="/track">Track an order</Link>
          <Link to="/admin">{t('nav.admin')}</Link>
          <a href={`mailto:${settings.email}`}>{t('footer.contact')}</a>
          <p className="footer-small">Cash on Delivery · bKash · Nagad</p>
        </div>

        <div className="footer-col">
          <h4>{t('footer.contact')}</h4>
          <a href={`mailto:${settings.email}`} className="footer-contact-line"><Mail size={15} /> {settings.email}</a>
          <a href={`tel:${settings.phone}`} className="footer-contact-line"><Phone size={15} /> {settings.phone}</a>
          <p className="footer-small">{settings.storeAddress}</p>
          <p className="footer-small">Inside Dhaka ৳{settings.deliveryInsideDhaka} · Outside ৳{settings.deliveryOutsideDhaka}</p>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Scentology BD. {t('footer.rights')}</span>
        <span className="footer-bottom-motto">{t('footer.tagline')}</span>
      </div>
    </footer>
  );
}
