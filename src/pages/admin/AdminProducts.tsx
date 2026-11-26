import { useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Bottle } from '../../components/Bottle';
import { useStore, useT } from '../../store/StoreContext';
import { formatPrice, makeId } from '../../lib/utils';
import type { Product } from '../../types';

function emptyProduct(moodId: string): Product {
  return {
    id: makeId('p'),
    name: '',
    nameBn: '',
    moodId,
    price: 3500,
    sizeMl: 50,
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    description: '',
    descriptionBn: '',
    featured: false,
    stock: 10,
    badge: '',
  };
}

export function AdminProducts() {
  const { products, moods, saveProduct, deleteProduct } = useStore();
  const { t } = useT();
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const openNew = () => { setEditing(emptyProduct(moods[0]?.id ?? '')); setFormOpen(true); };
  const openEdit = (product: Product) => { setEditing({ ...product }); setFormOpen(true); };
  const set = <K extends keyof Product>(key: K, value: Product[K]) => {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  };
  const submit = () => {
    if (!editing?.name.trim() || !editing.moodId) return;
    saveProduct({ ...editing, name: editing.name.trim() });
    setFormOpen(false);
  };
  const mood = moods.find((m) => m.id === editing?.moodId);

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-head">
          <div><h2>{t('admin.products')}</h2><p>{products.length} products · {moods.length} moods</p></div>
          <button className="btn btn-gold btn-small" onClick={openNew}><Plus size={15} /> {t('admin.addProduct')}</button>
        </div>

        {formOpen && editing && (
          <div className="admin-form-card">
            <div className="form-head"><h3>{editing.name ? t('admin.editProduct') : t('admin.addProduct')}</h3><button className="icon-button" onClick={() => setFormOpen(false)}><X size={18} /></button></div>
            <div className="admin-form-grid">
              <div className="admin-form-main">
                <div className="field-row">
                  <label className="field"><span>{t('admin.productName')} *</span><input value={editing.name} onChange={(e) => set('name', e.target.value)} /></label>
                  <label className="field"><span>Product name (Bangla)</span><input value={editing.nameBn} onChange={(e) => set('nameBn', e.target.value)} /></label>
                </div>
                <div className="field-row three">
                  <label className="field"><span>{t('admin.mood')} *</span>
                    <select value={editing.moodId} onChange={(e) => set('moodId', e.target.value)}>
                      <option value="">—</option>
                      {moods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </label>
                  <label className="field"><span>{t('admin.price')}</span><input type="number" min="0" value={editing.price} onChange={(e) => set('price', Number(e.target.value))} /></label>
                  <label className="field"><span>{t('admin.size')}</span><input type="number" min="1" value={editing.sizeMl} onChange={(e) => set('sizeMl', Number(e.target.value))} /></label>
                </div>
                <div className="field-row">
                  <label className="field"><span>{t('admin.stock')}</span><input type="number" min="0" value={editing.stock} onChange={(e) => set('stock', Number(e.target.value))} /></label>
                  <label className="field"><span>Badge (optional)</span><input value={editing.badge ?? ''} onChange={(e) => set('badge', e.target.value)} placeholder="Bestseller" /></label>
                </div>
                <div className="field-row three">
                  <label className="field"><span>{t('product.top')}</span><input value={editing.topNotes} onChange={(e) => set('topNotes', e.target.value)} /></label>
                  <label className="field"><span>{t('product.heart')}</span><input value={editing.heartNotes} onChange={(e) => set('heartNotes', e.target.value)} /></label>
                  <label className="field"><span>{t('product.base')}</span><input value={editing.baseNotes} onChange={(e) => set('baseNotes', e.target.value)} /></label>
                </div>
                <label className="field"><span>{t('admin.description')}</span><textarea rows={3} value={editing.description} onChange={(e) => set('description', e.target.value)} /></label>
                <label className="field"><span>Description (Bangla)</span><textarea rows={2} value={editing.descriptionBn} onChange={(e) => set('descriptionBn', e.target.value)} /></label>
                <label className="checkbox-field"><input type="checkbox" checked={editing.featured} onChange={(e) => set('featured', e.target.checked)} /> {t('admin.featured')}</label>
                <div className="form-actions"><button className="btn btn-ghost" onClick={() => setFormOpen(false)}>{t('admin.cancel')}</button><button className="btn btn-gold" onClick={submit}>{t('admin.save')}</button></div>
              </div>
              <div className="admin-form-preview">
                <span className="eyebrow">{t('admin.preview')}</span>
                <Bottle color={mood?.color ?? '#d8b98a'} name={editing.name || 'Your scent'} size={editing.sizeMl} />
                <strong style={{ color: mood?.color }}>{mood?.name ?? '—'}</strong>
                <span>{formatPrice(editing.price)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>{t('admin.mood')}</th><th>{t('admin.price')}</th><th>{t('admin.stock')}</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {products.map((product) => {
                const productMood = moods.find((m) => m.id === product.moodId);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="table-product"><span className="table-swatch" style={{ background: productMood?.color }} /><div><strong>{product.name}</strong><small>{product.sizeMl} ml · {product.badge || 'EDP'}</small></div></div>
                    </td>
                    <td><span className="mood-table-label" style={{ color: productMood?.color }}><i style={{ background: productMood?.color }} />{productMood?.name ?? '—'}</span></td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.featured ? <span className="mini-badge featured">Featured</span> : <span className="mini-badge">Standard</span>}</td>
                    <td className="table-actions">
                      <button onClick={() => openEdit(product)} aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => { if (window.confirm(t('admin.confirmDelete'))) deleteProduct(product.id); }} aria-label="Delete"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
