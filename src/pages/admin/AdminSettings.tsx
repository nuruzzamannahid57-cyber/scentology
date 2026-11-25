import { useState, type FormEvent } from 'react';
import { CreditCard, MapPin, Share2 } from 'lucide-react';
import { useStore, useT } from '../../store/StoreContext';
import type { Settings } from '../../types';

export function AdminSettings() {
  const { settings, saveSettings } = useStore();
  const { t } = useT();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof Settings, value: string | number) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const submit = (e: FormEvent) => { e.preventDefault(); saveSettings(form); setSaved(true); };

  return (
    <div className="admin-content">
      <form className="admin-settings" onSubmit={submit}>
        <div className="admin-panel settings-panel">
          <div className="panel-head"><div><h2><MapPin size={18} /> {t('admin.delivery')}</h2><p>Delivery charges are applied automatically at checkout.</p></div></div>
          <div className="settings-grid">
            <label className="field"><span>{t('admin.inside')}</span><input type="number" min="0" value={form.deliveryInsideDhaka} onChange={(e) => set('deliveryInsideDhaka', Number(e.target.value))} /></label>
            <label className="field"><span>{t('admin.outside')}</span><input type="number" min="0" value={form.deliveryOutsideDhaka} onChange={(e) => set('deliveryOutsideDhaka', Number(e.target.value))} /></label>
            <label className="field"><span>{t('admin.freeAbove')}</span><input type="number" min="0" value={form.freeShippingThreshold} onChange={(e) => set('freeShippingThreshold', Number(e.target.value))} /></label>
          </div>
        </div>

        <div className="admin-panel settings-panel">
          <div className="panel-head"><div><h2><Share2 size={18} /> {t('admin.social')}</h2><p>These links appear in the footer and floating order button.</p></div></div>
          <div className="settings-grid two">
            <label className="field"><span>WhatsApp URL</span><input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></label>
            <label className="field"><span>Messenger URL</span><input value={form.messenger} onChange={(e) => set('messenger', e.target.value)} /></label>
            <label className="field"><span>Facebook URL</span><input value={form.facebook} onChange={(e) => set('facebook', e.target.value)} /></label>
            <label className="field"><span>Instagram URL</span><input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} /></label>
            <label className="field"><span>Email</span><input value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
            <label className="field"><span>Phone / payment receiving number</span><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label>
            <label className="field full"><span>Store address</span><input value={form.storeAddress} onChange={(e) => set('storeAddress', e.target.value)} /></label>
          </div>
        </div>

        <div className="admin-panel settings-panel">
          <div className="panel-head"><div><h2><CreditCard size={18} /> {t('admin.gateway')}</h2><p>Cash on Delivery is live; bKash and Nagad are manual with admin confirmation.</p></div></div>
          <label className="field"><span>Gateway placeholder note</span><textarea rows={3} value={form.gatewayNote} onChange={(e) => set('gatewayNote', e.target.value)} /></label>
          <div className="gateway-placeholder"><CreditCard size={15} /> SSLCommerz / bKash API hook: <code>src/pages/Checkout.tsx → payment options</code></div>
        </div>

        <div className="settings-save-row">
          {saved && <span className="saved-note">✓ {t('admin.saved')}</span>}
          <button className="btn btn-gold" type="submit">{t('admin.save')}</button>
        </div>
      </form>
    </div>
  );
}
