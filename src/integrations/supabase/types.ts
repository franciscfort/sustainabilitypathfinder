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
      app_ratings: {
        Row: {
          comment: string | null
          country: string | null
          created_at: string
          id: string
          rating: number
          session_id: string | null
        }
        Insert: {
          comment?: string | null
          country?: string | null
          created_at?: string
          id?: string
          rating: number
          session_id?: string | null
        }
        Update: {
          comment?: string | null
          country?: string | null
          created_at?: string
          id?: string
          rating?: number
          session_id?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          career_matches: Json
          career_stage: string | null
          country: string | null
          created_at: string
          current_goal: string | null
          current_skills: string[]
          experience_level: string | null
          gender: string | null
          id: string
          passion_areas: string[]
          personality_answers: Json
          recommended_skills: Json
          session_id: string | null
          share_id: string | null
          user_id: string | null
        }
        Insert: {
          career_matches: Json
          career_stage?: string | null
          country?: string | null
          created_at?: string
          current_goal?: string | null
          current_skills: string[]
          experience_level?: string | null
          gender?: string | null
          id?: string
          passion_areas: string[]
          personality_answers: Json
          recommended_skills: Json
          session_id?: string | null
          share_id?: string | null
          user_id?: string | null
        }
        Update: {
          career_matches?: Json
          career_stage?: string | null
          country?: string | null
          created_at?: string
          current_goal?: string | null
          current_skills?: string[]
          experience_level?: string | null
          gender?: string | null
          id?: string
          passion_areas?: string[]
          personality_answers?: Json
          recommended_skills?: Json
          session_id?: string | null
          share_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          assessment_id: string | null
          country: string | null
          created_at: string
          email: string
          id: string
          session_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          country?: string | null
          created_at?: string
          email: string
          id?: string
          session_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_captures_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          _max_requests?: number
          _session_id: string
          _table_name: string
          _window_minutes?: number
        }
        Returns: boolean
      }
      create_assessment:
        | {
            Args: {
              _career_matches: Json
              _current_skills: string[]
              _passion_areas: string[]
              _personality_answers: Json
              _recommended_skills: Json
              _session_id: string
            }
            Returns: {
              id: string
              share_id: string
            }[]
          }
        | {
            Args: {
              _career_matches: Json
              _current_skills: string[]
              _gender?: string
              _passion_areas: string[]
              _personality_answers: Json
              _recommended_skills: Json
              _session_id: string
            }
            Returns: {
              id: string
              share_id: string
            }[]
          }
        | {
            Args: {
              _career_matches: Json
              _country?: string
              _current_skills: string[]
              _gender?: string
              _passion_areas: string[]
              _personality_answers: Json
              _recommended_skills: Json
              _session_id: string
            }
            Returns: {
              id: string
              share_id: string
            }[]
          }
        | {
            Args: {
              _career_matches: Json
              _career_stage?: string
              _country?: string
              _current_goal?: string
              _current_skills: string[]
              _experience_level?: string
              _gender?: string
              _passion_areas: string[]
              _personality_answers: Json
              _recommended_skills: Json
              _session_id: string
            }
            Returns: {
              id: string
              share_id: string
            }[]
          }
      get_assessment_by_share_id: {
        Args: { _share_id: string }
        Returns: {
          career_matches: Json
          created_at: string
          current_skills: string[]
          id: string
          passion_areas: string[]
          personality_answers: Json
          recommended_skills: Json
          share_id: string
        }[]
      }
      get_country_stats: {
        Args: never
        Returns: {
          count: number
          country: string
        }[]
      }
      get_public_ratings: {
        Args: { _limit?: number }
        Returns: {
          comment: string
          created_at: string
          rating: number
        }[]
      }
      get_recent_assessments: {
        Args: { _limit?: number; _session_id: string }
        Returns: {
          career_matches: Json
          career_stage: string | null
          country: string | null
          created_at: string
          current_goal: string | null
          current_skills: string[]
          experience_level: string | null
          gender: string | null
          id: string
          passion_areas: string[]
          personality_answers: Json
          recommended_skills: Json
          session_id: string | null
          share_id: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "assessments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_total_assessments: { Args: never; Returns: number }
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
