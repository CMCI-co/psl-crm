// src/lib/offices.ts
// Leadership/office helpers (ported from kit.jsx). Current offices ride with the
// card; past offices become permanent historic labels.

import type { Member, OfficeRole } from '@/types/domain';

export function currentRoles(p?: Pick<Member, 'roles'> | null): OfficeRole[] {
  return (p?.roles ?? []).filter((r) => r.current);
}
export function pastRoles(p?: Pick<Member, 'roles'> | null): OfficeRole[] {
  return (p?.roles ?? []).filter((r) => !r.current);
}
export function topRole(p?: Pick<Member, 'roles'> | null): OfficeRole | null {
  return currentRoles(p)[0] || pastRoles(p)[0] || null;
}
