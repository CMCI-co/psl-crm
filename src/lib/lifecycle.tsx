// lifecycle.tsx — the journey state machine made live. Advancing a person
// (Applicant → Candidate → Member → Alumni) applies an optimistic stage
// override immediately so they move between directory views without a refetch,
// and — when Supabase is configured — writes a stage_transitions row + updates
// members.stage, then invalidates the cache. Demo mode keeps it purely local.
import {
  createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useMembers, membersKey } from '@/data/members';
import { useTheme } from '@/theme/useTheme';
import { UI } from '@/theme/tokens';
import type { Member, Stage } from '@/types/domain';
import { STAGE_FLOW } from '@/types/domain';

const STAGE_LABEL: Record<Stage, string> = {
  applicant: 'Applicant',
  candidate: 'Candidate',
  member: 'Active Member',
  alumni: 'Alumni',
};

export interface Toast { id: number; text: string }

/** A person reference small enough that any list row can supply it. */
type Movable = Pick<Member, 'id' | 'stage'>;

interface LifecycleValue {
  stageOf: (id: string, fallback: Stage) => Stage;
  advance: (m: Movable, to: Stage) => void;
  promote: (m: Movable) => void;
  advanceMany: (ms: Movable[], to: Stage, verb?: string) => void;
  overrides: Record<string, Stage>;
  toasts: Toast[];
  dismiss: (id: number) => void;
}

const Ctx = createContext<LifecycleValue | null>(null);

export function LifecycleProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [overrides, setOverrides] = useState<Record<string, Stage>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback((text: string) => {
    const id = idRef.current++;
    setToasts((ts) => [{ id, text }, ...ts]);
    setTimeout(() => dismiss(id), 3400);
  }, [dismiss]);

  // Persist to Supabase when live. Optimistic UI has already moved the row, so
  // a failure only needs to surface a toast — the next refetch reconciles.
  const persist = useCallback(async (memberId: string, from: Stage, to: Stage) => {
    if (!supabase) return;
    try {
      await supabase.from('stage_transitions').insert({ member_id: memberId, from_stage: from, to_stage: to });
      const { error } = await supabase.from('members').update({ stage: to }).eq('id', memberId);
      if (error) throw error;
      void qc.invalidateQueries({ queryKey: membersKey });
    } catch {
      pushToast('Could not save that change to the server.');
    }
  }, [qc, pushToast]);

  const stageOf = useCallback(
    (id: string, fallback: Stage) => overrides[id] ?? fallback,
    [overrides],
  );

  const advance = useCallback((m: Movable, to: Stage) => {
    setOverrides((o) => (o[m.id] === to ? o : { ...o, [m.id]: to }));
    const flow = STAGE_FLOW[m.stage];
    pushToast(`${flow?.label ?? 'Moved'} → ${STAGE_LABEL[to]}`);
    void persist(m.id, m.stage, to);
  }, [persist, pushToast]);

  const promote = useCallback((m: Movable) => advance(m, 'member'), [advance]);

  const advanceMany = useCallback((ms: Movable[], to: Stage, verb?: string) => {
    if (ms.length === 0) return;
    setOverrides((o) => {
      const n = { ...o };
      ms.forEach((m) => { n[m.id] = to; });
      return n;
    });
    pushToast(`${ms.length} ${ms.length === 1 ? 'profile' : 'profiles'} ${verb ?? 'advanced'} → ${STAGE_LABEL[to]}`);
    ms.forEach((m) => void persist(m.id, m.stage, to));
  }, [persist, pushToast]);

  const value = useMemo<LifecycleValue>(() => ({
    stageOf, advance, promote, advanceMany, overrides, toasts, dismiss,
  }), [stageOf, advance, promote, advanceMany, overrides, toasts, dismiss]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLifecycle(): LifecycleValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLifecycle must be used within a LifecycleProvider');
  return v;
}

/**
 * Members with live stage overrides applied. Both the sidebar counts and the
 * body rows read through this so a promotion is reflected everywhere at once.
 */
export function useEffectiveMembers() {
  const q = useMembers();
  const { overrides } = useLifecycle();
  const data = useMemo(
    () => (q.data ?? []).map((m) => (overrides[m.id] ? { ...m, stage: overrides[m.id] } : m)),
    [q.data, overrides],
  );
  return { ...q, data };
}

/** Floating confirmation toasts for lifecycle actions. */
export function Toasts() {
  const { toasts, dismiss } = useLifecycle();
  const { t } = useTheme();
  if (toasts.length === 0) return null;
  return (
    <div
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 400,
        display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360,
      }}
    >
      {toasts.map((to) => (
        <div
          key={to.id}
          onClick={() => dismiss(to.id)}
          role="status"
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
            borderRadius: 12, background: t.ink, color: t.bg, cursor: 'pointer',
            boxShadow: '0 14px 40px rgba(15,20,32,.32)', fontFamily: UI, fontSize: 13, fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 18, height: 18, borderRadius: 999, background: t.accent, color: t.onAccent,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M2 6.2l2.6 2.6L10 3.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{to.text}</span>
        </div>
      ))}
    </div>
  );
}
