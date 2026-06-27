// tokens.ts — design tokens ported verbatim from the prototype (kit.jsx).
// Three brand directions x light/dark, plus the shared semantic stage palette.
// These are the single source of truth for color; ThemeProvider turns the
// resolved object into both a typed `t` object (for inline styles, 1:1 with the
// prototype) and a set of CSS custom properties on <html>.

export type BrandKey = 'navy' | 'evergreen' | 'maroon';
export type Mode = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';
export type Stage = 'applicant' | 'candidate' | 'member' | 'alumni';

export interface StagePalette {
  label: string;
  solid: string;
  fg: string;
  bg: string;
}
export type StageMap = Record<Stage, StagePalette>;

export interface ThemeTokens {
  key: BrandKey;
  name: string;
  dark: boolean;
  ink: string; sub: string; faint: string;
  bg: string; panel: string; panel2: string; line: string;
  chrome: string; chromeLine: string; chromeInk: string; groupBg: string; groupInk: string;
  accent: string; accentDeep: string; accentSoft: string; onAccent: string;
  gold: string;
  stages: StageMap;
}

// ── Type ────────────────────────────────────────────────────────────────
export const UI = "'Hanken Grotesk', system-ui, sans-serif";
export const SERIF = "'Newsreader', Georgia, serif";
export const MONO = "'Space Mono', ui-monospace, monospace";

// ── Stage palette (semantic, shared across brands) ────────────────────────
export const STAGES: StageMap = {
  applicant: { label: 'Applicant', solid: '#bd7526', fg: '#a3641f', bg: '#f6ead8' },
  candidate: { label: 'Candidate', solid: '#0a86dd', fg: '#0080d8', bg: '#e0eefc' },
  member:    { label: 'Active Member', solid: '#3f7a52', fg: '#3f7a52', bg: '#e6f1ea' },
  alumni:    { label: 'Alumni', solid: '#454d78', fg: '#454d78', bg: '#eaebf4' },
};
export const STAGES_DARK: StageMap = {
  applicant: { label: 'Applicant', solid: '#bd7526', fg: '#dca460', bg: 'rgba(192,121,42,.20)' },
  candidate: { label: 'Candidate', solid: '#0a86dd', fg: '#5bb4ff', bg: 'rgba(0,151,255,.18)' },
  member:    { label: 'Active Member', solid: '#3f7a52', fg: '#6fb78a', bg: 'rgba(63,122,82,.24)' },
  alumni:    { label: 'Alumni', solid: '#454d78', fg: '#9aa0cf', bg: 'rgba(69,77,120,.30)' },
};

type RawTheme = Omit<ThemeTokens, 'dark' | 'stages'>;

// ── Light brand directions ────────────────────────────────────────────────
const LIGHT: Record<BrandKey, RawTheme> = {
  navy: {
    key: 'navy', name: 'Heritage Navy',
    ink: '#1a2233', sub: '#5d6577', faint: '#8b91a0',
    bg: '#ffffff', panel: '#f6f7f9', panel2: '#eef0f4', line: '#e4e7ec',
    chrome: '#eceff5', chromeLine: '#d8deea', chromeInk: '#2a3550', groupBg: '#e4eaf6', groupInk: '#2c4178',
    accent: '#22386b', accentDeep: '#16264c', accentSoft: '#eef1f8', onAccent: '#ffffff',
    gold: '#a9852f',
  },
  evergreen: {
    key: 'evergreen', name: 'Evergreen & Cream',
    ink: '#1d2a25', sub: '#586860', faint: '#8a978f',
    bg: '#ffffff', panel: '#f4f6f3', panel2: '#e9efe9', line: '#e0e6e0',
    chrome: '#e8efe9', chromeLine: '#d4ded6', chromeInk: '#1d2a25', groupBg: '#e1ece4', groupInk: '#1f4f3f',
    accent: '#1f4f3f', accentDeep: '#143a2d', accentSoft: '#ecf3ef', onAccent: '#ffffff',
    gold: '#b08433',
  },
  maroon: {
    key: 'maroon', name: 'Maroon & Stone',
    ink: '#2a2020', sub: '#6b5d5d', faint: '#9a8e8e',
    bg: '#ffffff', panel: '#f7f4f3', panel2: '#efe8e7', line: '#e8e0df',
    chrome: '#f1e9e8', chromeLine: '#e2d5d4', chromeInk: '#2a2020', groupBg: '#f0e1e2', groupInk: '#7a2230',
    accent: '#7a2230', accentDeep: '#5c1822', accentSoft: '#f6edee', onAccent: '#ffffff',
    gold: '#a9842f',
  },
};

// ── Dark: shared slate neutrals, per-brand accent ─────────────────────────
const DARK_NEUTRALS = {
  ink: '#f1f2f6', sub: '#c2c6cf', faint: '#9095a1',
  bg: '#2e313b', panel: '#25272f', panel2: '#3a3d48', line: '#43464f',
  chrome: '#1c1e24', chromeLine: '#383b44', chromeInk: '#e6e8ee', groupBg: '#2a2c35',
  onAccent: '#ffffff', gold: '#cba959',
};
const DARK: Record<BrandKey, RawTheme> = {
  navy: {
    key: 'navy', name: 'Heritage Navy', ...DARK_NEUTRALS,
    groupInk: '#9fb3e6', accent: '#6885d2', accentDeep: '#3f5aa8', accentSoft: '#2c3347',
  },
  evergreen: {
    key: 'evergreen', name: 'Evergreen & Cream', ...DARK_NEUTRALS,
    groupInk: '#7ec79f', accent: '#4cb084', accentDeep: '#2c7657', accentSoft: '#283a33',
  },
  maroon: {
    key: 'maroon', name: 'Maroon & Stone', ...DARK_NEUTRALS,
    groupInk: '#e09aa4', accent: '#d2616f', accentDeep: '#9e3343', accentSoft: '#3b2b30',
  },
};

export const BRANDS: { key: BrandKey; name: string }[] = [
  { key: 'navy', name: 'Heritage Navy' },
  { key: 'evergreen', name: 'Evergreen & Cream' },
  { key: 'maroon', name: 'Maroon & Stone' },
];

/** Resolve a fully-formed token object for a brand + mode. */
export function getTheme(brand: BrandKey, mode: Mode): ThemeTokens {
  const dark = mode === 'dark';
  const raw = (dark ? DARK : LIGHT)[brand] || LIGHT.navy;
  return { ...raw, dark, stages: dark ? STAGES_DARK : STAGES };
}

/** Row padding for the active density (matches prototype comfortable/compact). */
export function rowPad(density: Density): string {
  return density === 'compact' ? '7px 12px' : '11px 14px';
}

// ── Responsive breakpoints (kit.jsx BP) ───────────────────────────────────
export const BP = { phone: 600, tab: 980 } as const;
