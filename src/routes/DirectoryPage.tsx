// DirectoryPage.tsx — route component for /directory/:view. Owns the search +
// status filter state and shares it between the left rail and the body (which
// are siblings under AppShell).
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { useEffectiveMembers } from '@/lib/lifecycle';
import { DirectorySidebar } from '@/features/directory/DirectorySidebar';
import { DirectoryView, computeStats, type DirView } from '@/features/directory/DirectoryView';

const ALLOWED: DirView[] = ['active', 'candidate', 'applicant', 'alumni'];

export function DirectoryPage() {
  const { view } = useParams<{ view: string }>();
  const [query, setQuery] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const { data: all = [] } = useEffectiveMembers();

  if (!view || !ALLOWED.includes(view as DirView)) {
    return <Navigate to="/directory/active" replace />;
  }
  const v = view as DirView;
  const stats = computeStats(all);

  return (
    <AppShell
      sidebar={
        <DirectorySidebar
          view={v}
          counts={{ applicant: stats.applicant, candidate: stats.candidate, member: stats.member, alumni: stats.alumni }}
          query={query}
          onQuery={setQuery}
          activeOnly={activeOnly}
          onActiveOnly={setActiveOnly}
        />
      }
    >
      <DirectoryView view={v} query={query} activeOnly={activeOnly} />
    </AppShell>
  );
}
