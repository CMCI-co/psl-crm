// src/data/index.ts
// Picks the active DataSource from VITE_DATA_SOURCE. Every screen imports `db`
// from here — so switching backends is this one file.

import type { DataSource } from './DataSource';
import { mockDataSource } from './mockDataSource';
import { supabaseDataSource } from './supabaseDataSource';

const SOURCE = (import.meta.env.VITE_DATA_SOURCE as string) || 'mock';

export const db: DataSource = SOURCE === 'supabase' ? supabaseDataSource : mockDataSource;
export const DATA_SOURCE = SOURCE;

export type { DataSource, MemberQuery } from './DataSource';
