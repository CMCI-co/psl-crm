// src/components/atoms/CardGlyph.tsx
// Small inline glyphs for traveling-card chips (ported from kit.jsx).

export type GlyphKey =
  | 'application'
  | 'scorecard'
  | 'testing'
  | 'certs'
  | 'milestones'
  | 'prayer'
  | string;

export function CardGlyph({ k, color, size = 16 }: { k: GlyphKey; color: string; size?: number }) {
  const c = color;
  const s: React.CSSProperties = { width: size, height: size, display: 'block' };
  switch (k) {
    case 'application':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <rect x="3" y="1.5" width="10" height="13" rx="1.5" />
          <path d="M5.5 5h5M5.5 8h5M5.5 11h3" strokeLinecap="round" />
        </svg>
      );
    case 'scorecard':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M8 1.8l1.7 3.6 3.9.5-2.9 2.7.8 3.9L8 12.6 4.5 13l.8-3.9L2.4 6.4l3.9-.5z" strokeLinejoin="round" />
        </svg>
      );
    case 'testing':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M2.5 8.5l3 3 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'certs':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <circle cx="8" cy="6" r="4" />
          <path d="M5.5 9.5L4 14l4-2 4 2-1.5-4.5" strokeLinejoin="round" />
        </svg>
      );
    case 'milestones':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M8 1.5v13" strokeLinecap="round" />
          <circle cx="8" cy="4" r="1.6" fill={c} stroke="none" />
          <circle cx="8" cy="8" r="1.6" fill={c} stroke="none" />
          <circle cx="8" cy="12" r="1.6" fill={c} stroke="none" />
        </svg>
      );
    case 'prayer':
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M8 14s-5-3.2-5-7a3 3 0 015-2.2A3 3 0 0113 7c0 3.8-5 7-5 7z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg style={s} viewBox="0 0 16 16" fill="none" stroke={c} strokeWidth="1.4">
          <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
        </svg>
      );
  }
}
