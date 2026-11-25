import { useStore, useT } from '../store/StoreContext';

interface MoodSelectorProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  compact?: boolean;
}

export function MoodSelector({ selected, onSelect, compact = false }: MoodSelectorProps) {
  const { moods, products } = useStore();
  const { t, language } = useT();

  return (
    <div className={`mood-selector ${compact ? 'is-compact' : ''}`} role="group" aria-label={t('moods.heading')}>
      <button
        className={`mood-pill all-pill ${selected === null ? 'is-selected' : ''}`}
        onClick={() => onSelect(null)}
      >
        <span className="pill-dot all-dot">✦</span>
        <span>{t('moods.all')}</span>
      </button>
      {moods.map((mood) => {
        const count = products.filter((p) => p.moodId === mood.id).length;
        return (
          <button
            key={mood.id}
            className={`mood-pill ${selected === mood.id ? 'is-selected' : ''}`}
            style={{ '--pill-color': mood.color } as React.CSSProperties}
            onClick={() => onSelect(selected === mood.id ? null : mood.id)}
          >
            <span className="pill-dot" />
            <span>{language === 'bn' ? mood.nameBn : mood.name}</span>
            {!compact && <small>{count}</small>}
          </button>
        );
      })}
    </div>
  );
}
