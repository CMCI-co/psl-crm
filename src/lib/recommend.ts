// src/lib/recommend.ts
// Decision recommendation derived from interview score (ported from kit.jsx).
// Drives the Applicants directory + Application Review triage.

export interface Recommendation {
  label: string;
  kind: 'await' | 'advance' | 'discuss' | 'hold';
  fg: string;
  bg: string;
}

export function recommend(score: number | null | undefined): Recommendation {
  if (score == null) return { label: 'Awaiting', kind: 'await', fg: '#8b91a0', bg: 'transparent' };
  if (score >= 8.5) return { label: 'Advance', kind: 'advance', fg: '#1f6b46', bg: '#e3f3ea' };
  if (score >= 6.5) return { label: 'Discuss', kind: 'discuss', fg: '#8a5a16', bg: '#fbefdd' };
  return { label: 'Hold', kind: 'hold', fg: '#9a3b3b', bg: '#f6e9e9' };
}
