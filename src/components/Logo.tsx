interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className = '', compact = false }: LogoProps) {
  if (compact) {
    return (
      <svg className={className} viewBox="0 0 70 78" role="img" aria-label="Scentology BD" fill="none">
        <text x="0" y="42" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="46" fill="currentColor">S</text>
        <text x="38" y="25" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="18" letterSpacing="1" fill="currentColor">BD</text>
        <text x="33" y="66" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="13" fontStyle="italic" fill="currentColor">mood</text>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 430 106" role="img" aria-label="Scentology BD — Scented your mood" fill="none">
      <text
        x="0" y="60"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="61" fontWeight="500"
        textLength="336" lengthAdjust="spacingAndGlyphs"
        fill="currentColor"
      >SCENTOLOGY</text>
      <text x="344" y="38" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="21" letterSpacing="3" fill="currentColor">BD</text>
      <text x="348" y="60" fontFamily="'Manrope', sans-serif" fontSize="9" letterSpacing="1.6" fill="currentColor" opacity="0.7">EST. 2024</text>
      <path d="M0 70H395" stroke="currentColor" strokeOpacity="0.36" strokeWidth="0.8" />
      <text x="2" y="94" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="19" fontStyle="italic" letterSpacing="2.2" fill="currentColor" opacity="0.88">Scented your mood</text>
    </svg>
  );
}
