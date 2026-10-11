export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`} aria-label="Mahindra, Built Beyond">
      <svg className="brand-emblem" viewBox="0 0 42 30" role="img" aria-hidden="true">
        <path d="M3 23.5 15.3 7l5.8 8.4L26.8 7 39 23.5h-7.1l-5.2-7.1-5.6 7.1-5.6-7.1-5.2 7.1H3Z" />
        <path d="M4 27h34" />
      </svg>
      <span className="brand-word-stack">
        <span className="brand-word">mahindra</span>
        {!compact && <span className="brand-subline">BUILT BEYOND</span>}
      </span>
    </span>
  );
}
