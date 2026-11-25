import { useId } from 'react';
import { withAlpha } from '../lib/utils';

interface BottleProps {
  color: string;
  name: string;
  size?: number;
  className?: string;
  glow?: boolean;
  miniature?: boolean;
}

export function Bottle({ color, name, size = 50, className = '', glow = true, miniature = false }: BottleProps) {
  const uid = useId().replace(/:/g, '');
  const words = name.trim().split(/\s+/);
  const line1 = words.length > 1 ? words.slice(0, -1).join(' ') : name;
  const line2 = words.length > 1 ? words[words.length - 1] : '';
  const style = { '--bottle-glow': withAlpha(color, 0.5), '--bottle-tint': color } as React.CSSProperties;

  return (
    <div className={`bottle-wrap ${glow ? 'has-glow' : ''} ${miniature ? 'is-mini' : ''} ${className}`} style={style}>
      <svg viewBox="0 0 200 300" className="bottle-svg" role="img" aria-label={`${name} perfume bottle`}>
        <defs>
          <linearGradient id={`liquid-${uid}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={withAlpha(color, 0.78)} />
            <stop offset="42%" stopColor={withAlpha(color, 0.36)} />
            <stop offset="100%" stopColor={withAlpha(color, 0.9)} />
          </linearGradient>
          <linearGradient id={`cap-${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#5d4c3b" />
            <stop offset="22%" stopColor="#cfb487" />
            <stop offset="52%" stopColor="#f0dcb4" />
            <stop offset="78%" stopColor="#b59a70" />
            <stop offset="100%" stopColor="#4d3e2e" />
          </linearGradient>
          <linearGradient id={`shine-${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id={`soft-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>

        <ellipse cx="100" cy="280" rx="61" ry="9" fill="#000" opacity=".38" filter={`url(#soft-${uid})`} />
        <ellipse cx="100" cy="66" rx="55" ry="18" fill={color} opacity=".2" filter={`url(#soft-${uid})`} />

        <rect x="80" y="14" width="40" height="35" rx="3" fill={`url(#cap-${uid})`} />
        <path d="M80 24h40M80 43h40" stroke="#fff" strokeOpacity=".22" />
        <rect x="87" y="47" width="26" height="18" rx="2" fill={withAlpha(color, 0.55)} stroke="#e5d1ab" strokeOpacity=".45" />
        <rect x="89" y="49" width="6" height="14" rx="2" fill="#fff" opacity=".18" />

        <path
          d="M64 65c-8 0-14 6-14 14v169c0 11 8 19 19 19h62c11 0 19-8 19-19V79c0-8-6-14-14-14H64Z"
          fill={`url(#liquid-${uid})`}
          stroke={withAlpha(color, 0.9)}
          strokeWidth="1.4"
        />
        <path d="M56 84c0-4 3-7 7-7h6v176h-8c-3 0-5-2-5-5V84Z" fill={`url(#shine-${uid})`} />
        <path d="M144 88v153c0 6-3 11-7 14V77c4 1 7 5 7 11Z" fill="#000" opacity=".12" />
        <path d="M50 124h100" stroke="#fff" strokeOpacity=".1" />

        <rect x="63" y="139" width="74" height="80" rx="2" fill="#f5ead8" fillOpacity=".95" />
        <rect x="66" y="142" width="68" height="74" rx="1" fill="none" stroke="#b99b6b" strokeOpacity=".6" strokeWidth=".7" />
        <text x="100" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontSize="7.6" letterSpacing="1.6" fill="#5c4936">SCENTOLOGY</text>
        <path d="M78 163h44" stroke="#b99b6b" strokeOpacity=".7" strokeWidth=".6" />
        <text x="100" y="182" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11.5" fontStyle="italic" textLength="58" lengthAdjust="spacingAndGlyphs" fill="#2f241c">{line1}</text>
        {line2 && (
          <text x="100" y="196" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11.5" fontStyle="italic" textLength="48" lengthAdjust="spacingAndGlyphs" fill="#2f241c">{line2}</text>
        )}
        <text x="100" y="209" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" letterSpacing="1.6" fill="#6d5a44">{size} ML · EDP</text>

        <circle cx="100" cy="248" r="5" fill={withAlpha(color, 0.9)} opacity=".7" />
      </svg>
    </div>
  );
}
