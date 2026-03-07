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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      class_students: {
        Row: {
          class_id: string
          created_at: string
          id: string
          student_email: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          student_email: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          student_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "staff_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempt_logs: {
        Row: {
          attempt_time: string
          email_or_username: string
          id: string
          ip_address: string | null
          success: boolean
        }
        Insert: {
          attempt_time?: string
          email_or_username: string
          id?: string
          ip_address?: string | null
          success?: boolean
        }
        Update: {
          attempt_time?: string
          email_or_username?: string
          id?: string
          ip_address?: string | null
          success?: boolean
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          purpose: string
          used: boolean
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          purpose?: string
          used?: boolean
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          purpose?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          locked_until: string | null
          login_attempts: number
          phone_number: string | null
          role_confirmed: boolean
          updated_at: string
          user_id: string
          user_type: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          locked_until?: string | null
          login_attempts?: number
          phone_number?: string | null
          role_confirmed?: boolean
          updated_at?: string
          user_id: string
          user_type?: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          locked_until?: string | null
          login_attempts?: number
          phone_number?: string | null
          role_confirmed?: boolean
          updated_at?: string
          user_id?: string
          user_type?: string
          username?: string
        }
        Relationships: []
      }
      staff_classes: {
        Row: {
          class_name: string
          created_at: string
          id: string
          staff_user_id: string
        }
        Insert: {
          class_name: string
          created_at?: string
          id?: string
          staff_user_id: string
        }
        Update: {
          class_name?: string
          created_at?: string
          id?: string
          staff_user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          answers: Json | null
          career_path: string
          created_at: string
          duration_seconds: number | null
          feedback: string | null
          id: string
          recommended_paths: string[] | null
          simulation_score: number
          theory_score: number
          total_score: number
          user_id: string
        }
        Insert: {
          answers?: Json | null
          career_path: string
          created_at?: string
          duration_seconds?: number | null
          feedback?: string | null
          id?: string
          recommended_paths?: string[] | null
          simulation_score?: number
          theory_score?: number
          total_score?: number
          user_id: string
        }
        Update: {
          answers?: Json | null
          career_path?: string
          created_at?: string
          duration_seconds?: number | null
          feedback?: string | null
          id?: string
          recommended_paths?: string[] | null
          simulation_score?: number
          theory_score?: number
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: { Args: never; Returns: undefined }
      get_profile_security: {
        Args: { p_email: string }
        Returns: {
          locked_until: string
          login_attempts: number
          user_id: string
        }[]
      }
      get_student_by_email: {
        Args: { p_email: string }
        Returns: {
          email: string
          full_name: string
          user_id: string
          username: string
        }[]
      }
      get_student_results: {
        Args: { p_user_id: string }
        Returns: {
          answers: Json | null
          career_path: string
          created_at: string
          duration_seconds: number | null
          feedback: string | null
          id: string
          recommended_paths: string[] | null
          simulation_score: number
          theory_score: number
          total_score: number
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "test_results"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      is_username_taken: { Args: { p_username: string }; Returns: boolean }
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
