// engagement-data.ts — the fixed engagement dataset that backs the Profile
// workspace sections, copied verbatim from features.jsx. (Demo data for the
// hero alum; wired to live per-member records when the Supabase sub-resource
// repositories land in a later step.) Live tasks + activity layer on top of
// these via the collab store, filtered by the person being viewed.
import type { Channel, Priority, TaskStatus } from '@/types/domain';
import type { AreaKind, StatusTone } from './engagement-atoms';

export interface LifeArea {
  key: AreaKind; label: string; status: string; tone: StatusTone; by: string; date: string; note: string;
}
export interface PrayerItem { text: string; date: string; open: boolean }
export interface Followup {
  title: string; owner: string; due: string; overdue: boolean; channel: Channel; pri: Priority; status: TaskStatus;
}
export interface CallItem {
  date: string; by: string; type: Channel; dur: string | null; areas: string[]; note: string; updates: string[];
}
export interface GivingInfo { status: string; amount: string; since: string; ytd: string; lifetime: string }
export interface HelpItem { key: string; label: string; on: boolean; note: string }

// How they're doing — a health check across the life areas leaders track.
// tone: good (thriving) · steady (fine) · watch (needs attention) · info (neutral)
export const LIFE_AREAS: LifeArea[] = [
  { key: 'personal', label: 'Personal', status: 'Steady', tone: 'steady', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Settled into Charlotte and in a good rhythm. Training for an October half-marathon. Energy is high.' },
  { key: 'family', label: 'Family', status: 'Big news', tone: 'good', by: 'Devon Hayes', date: 'Mar 2',
    note: 'He and Hannah are expecting their first child this fall. Her parents recently relocated nearby.' },
  { key: 'work', label: 'Work', status: 'Thriving', tone: 'good', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Promoted to a senior design role at Collins Aerospace; now leading a small team. Loves the work.' },
  { key: 'spiritual', label: 'Spiritual', status: 'Growing', tone: 'good', by: 'Jordan Tate', date: 'Jun 10',
    note: 'Plugged into a men\u2019s group at Forest Hill and reading through the Gospels with two coworkers.' },
];

export const PRAYER: PrayerItem[] = [
  { text: 'Healthy pregnancy & delivery for Hannah this fall.', date: 'Jun 10', open: true },
  { text: 'Wisdom leading his new team well at work.', date: 'Jun 10', open: true },
  { text: 'Closed: peace on the cross-country move.', date: 'Mar 2', open: false },
];

// Assigned follow-ups — the project-management layer. Linear/Asana model:
// owner, due date, intended channel, priority, status.
export const FOLLOWUPS: Followup[] = [
  { title: 'Intro Grant to two engineering members for mentoring', owner: 'Jordan Tate', due: 'Jun 30', overdue: false, channel: 'Call', pri: 'high', status: 'doing' },
  { title: 'Send him Collins referral info for members interviewing there', owner: 'Anthony Reyes', due: 'Jul 5', overdue: false, channel: 'Email', pri: 'med', status: 'todo' },
  { title: 'Loop Grant into the fall service project', owner: 'Devon Hayes', due: 'Aug 15', overdue: false, channel: 'Text', pri: 'low', status: 'todo' },
  { title: 'Send congratulations on the baby news', owner: 'Jordan Tate', due: 'Mar 4', overdue: false, channel: 'Text', pri: 'med', status: 'done' },
];

// Interaction log — every touch, who made it, on what channel.
export const CALLS: CallItem[] = [
  { date: 'Jun 10, 2026', by: 'Jordan Tate', type: 'Call', dur: '24 min', areas: ['Work', 'Mentoring'],
    note: 'Great catch-up. Grant moved into a senior design role and is open to mentoring two engineering members this fall. Wants intros to anyone interviewing at Collins.', updates: ['Employer', 'Phone'] },
  { date: 'May 1, 2026', by: 'Anthony Reyes', type: 'Text', dur: null, areas: [],
    note: 'Quick check-in before finals push. He offered to review résumés for the senior class. Replied same day.', updates: [] },
  { date: 'Mar 2, 2026', by: 'Devon Hayes', type: 'Visit', dur: null, areas: ['Family'],
    note: 'Coffee in Charlotte. He and Hannah are expecting in the fall. Asked to be looped into the spring service project.', updates: ['Marital status'] },
  { date: 'Dec 18, 2025', by: 'Jordan Tate', type: 'Email', dur: null, areas: [],
    note: 'Sent year-end note + chapter update. Replied within the day — still very engaged.', updates: [] },
];

export const GIVING: GivingInfo = { status: 'Active monthly donor', amount: '$50 / mo', since: '2025', ytd: '$400', lifetime: '$1,150' };

// Ways an alum is open to staying involved — the three asks, plus giving.
export const HELP: HelpItem[] = [
  { key: 'connect', label: 'Connect with members', on: true, note: 'Happy to grab coffee with current engineering students.' },
  { key: 'mentor', label: 'Mentor a member', on: true, note: 'Up for mentoring 1–2 men through senior year & job search.' },
  { key: 'volunteer', label: 'Volunteer / serve', on: true, note: 'Wants in on the spring service project & interview days.' },
];
