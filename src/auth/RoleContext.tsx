// src/auth/RoleContext.tsx
// Holds the active role. Today it's a persisted dev switch (so you can feel each
// permission level, like the prototype's tweaks panel). When real Supabase auth
// is wired, replace the initial value with the signed-in user's profile.role and
// drop the setter from the UI.

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ROLES, type Role } from './roles';

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}

const Ctx = createContext<RoleCtx | null>(null);
const LS = 'psl.role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const v = localStorage.getItem(LS) as Role | null;
      return v && ROLES.includes(v) ? v : 'Campus Director';
    } catch {
      return 'Campus Director';
    }
  });
  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    localStorage.setItem(LS, r);
  }, []);
  const value = useMemo(() => ({ role, setRole }), [role, setRole]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole(): RoleCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useRole must be used within RoleProvider');
  return v;
}
