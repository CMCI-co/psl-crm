// database.ts — Supabase schema types.
//
// This is hand-authored to match supabase/schema.sql and is shaped like the
// output of `supabase gen types typescript`. Once your project is live you can
// regenerate it with:
//
//   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
//
// Phase 1 wires the `members` read path; tables are added here as later phases
// implement them.

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export type UserRole =
  | 'national_staff'
  | 'campus_director'
  | 'member'
  | 'candidate'
  | 'applicant'
  | 'alumni';
export type MemberStage = 'applicant' | 'candidate' | 'member' | 'alumni';
export type MemberStatus = 'active' | 'inactive';

export interface Database {
  public: {
    Tables: {
      chapters: {
        Row: { id: string; name: string; campus: string | null; created_at: string };
        Insert: { id?: string; name: string; campus?: string | null; created_at?: string };
        Update: { id?: string; name?: string; campus?: string | null; created_at?: string };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          campus: string | null;
          chapter_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          campus?: string | null;
          chapter_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          chapter_id: string | null;
          first_name: string;
          last_name: string;
          middle: string | null;
          stage: MemberStage;
          status: MemberStatus;
          email: string | null;
          phone: string | null;
          address: string | null;
          birthday: string | null;
          school: string | null;
          major: string | null;
          minor: string | null;
          class_year: string;
          hometown: string | null;
          church: string | null;
          employer: string | null;
          relationship: string | null;
          cohort: string | null;
          member_no: string | null;
          grad_year: string | null;
          work: string | null;
          location: string | null;
          marital: string | null;
          kids: number | null;
          open_to_connect: boolean | null;
          owner_id: string | null;
          avatar_url: string | null;
          submitted: string | null;
          interview_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          chapter_id?: string | null;
          first_name: string;
          last_name: string;
          middle?: string | null;
          stage?: MemberStage;
          status?: MemberStatus;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          birthday?: string | null;
          school?: string | null;
          major?: string | null;
          minor?: string | null;
          class_year: string;
          hometown?: string | null;
          church?: string | null;
          employer?: string | null;
          relationship?: string | null;
          cohort?: string | null;
          member_no?: string | null;
          grad_year?: string | null;
          work?: string | null;
          location?: string | null;
          marital?: string | null;
          kids?: number | null;
          open_to_connect?: boolean | null;
          owner_id?: string | null;
          avatar_url?: string | null;
          submitted?: string | null;
          interview_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['members']['Insert']>;
        Relationships: [];
      };
      roles_history: {
        Row: {
          id: string;
          member_id: string;
          title: string;
          term: string | null;
          is_current: boolean;
        };
        Insert: {
          id?: string;
          member_id: string;
          title: string;
          term?: string | null;
          is_current?: boolean;
        };
        Update: Partial<Database['public']['Tables']['roles_history']['Insert']>;
        Relationships: [];
      };
      stage_transitions: {
        Row: {
          id: string;
          member_id: string;
          from_stage: MemberStage | null;
          to_stage: MemberStage;
          by_id: string | null;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          from_stage?: MemberStage | null;
          to_stage: MemberStage;
          by_id?: string | null;
          occurred_at?: string;
        };
        Update: Partial<Database['public']['Tables']['stage_transitions']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: { is_editor: { Args: Record<string, never>; Returns: boolean } };
    Enums: {
      user_role: UserRole;
      member_stage: MemberStage;
      member_status: MemberStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
