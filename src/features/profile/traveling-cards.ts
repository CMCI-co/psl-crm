// traveling-cards.ts — the chips that ride under the Profile Card ("Carries
// with this profile"). Ported from kit.jsx PROFILE.cards. These represent the
// standard set of records that travel with a person Apply → Alumni; the
// per-person values get wired to live sub-resources in a later phase.
import type { CardGlyphKind } from '@/components/ui';

export interface TravelingCardChip {
  k: CardGlyphKind;
  label: string;
  meta: string;
}

/** Default traveling-card chips (kit.jsx PROFILE.cards). */
export const DEFAULT_TRAVELING_CARDS: TravelingCardChip[] = [
  { k: 'application', label: 'Application', meta: 'Submitted' },
  { k: 'scorecard', label: 'Interview Scorecard', meta: '8.6 avg' },
  { k: 'testing', label: 'Candidacy Testing', meta: '5 / 6 modules' },
  { k: 'certs', label: 'Certifications', meta: '3 active' },
  { k: 'milestones', label: 'Milestones', meta: '11 events' },
  { k: 'prayer', label: 'Prayer Requests', meta: '2 open' },
];
