// src/auth/roles.ts
// Roles & permissions. In the prototype this was a client toggle; in production
// the role comes from the signed-in user's profile and is ENFORCED by Supabase
// Row-Level Security (see /supabase/policies.sql). This module is the client-side
// mirror used to gate affordances (edit, promote, assign) in the UI — never the
// only line of defense.

export type Role = 'National Staff' | 'Campus Director' | 'Member' | 'Candidate';

export const ROLES: Role[] = ['National Staff', 'Campus Director', 'Member', 'Candidate'];

/** Can fully manage members: CRUD, advance/promote stages, assign, review apps. */
export function canManage(role: Role): boolean {
  return role === 'National Staff' || role === 'Campus Director';
}

/** Threads through profile views as the prototype's `editable` prop. */
export function isEditable(role: Role): boolean {
  return canManage(role);
}

/** Cross-chapter visibility. */
export function isCrossChapter(role: Role): boolean {
  return role === 'National Staff';
}
