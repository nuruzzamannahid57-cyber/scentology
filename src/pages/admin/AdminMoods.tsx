import { useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useStore, useT } from '../../store/StoreContext';
import { withAlpha } from '../../lib/utils';
import type { Mood } from '../../types';

const swatches = ['#86b8a6', '#d98aa6', '#d1603d', '#7fc2c9', '#b53a56', '#e8b64c', '#8a9cc4', '#a486c9', '#c9a27a', '#8f9e6a'];

function emptyMood(): Mood {
  return { id: '', name: '', nameBn: '', color: '#d98aa6', description: '', descriptionBn: '' };
}

export function AdminMoods() {
  const { moods, products, saveMood, deleteMood } = useStore();
  const { t, language } = useT();
  const [editing, setEditing] = useState<Mood | null>(null);

  const set = (key: keyof Mood, value: string) => setEditing((current) => current ? { ...current, [key]: value } : current);
  const submit = () => {
    if (!editing?.name.trim()) return;
    saveMood({
      ...editing,
      id: editing.id || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: editing.name.trim(),
    });
    setEditing(null);
  };

  return (
    <div className="admin-content">
      <div className="admin-panel">
        <div className="panel-head">
          <div><h2>{t('admin.moods')}</h2><p>Each mood has a glow colour used across bottles, filters and the homepage.</p></div>
          <button className="btn btn-gold btn-small" onClick={() => setEditing(emptyMood())}><Plus size={15} /> {t('admin.addMood')}</button>
        </div>

        {editing && (
          <div className="admin-form-card mood-form-card">
            <div className="form-head"><h3>{editing.id ? t('admin.editMood') : t('admin.addMood')}</h3><button className="icon-button" onClick={() => setEditing(null)}><X size={18} /></button></div>
            <div className="mood-form-grid">
              <div className="mood-form-fields">
                <div className="field-row">
                  <label className="field"><span>{t('admin.moodName')} *</span><input value={editing.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Dreamy" /></label>
                  <label className="field"><span>Mood name (Bangla)</span><input value={editing.nameBn} onChange={(e) => set('nameBn', e.target.value)} /></label>
                </div>
                <label className="field"><span>{t('admin.description')}</span><input value={editing.description} onChange={(e) => set('description', e.target.value)} /></label>
                <label className="field"><span>Description (Bangla)</span><input value={editing.descriptionBn} onChange={(e) => set('descriptionBn', e.target.value)} /></label>
                <div className="field">
                  <span>{t('admin.moodColor')}</span>
                  <div className="color-input-row">
                    <input type="color" value={editing.color} onChange={(e) => set('color', e.target.value)} aria-label="Pick colour" />
                    <input value={editing.color} onChange={(e) => set('color', e.target.value)} />
                    <div className="swatches">
                      {swatches.map((color) => <button key={color} style={{ background: color }} onClick={() => set('color', color)} aria-label={`Use ${color}`} />)}
                    </div>
                  </div>
                </div>
                <div className="form-actions"><button className="btn btn-ghost" onClick={() => setEditing(null)}>{t('admin.cancel')}</button><button className="btn btn-gold" onClick={submit}>{t('admin.save')}</button></div>
              </div>
              <div className="mood-form-preview" style={{ background: `radial-gradient(circle at 50% 45%, ${withAlpha(editing.color, 0.28)}, transparent 68%)` }}>
                <span className="eyebrow">{t('admin.preview')}</span>
                <div className="preview-orb" style={{ background: editing.color, boxShadow: `0 0 60px 18px ${withAlpha(editing.color, 0.4)}` }} />
                <strong style={{ color: editing.color }}>{editing.name || 'New mood'}</strong>
                <small>{editing.description || 'A feeling, in a bottle.'}</small>
              </div>
            </div>
          </div>
        )}

        <div className="mood-cards">
          {moods.map((mood) => (
            <div className="admin-mood-card" key={mood.id} style={{ '--mood-color': mood.color } as React.CSSProperties}>
              <div className="mood-card-glow" />
              <div className="mood-card-top">
                <span className="preview-orb small" style={{ background: mood.color }} />
                <span className="mood-hex">{mood.color}</span>
              </div>
              <h3>{language === 'bn' ? mood.nameBn : mood.name}</h3>
              <p>{language === 'bn' ? mood.descriptionBn : mood.description}</p>
              <div className="mood-card-foot">
                <span>{products.filter((p) => p.moodId === mood.id).length} perfumes</span>
                <div className="table-actions">
                  <button onClick={() => setEditing({ ...mood })} aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => { if (window.confirm(t('admin.confirmDelete'))) deleteMood(mood.id); }} aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
