import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Bottle } from '../components/Bottle';
import { MoodSelector } from '../components/MoodSelector';
import { ProductCard } from '../components/ProductCard';
import { useStore, useT } from '../store/StoreContext';

export function Home() {
  const { moods, products } = useStore();
  const { t, language } = useT();
  const [selected, setSelected] = useState<string | null>(null);
  const featured = products.filter((p) => p.featured).slice(0, 5);
  const activeMood = moods.find((m) => m.id === selected);

  return (
    <>
      <section className="hero">
        <div className="hero-ambient" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={13} /> {t('hero.eyebrow')}</span>
            <h1 className="hero-title">
              {t('hero.title1')}<br />
              <em>{t('hero.title2')}</em>
              <span className="hero-period">.</span>
            </h1>
            <p className="hero-body">{t('hero.body')}</p>
            <div className="hero-actions">
              <Link to="/collection" className="btn btn-gold">{t('hero.cta1')} <ArrowRight size={17} /></Link>
              <a href="#mood-selector" className="btn btn-text">{t('hero.cta2')} <ArrowUpRight size={16} /></a>
            </div>
            <p className="hero-niche">{t('hero.niche')}</p>
          </div>

          <div className="hero-visual">
            <div className="hero-halo" />
            {[moods[4], moods[1], moods[3]].map((mood, index) => {
              if (!mood) return null;
              const product = products.find((p) => p.moodId === mood.id) ?? products[index];
              if (!product) return null;
              return (
                <Link
                  key={mood.id}
                  to={`/collection?mood=${mood.id}`}
                  className={`hero-bottle hero-bottle-${index}`}
                  style={{ '--hero-color': mood.color } as React.CSSProperties}
                  aria-label={`Shop ${mood.name} perfumes`}
                >
                  <Bottle color={mood.color} name={product.name} size={product.sizeMl} />
                  <span className="hero-bottle-label">{language === 'bn' ? mood.nameBn : mood.name}</span>
                </Link>
              );
            })}
            <span className="hero-visual-caption">N° 01 — 07</span>
          </div>
        </div>

        <div className="shell mood-niches">
          {moods.map((mood, i) => (
            <Link
              key={mood.id}
              to={`/collection?mood=${mood.id}`}
              className="mood-niche"
              style={{ '--niche-color': mood.color } as React.CSSProperties}
            >
              <span className="niche-orb"><i /></span>
              <span className="niche-number">0{i + 1}</span>
              <span className="niche-name">{language === 'bn' ? mood.nameBn : mood.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-featured" id="mood-selector">
        <div className="shell">
          <div className="section-head center">
            <span className="eyebrow">{t('moods.heading')}</span>
            <h2 className="section-title">{activeMood ? (language === 'bn' ? activeMood.nameBn : activeMood.name) : t('moods.heading')}</h2>
            <p className="section-sub">{activeMood ? (language === 'bn' ? activeMood.descriptionBn : activeMood.description) : t('moods.sub')}</p>
          </div>

          <MoodSelector selected={selected} onSelect={setSelected} />

          {activeMood && (
            <div className="mood-cta-row">
              <span>{t('moods.active')}: <strong style={{ color: activeMood.color }}>{language === 'bn' ? activeMood.nameBn : activeMood.name}</strong></span>
              <Link to={`/collection?mood=${activeMood.id}`} className="text-link">{t('moods.shop')} <ArrowRight size={15} /></Link>
            </div>
          )}

          <div className="product-grid mood-grid">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} dimmed={selected !== null && product.moodId !== selected} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-edit">
        <div className="shell">
          <div className="section-head split-head">
            <div>
              <span className="eyebrow">{t('home.featured.eyebrow')}</span>
              <h2 className="section-title">{t('home.featured.title')}</h2>
            </div>
            <div>
              <p className="section-sub">{t('home.featured.sub')}</p>
              <Link to="/collection" className="text-link">{t('home.viewAll')} <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className="featured-row">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="story-section" id="our-story">
        <div className="shell story-grid">
          <div className="story-art">
            <div className="story-ring" />
            <div className="story-bottle"><Bottle color="#d8b98a" name="Scentology" size={50} glow /></div>
            <span className="story-art-caption">Crafted by feeling</span>
          </div>
          <div className="story-copy">
            <span className="eyebrow">{t('home.story.eyebrow')}</span>
            <h2 className="section-title">{t('home.story.title')}</h2>
            <p>{t('home.story.body')}</p>
            <div className="story-stats">
              <div><strong>07</strong><span>{t('home.story.stat1')}</span></div>
              <div><strong>12</strong><span>{t('home.story.stat2')}</span></div>
              <div><strong>64</strong><span>{t('home.story.stat3')}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="shell newsletter-inner">
          <div>
            <span className="eyebrow">Mood letter</span>
            <h2 className="section-title">{t('home.newsletter.title')}</h2>
            <p>{t('home.newsletter.body')}</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); (e.currentTarget.querySelector('input') as HTMLInputElement).value = ''; alert(t('home.newsletter.success')); }}>
            <input type="email" placeholder={t('home.newsletter.placeholder')} required aria-label={t('home.newsletter.placeholder')} />
            <button className="btn btn-gold" type="submit">{t('home.newsletter.button')}</button>
          </form>
        </div>
      </section>
    </>
  );
}
