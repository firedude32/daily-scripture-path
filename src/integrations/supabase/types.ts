export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      book_progress: {
        Row: {
          book_id: string
          in_progress_chapters: number[]
          read_throughs: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          in_progress_chapters?: number[]
          read_throughs?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          in_progress_chapters?: number[]
          read_throughs?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          book_id: string
          chapter: number
          created_at: string
          id: string
          note: string | null
          user_id: string
          verse: number | null
        }
        Insert: {
          book_id: string
          chapter: number
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
          verse?: number | null
        }
        Update: {
          book_id?: string
          chapter?: number
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
          verse?: number | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_user_id: string
          requested_by: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_user_id: string
          requested_by: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_user_id?: string
          requested_by?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          id: string
          join_code: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          join_code: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string
          id?: string
          join_code?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number
          daily_goal: number
          email: string
          id: string
          last_read_date: string | null
          longest_streak: number
          name: string
          onboarded: boolean
          path_book_id: string
          progress_view: string
          reminder_time: string
          silver_gold_acknowledged: boolean
          silver_gold_unlocked: boolean
          translation: string
          updated_at: string
          username: string | null
          xp: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          daily_goal?: number
          email: string
          id: string
          last_read_date?: string | null
          longest_streak?: number
          name?: string
          onboarded?: boolean
          path_book_id?: string
          progress_view?: string
          reminder_time?: string
          silver_gold_acknowledged?: boolean
          silver_gold_unlocked?: boolean
          translation?: string
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          daily_goal?: number
          email?: string
          id?: string
          last_read_date?: string | null
          longest_streak?: number
          name?: string
          onboarded?: boolean
          path_book_id?: string
          progress_view?: string
          reminder_time?: string
          silver_gold_acknowledged?: boolean
          silver_gold_unlocked?: boolean
          translation?: string
          updated_at?: string
          username?: string | null
          xp?: number
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_id: string
          chapter: number
          completed_at: string
          duration_sec: number
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          book_id: string
          chapter: number
          completed_at?: string
          duration_sec?: number
          id?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          book_id?: string
          chapter?: number
          completed_at?: string
          duration_sec?: number
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      books_completed_for: { Args: { _user_id: string }; Returns: number }
      is_group_member: {
        Args: { _group_id: string; _user_id: string }
        Returns: boolean
      }
      weekly_chapters_for: { Args: { _user_id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
