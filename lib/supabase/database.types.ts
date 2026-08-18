/**
 * Supabase Database types — generated shape for the blog schema.
 *
 * Hand-written to match `supabase/schema.sql` exactly so the repository layer
 * is fully typed today. To keep it in sync with the live database, regenerate:
 *
 *   npx supabase gen types typescript --linked > lib/supabase/database.types.ts
 *
 * The `Json` alias and the `Tables/Views/Functions/Enums` shape follow the
 * official `supabase gen types` output format so `SupabaseClient<Database>`
 * type-checks across lib/supabase/client.ts, server.ts and admin.ts.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      authors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          role: string;
          bio: string | null;
          avatar_url: string | null;
          email: string | null;
          twitter: string | null;
          website: string | null;
          instagram: string | null;
          linkedin: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          role?: string;
          bio?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          twitter?: string | null;
          website?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          role?: string;
          bio?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          twitter?: string | null;
          website?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          seo: Json;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          seo?: Json;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          seo?: Json;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blogs: {
        Row: {
          id: string;
          author_id: string | null;
          category_id: string | null;
          slug: string;
          title: string;
          subtitle: string;
          excerpt: string;
          cover_url: string | null;
          cover_alt: string;
          content: Json;
          status: Database["public"]["Enums"]["blog_status"];
          featured: boolean;
          trending: boolean;
          editors_pick: boolean;
          pinned: boolean;
          read_count: number;
          seo: Json;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          /** Generated column — never written by the app. */
          search_vector: string | null;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          category_id?: string | null;
          slug: string;
          title: string;
          subtitle?: string;
          excerpt?: string;
          cover_url?: string | null;
          cover_alt?: string;
          content?: Json;
          status?: Database["public"]["Enums"]["blog_status"];
          featured?: boolean;
          trending?: boolean;
          editors_pick?: boolean;
          pinned?: boolean;
          read_count?: number;
          seo?: Json;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          category_id?: string | null;
          slug?: string;
          title?: string;
          subtitle?: string;
          excerpt?: string;
          cover_url?: string | null;
          cover_alt?: string;
          content?: Json;
          status?: Database["public"]["Enums"]["blog_status"];
          featured?: boolean;
          trending?: boolean;
          editors_pick?: boolean;
          pinned?: boolean;
          read_count?: number;
          seo?: Json;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blogs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_tags: {
        Row: {
          blog_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          blog_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          blog_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_tags_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          id: string;
          blog_id: string;
          parent_id: string | null;
          author_name: string;
          author_email: string;
          content: string;
          status: Database["public"]["Enums"]["comment_status"];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          blog_id: string;
          parent_id?: string | null;
          author_name: string;
          author_email: string;
          content: string;
          status?: Database["public"]["Enums"]["comment_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          blog_id?: string;
          parent_id?: string | null;
          author_name?: string;
          author_email?: string;
          content?: string;
          status?: Database["public"]["Enums"]["comment_status"];
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter: {
        Row: {
          id: string;
          email: string;
          subscribed: boolean;
          source: string;
          created_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed?: boolean;
          source?: string;
          created_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed?: boolean;
          source?: string;
          created_at?: string;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      blog_views: {
        Row: {
          id: string;
          blog_id: string;
          visitor_id: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          blog_id: string;
          visitor_id?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          blog_id?: string;
          visitor_id?: string | null;
          viewed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_views_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_likes: {
        Row: {
          blog_id: string;
          visitor_id: string;
          created_at: string;
        };
        Insert: {
          blog_id: string;
          visitor_id: string;
          created_at?: string;
        };
        Update: {
          blog_id?: string;
          visitor_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_bookmarks: {
        Row: {
          blog_id: string;
          visitor_id: string;
          created_at: string;
        };
        Insert: {
          blog_id: string;
          visitor_id: string;
          created_at?: string;
        };
        Update: {
          blog_id?: string;
          visitor_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_bookmarks_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      featured_blogs: {
        Row: {
          blog_id: string;
          position: number;
          badge: string | null;
          created_at: string;
        };
        Insert: {
          blog_id: string;
          position?: number;
          badge?: string | null;
          created_at?: string;
        };
        Update: {
          blog_id?: string;
          position?: number;
          badge?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "featured_blogs_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: true;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
        ];
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          file_name: string | null;
          file_path: string | null;
          parsed_text: string | null;
          candidate_profile: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name?: string | null;
          file_path?: string | null;
          parsed_text?: string | null;
          candidate_profile?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string | null;
          file_path?: string | null;
          parsed_text?: string | null;
          candidate_profile?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      interview_sessions: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string | null;
          target_role: string;
          target_company: string | null;
          domain: string | null;
          experience_level: string | null;
          interview_type: string;
          duration_minutes: number;
          difficulty: string;
          status: string;
          config: Json;
          current_state: Json;
          started_at: string | null;
          ended_at: string | null;
          overall_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id?: string | null;
          target_role: string;
          target_company?: string | null;
          domain?: string | null;
          experience_level?: string | null;
          interview_type: string;
          duration_minutes: number;
          difficulty?: string;
          status?: string;
          config?: Json;
          current_state?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          overall_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string | null;
          target_role?: string;
          target_company?: string | null;
          domain?: string | null;
          experience_level?: string | null;
          interview_type?: string;
          duration_minutes?: number;
          difficulty?: string;
          status?: string;
          config?: Json;
          current_state?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          overall_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_sessions_resume_id_fkey";
            columns: ["resume_id"];
            isOneToOne: false;
            referencedRelation: "resumes";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_questions: {
        Row: {
          id: string;
          session_id: string;
          question: string;
          question_type: string;
          topic: string | null;
          difficulty: string;
          sequence: number;
          parent_question_id: string | null;
          asked_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          question: string;
          question_type?: string;
          topic?: string | null;
          difficulty?: string;
          sequence: number;
          parent_question_id?: string | null;
          asked_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          question?: string;
          question_type?: string;
          topic?: string | null;
          difficulty?: string;
          sequence?: number;
          parent_question_id?: string | null;
          asked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_questions_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "interview_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interview_questions_parent_question_id_fkey";
            columns: ["parent_question_id"];
            isOneToOne: false;
            referencedRelation: "interview_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_answers: {
        Row: {
          id: string;
          question_id: string;
          transcript: string | null;
          audio_url: string | null;
          video_url: string | null;
          duration_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          transcript?: string | null;
          audio_url?: string | null;
          video_url?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          transcript?: string | null;
          audio_url?: string | null;
          video_url?: string | null;
          duration_seconds?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "interview_questions";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_evaluations: {
        Row: {
          id: string;
          answer_id: string;
          technical_score: number | null;
          relevance_score: number | null;
          clarity_score: number | null;
          communication_score: number | null;
          problem_solving_score: number | null;
          answer_quality_score: number | null;
          overall_score: number | null;
          verdict: string | null;
          metrics: Json;
          strengths: Json;
          weaknesses: Json;
          missing_points: Json;
          improvement: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          answer_id: string;
          technical_score?: number | null;
          relevance_score?: number | null;
          clarity_score?: number | null;
          communication_score?: number | null;
          problem_solving_score?: number | null;
          answer_quality_score?: number | null;
          overall_score?: number | null;
          verdict?: string | null;
          metrics?: Json;
          strengths?: Json;
          weaknesses?: Json;
          missing_points?: Json;
          improvement?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          answer_id?: string;
          technical_score?: number | null;
          relevance_score?: number | null;
          clarity_score?: number | null;
          communication_score?: number | null;
          problem_solving_score?: number | null;
          answer_quality_score?: number | null;
          overall_score?: number | null;
          verdict?: string | null;
          metrics?: Json;
          strengths?: Json;
          weaknesses?: Json;
          missing_points?: Json;
          improvement?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_evaluations_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: false;
            referencedRelation: "interview_answers";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_reports: {
        Row: {
          id: string;
          session_id: string;
          overall_score: number | null;
          technical_score: number | null;
          communication_score: number | null;
          problem_solving_score: number | null;
          project_score: number | null;
          behavioral_score: number | null;
          strengths: Json;
          weaknesses: Json;
          improvement_areas: Json;
          recommended_topics: Json;
          summary: string | null;
          report: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          overall_score?: number | null;
          technical_score?: number | null;
          communication_score?: number | null;
          problem_solving_score?: number | null;
          project_score?: number | null;
          behavioral_score?: number | null;
          strengths?: Json;
          weaknesses?: Json;
          improvement_areas?: Json;
          recommended_topics?: Json;
          summary?: string | null;
          report?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          overall_score?: number | null;
          technical_score?: number | null;
          communication_score?: number | null;
          problem_solving_score?: number | null;
          project_score?: number | null;
          behavioral_score?: number | null;
          strengths?: Json;
          weaknesses?: Json;
          improvement_areas?: Json;
          recommended_topics?: Json;
          summary?: string | null;
          report?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interview_reports_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "interview_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      blog_status: "draft" | "published" | "scheduled" | "archived";
      comment_status: "pending" | "approved" | "spam";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
