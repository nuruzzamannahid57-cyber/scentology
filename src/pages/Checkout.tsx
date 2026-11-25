import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, Check, CreditCard, Lock, Smartphone } from 'lucide-react';
import { useStore, useT } from '../store/StoreContext';
import { defaultSettings, dhakaAreas, districts, isBdPhone, isInsideDhaka, normalizePhone } from '../data/seed';
import { gatewayAdapters } from '../lib/payments';
import { formatPrice, makeId } from '../lib/utils';
import type { Order, PaymentMethod } from '../types';

export function Checkout() {
  const { cart, products, moods, settings, clearCart, addOrder } = useStore();
  const { t, pick } = useT();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', district: '', area: '', address: '', note: '', trxId: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const items = useMemo(() => cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })).filter((item) => item.product), [cart, products]);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.qty, 0);
  const delivery = subtotal === 0 || (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold)
    ? 0
    : isInsideDhaka(form.district) ? settings.deliveryInsideDhaka : settings.deliveryOutsideDhaka;
  const total = subtotal + delivery;

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Required';
    if (!isBdPhone(form.phone)) next.phone = t('checkout.phoneHint');
    if (!form.district) next.district = 'Required';
    if (isInsideDhaka(form.district) && !form.area) next.area = 'Required';
    if (!form.address.trim()) next.address = 'Required';
    if (payment !== 'cod' && !form.trxId.trim()) next.trxId = 'Required';
    if (items.length === 0) next.items = 'Your bag is empty';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    const order: Order = {
      id: makeId('SO-'),
      createdAt: new Date().toISOString(),
      customer: {
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim(),
        address: form.address.trim(),
        district: form.district,
        area: isInsideDhaka(form.district) ? form.area : form.area || 'Other',
        note: form.note.trim(),
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.product!.name,
        moodName: moods.find((m) => m.id === item.product?.moodId)?.name ?? '',
        price: item.product!.price,
        qty: item.qty,
        sizeMl: item.product!.sizeMl,
      })),
      subtotal,
      delivery,
      total,
      payment: {
        method: payment,
        trxId: payment === 'cod' ? '' : form.trxId.trim(),
        status: payment === 'cod' ? 'Not required' : 'Pending verification',
      },
      status: 'Pending',
    };

    setTimeout(() => {
      addOrder(order);
      clearCart();
      navigate(`/order/${order.id}`);
    }, 450);
  };

  const fieldClass = (key: string) => `field ${errors[key] ? 'has-error' : ''}`;

  if (items.length === 0) {
    return (
      <div className="page-shell shell empty-state">
        <h1 className="page-title">{t('cart.title')}</h1>
        <p>{t('cart.empty')}</p>
        <Link to="/collection" className="btn btn-gold">{t('cart.continue')}</Link>
      </div>
    );
  }

  return (
    <div className="page-shell checkout-page">
      <div className="shell">
        <Link to="/collection" className="back-link"><ArrowLeft size={15} /> {t('cart.continue')}</Link>
        <h1 className="page-title">{t('checkout.title')}</h1>

        <form className="checkout-grid" onSubmit={submit} noValidate>
          <div className="checkout-main">
            <section className="checkout-card">
              <div className="checkout-step"><span>01</span><h2>{t('checkout.contact')}</h2></div>
              <div className="field-row">
                <label className={fieldClass('name')}>
                  <span>{t('checkout.name')} *</span>
                  <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Ayesha Rahman" />
                  {errors.name && <small>{errors.name}</small>}
                </label>
                <label className={fieldClass('phone')}>
                  <span>{t('checkout.phone')} *</span>
                  <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="01XXXXXXXXX" inputMode="numeric" maxLength={11} />
                  {errors.phone ? <small>{errors.phone}</small> : <small className="field-hint">{t('checkout.phoneHint')}</small>}
                </label>
              </div>
              <label className="field">
                <span>{t('checkout.email')}</span>
                <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
              </label>
            </section>

            <section className="checkout-card">
              <div className="checkout-step"><span>02</span><h2>{t('checkout.delivery')}</h2></div>
              <div className="field-row">
                <label className={fieldClass('district')}>
                  <span>{t('checkout.district')} *</span>
                  <select value={form.district} onChange={(e) => { update('district', e.target.value); update('area', ''); }}>
                    <option value="">{t('checkout.districtPlaceholder')}</option>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <small>{errors.district}</small>}
                </label>
                <label className={fieldClass('area')}>
                  <span>{t('checkout.area')}{isInsideDhaka(form.district) ? ' *' : ''}</span>
                  {isInsideDhaka(form.district) ? (
                    <select value={form.area} onChange={(e) => update('area', e.target.value)}>
                      <option value="">{t('checkout.areaPlaceholder')}</option>
                      {dhakaAreas.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  ) : (
                    <input value={form.area} onChange={(e) => update('area', e.target.value)} placeholder={t('checkout.areaPlaceholder')} />
                  )}
                  {errors.area && <small>{errors.area}</small>}
                </label>
              </div>
              <label className={fieldClass('address')}>
                <span>{t('checkout.address')} *</span>
                <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder={t('checkout.addressPlaceholder')} />
                {errors.address && <small>{errors.address}</small>}
              </label>
              <label className="field">
                <span>{t('checkout.note')}</span>
                <textarea rows={2} value={form.note} onChange={(e) => update('note', e.target.value)} />
              </label>
              <div className="delivery-info">
                <Check size={15} />
                <span>
                  {isInsideDhaka(form.district) || !form.district
                    ? `Inside Dhaka: ${formatPrice(settings.deliveryInsideDhaka)}`
                    : `Outside Dhaka: ${formatPrice(settings.deliveryOutsideDhaka)}`}
                  {settings.freeShippingThreshold > 0 && ` · Free above ${formatPrice(settings.freeShippingThreshold)}`}
                </span>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-step"><span>03</span><h2>{t('checkout.payment')}</h2></div>
              <div className="payment-options">
                <button type="button" className={`payment-option ${payment === 'cod' ? 'is-active' : ''}`} onClick={() => setPayment('cod')}>
                  <span className="payment-icon"><Banknote size={21} /></span>
                  <span className="payment-copy"><strong>{t('checkout.cod')}</strong><small>{t('checkout.codDesc')}</small></span>
                  <span className="radio-mark" />
                </button>
                {(['bkash', 'nagad'] as const).map((method) => (
                  <button type="button" key={method} className={`payment-option ${payment === method ? 'is-active' : ''}`} onClick={() => setPayment(method)}>
                    <span className={`payment-icon ${method}`}><Smartphone size={21} /></span>
                    <span className="payment-copy"><strong>{t(method === 'bkash' ? 'checkout.bkash' : 'checkout.nagad')}</strong><small>Manual transfer · admin verifies</small></span>
                    <span className="radio-mark" />
                  </button>
                ))}
                {gatewayAdapters.map((adapter) => (
                  <button type="button" key={adapter.id} className="payment-option is-disabled" disabled title="Gateway hook — enable the adapter to go live">
                    <span className="payment-icon"><CreditCard size={21} /></span>
                    <span className="payment-copy"><strong>{adapter.label}</strong><small>Coming soon · adapter ready in src/lib/payments.ts</small></span>
                    <span className="radio-mark" />
                  </button>
                ))}
              </div>

              {payment !== 'cod' && (
                <div className="manual-payment-box">
                  <p className="manual-title"><span className={payment}>{payment === 'bkash' ? 'bKash' : 'Nagad'}</span> {t('checkout.payNumber')}: <strong>{settings.phone || defaultSettings.phone}</strong></p>
                  <p className="manual-hint">{t('checkout.trxHint')}</p>
                  <label className={fieldClass('trxId')}>
                    <span>{t('checkout.trx')} *</span>
                    <input value={form.trxId} onChange={(e) => update('trxId', e.target.value)} placeholder="e.g. BK7X92A4" />
                    {errors.trxId && <small>{errors.trxId}</small>}
                  </label>
                </div>
              )}

              <div className="gateway-placeholder">
                <Lock size={14} /> <span>{settings.gatewayNote || defaultSettings.gatewayNote}</span>
              </div>
            </section>
          </div>

          <aside className="checkout-summary">
            <h2>{t('checkout.summary')}</h2>
            <div className="summary-items">
              {items.map((item) => {
                const mood = moods.find((m) => m.id === item.product?.moodId);
                return (
                  <div className="summary-item" key={item.productId}>
                    <span className="summary-swatch" style={{ background: mood?.color }} />
                    <div>
                      <strong>{pick(item.product!.name, item.product!.nameBn)}</strong>
                      <small>{item.qty} × {formatPrice(item.product!.price)}</small>
                    </div>
                    <span>{formatPrice(item.product!.price * item.qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-lines">
              <div><span>{t('cart.subtotal')}</span><span>{formatPrice(subtotal)}</span></div>
              <div><span>{t('checkout.deliveryFee')}</span><span>{delivery === 0 ? t('checkout.free') : formatPrice(delivery)}</span></div>
              <div className="summary-total"><span>{t('checkout.total')}</span><strong>{formatPrice(total)}</strong></div>
            </div>
            {errors.items && <p className="form-error">{errors.items}</p>}
            <button className="btn btn-gold btn-full" type="submit" disabled={submitting}>
              {submitting ? t('checkout.processing') : t('checkout.place')}
            </button>
            <p className="summary-terms">{t('checkout.terms')}</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
