// useNav.ts — a small navigation facade over React Router that mirrors the
// prototype's window.PSLNav (go / replace / setView / back / home) so view
// components port cleanly — but every destination is a real URL.
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export type RouteName =
  | 'directory'
  | 'profile'
  | 'application'
  | 'tracker'
  | 'alumniRecord'
  | 'resources'
  | 'training'
  | 'builder'
  | 'player'
  | 'cohort';

export interface NavParams {
  view?: 'active' | 'candidate' | 'applicant' | 'alumni';
  id?: string;
}

export function pathFor(name: RouteName, p: NavParams = {}): string {
  switch (name) {
    case 'directory': return `/directory/${p.view ?? 'active'}`;
    case 'profile': return `/profile/${p.id ?? ''}`;
    case 'application': return `/application/${p.id ?? ''}`;
    case 'tracker': return '/tracker';
    case 'alumniRecord': return `/alumni/${p.id ?? ''}`;
    case 'resources': return '/resources';
    case 'training': return '/training';
    case 'builder': return '/training/builder';
    case 'player': return `/training/player/${p.id ?? ''}`;
    case 'cohort': return '/cohort';
    default: return '/';
  }
}

export function useNav() {
  const navigate = useNavigate();
  const go = useCallback((name: RouteName, params: NavParams = {}) => navigate(pathFor(name, params)), [navigate]);
  const replace = useCallback((name: RouteName, params: NavParams = {}) => navigate(pathFor(name, params), { replace: true }), [navigate]);
  const setView = useCallback((view: NonNullable<NavParams['view']>) => navigate(pathFor('directory', { view })), [navigate]);
  const back = useCallback(() => navigate(-1), [navigate]);
  const home = useCallback(() => navigate(pathFor('directory', { view: 'active' })), [navigate]);
  const canBack = typeof window !== 'undefined' && window.history.length > 1;
  return { go, replace, setView, back, home, canBack };
}
