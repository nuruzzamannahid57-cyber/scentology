import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { MoodSelector } from '../components/MoodSelector';
import { ProductCard } from '../components/ProductCard';
import { useStore, useT } from '../store/StoreContext';

type SortKey = 'featured' | 'low' | 'high' | 'name';

export function Collection() {
  const { products } = useStore();
  const { t } = useT();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState<SortKey>('featured');
  const selected = params.get('mood');

  const visible = useMemo(() => {
    const list = selected ? products.filter((p) => p.moodId === selected) : [...products];
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, selected, sort]);

  const selectMood = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set('mood', id);
    else next.delete('mood');
    setParams(next, { replace: true });
  };

  return (
    <div className="page-shell">
      <div className="shell collection-head">
        <span className="eyebrow">{t('collection.eyebrow')}</span>
        <h1 className="page-title">{t('collection.title')}</h1>
        <p className="section-sub">{t('collection.sub')}</p>
      </div>

      <div className="shell collection-toolbar">
        <div className="filter-group">
          <SlidersHorizontal size={16} />
          <span className="filter-caption">{t('collection.filterMood')}</span>
          <MoodSelector selected={selected} onSelect={selectMood} compact />
        </div>
        <div className="sort-group">
          <label htmlFor="sort">{t('collection.sort')}</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="featured">{t('collection.sortFeatured')}</option>
            <option value="low">{t('collection.sortLow')}</option>
            <option value="high">{t('collection.sortHigh')}</option>
            <option value="name">{t('collection.sortName')}</option>
          </select>
          <span className="result-count">{visible.length} {t('collection.results')}</span>
        </div>
      </div>

      <div className="shell">
        {visible.length ? (
          <div className="product-grid collection-grid">
            {visible.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t('collection.empty')}</p>
            <Link to="/collection" className="btn btn-outline" onClick={() => selectMood(null)}>{t('collection.reset')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
