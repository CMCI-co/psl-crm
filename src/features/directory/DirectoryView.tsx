// DirectoryView.tsx — orchestrates a directory view: pulls members (with live
// lifecycle overrides applied), computes chapter stats, applies search + status
// filters, and renders the matching body. The four lifecycle views share this
// shell so the left rail switches between them with real URLs.
import { useMemo } from 'react';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';
import { useNav } from '@/routes/useNav';
import { useEffectiveMembers } from '@/lib/lifecycle';
import type { Member, Stage } from '@/types/domain';
import { fullName } from '@/types/domain';
import { ActiveBody } from './ActiveBody';
import { CandidateBody } from './CandidateBody';
import { ApplicantBody } from './ApplicantBody';
import { AlumniBody } from './AlumniBody';

export type DirView = 'active' | 'candidate' | 'applicant' | 'alumni';
export interface DirStats { member: number; candidate: number; applicant: number; alumni: number; inactive: number }

const STAGE_OF: Record<DirView, Stage> = {
  active: 'member',
  candidate: 'candidate',
  applicant: 'applicant',
  alumni: 'alumni',
};

export function computeStats(all: Member[]): DirStats {
  return {
    member: all.filter((m) => m.stage === 'member').length,
    candidate: all.filter((m) => m.stage === 'candidate').length,
    applicant: all.filter((m) => m.stage === 'applicant').length,
    alumni: all.filter((m) => m.stage === 'alumni').length,
    inactive: all.filter((m) => m.stage === 'member' && m.status === 'inactive').length,
  };
}

function matches(m: Member, q: string): boolean {
  if (!q) return true;
  const hay = `${fullName(m)} ${m.major ?? ''} ${m.hometown ?? ''} ${m.church ?? ''} ${m.cohort ?? ''} ${m.work ?? ''} ${m.location ?? ''}`.toLowerCase();
  return hay.includes(q.trim().toLowerCase());
}

export function DirectoryView({ view, query, activeOnly }: {
  view: DirView; query: string; activeOnly: boolean;
}) {
  const { t, density } = useTheme();
  const { go } = useNav();
  const { data: all = [], isLoading, isError } = useEffectiveMembers();
  const dense = density === 'compact';

  const stats = useMemo(() => computeStats(all), [all]);
  const rows = useMemo(() => {
    let r = all.filter((m) => m.stage === STAGE_OF[view]);
    if (view === 'active' && activeOnly) r = r.filter((m) => m.status === 'active');
    r = r.filter((m) => matches(m, query));
    return r.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [all, view, activeOnly, query]);

  const open = (m: Member) => {
    if (m.stage === 'applicant') go('application', { id: m.id });
    else if (m.stage === 'alumni') go('alumniRecord', { id: m.id });
    else go('profile', { id: m.id });
  };

  if (isLoading) return <Notice text="Loading roster…" />;
  if (isError) return <Notice text="Couldn't load members. Check your Supabase configuration, or run in demo mode." />;

  if (view === 'active') return <ActiveBody rows={rows} stats={stats} dense={dense} onOpen={open} />;
  if (view === 'candidate') return <CandidateBody rows={rows} dense={dense} onOpen={open} />;
  if (view === 'applicant') return <ApplicantBody rows={rows} dense={dense} onOpen={open} />;
  return <AlumniBody rows={rows} dense={dense} onOpen={open} />;

  function Notice({ text }: { text: string }) {
    return <div style={{ padding: '60px 26px', textAlign: 'center', fontFamily: UI, fontSize: 13.5, color: t.faint }}>{text}</div>;
  }
}
