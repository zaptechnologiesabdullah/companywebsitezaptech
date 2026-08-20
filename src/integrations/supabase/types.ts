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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string | null
          author_role: string | null
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          publish_date: string | null
          published: boolean
          read_time: string | null
          slug: string
          tags: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          author_role?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          read_time?: string | null
          slug: string
          tags?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          author_role?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          publish_date?: string | null
          published?: boolean
          read_time?: string | null
          slug?: string
          tags?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          id: string
          slot_duration_minutes: number
          updated_at: string
          work_end_time: string
          work_start_time: string
          working_days: number[]
        }
        Insert: {
          id?: string
          slot_duration_minutes?: number
          updated_at?: string
          work_end_time?: string
          work_start_time?: string
          working_days?: number[]
        }
        Update: {
          id?: string
          slot_duration_minutes?: number
          updated_at?: string
          work_end_time?: string
          work_start_time?: string
          working_days?: number[]
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          booking_date: string
          booking_time: string
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          id: string
          meeting_type_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          booking_date: string
          booking_time: string
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          id?: string
          meeting_type_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          booking_date?: string
          booking_time?: string
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          id?: string
          meeting_type_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_meeting_type_id_fkey"
            columns: ["meeting_type_id"]
            isOneToOne: false
            referencedRelation: "meeting_types"
            referencedColumns: ["id"]
          },
        ]
      }
      form_queries: {
        Row: {
          attachment_url: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          project_link: string | null
          status: Database["public"]["Enums"]["query_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          project_link?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          project_link?: string | null
          status?: Database["public"]["Enums"]["query_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      landing_page_form_fields: {
        Row: {
          field_label: string
          field_type: Database["public"]["Enums"]["form_field_type"]
          id: string
          is_required: boolean
          landing_page_id: string
          options: Json | null
          sort_order: number | null
        }
        Insert: {
          field_label: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_required?: boolean
          landing_page_id: string
          options?: Json | null
          sort_order?: number | null
        }
        Update: {
          field_label?: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          id?: string
          is_required?: boolean
          landing_page_id?: string
          options?: Json | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_form_fields_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_sections: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          landing_page_id: string
          section_type: Database["public"]["Enums"]["section_type"]
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          landing_page_id: string
          section_type?: Database["public"]["Enums"]["section_type"]
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          landing_page_id?: string
          section_type?: Database["public"]["Enums"]["section_type"]
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_sections_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_submissions: {
        Row: {
          attachment_urls: Json | null
          created_at: string
          form_data: Json
          id: string
          landing_page_id: string
        }
        Insert: {
          attachment_urls?: Json | null
          created_at?: string
          form_data?: Json
          id?: string
          landing_page_id: string
        }
        Update: {
          attachment_urls?: Json | null
          created_at?: string
          form_data?: Json
          id?: string
          landing_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_submissions_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          meta_description: string | null
          meta_title: string | null
          page_type: Database["public"]["Enums"]["landing_page_type"]
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_type?: Database["public"]["Enums"]["landing_page_type"]
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_type?: Database["public"]["Enums"]["landing_page_type"]
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      managed_links: {
        Row: {
          category: Database["public"]["Enums"]["link_category"]
          created_at: string
          id: string
          name: string
          sort_order: number | null
          target: string | null
          updated_at: string
          url: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["link_category"]
          created_at?: string
          id?: string
          name: string
          sort_order?: number | null
          target?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          category?: Database["public"]["Enums"]["link_category"]
          created_at?: string
          id?: string
          name?: string
          sort_order?: number | null
          target?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      meeting_types: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          category: string | null
          created_at: string
          delivery_time: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean
          name: string
          price: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          name: string
          price: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          delivery_time?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          price?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          download_count: number
          file_url: string | null
          id: string
          is_active: boolean
          landing_page_id: string
          resource_type: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          landing_page_id: string
          resource_type?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          file_url?: string | null
          id?: string
          is_active?: boolean
          landing_page_id?: string
          resource_type?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_download_count: {
        Args: { resource_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      form_field_type:
        | "text"
        | "email"
        | "phone"
        | "textarea"
        | "select"
        | "file"
      landing_page_type:
        | "job"
        | "services"
        | "course_request"
        | "custom"
        | "resource"
      link_category: "header" | "footer" | "external"
      query_status: "new" | "read" | "resolved"
      section_type: "heading" | "text" | "image" | "rich_text" | "faq"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      form_field_type: ["text", "email", "phone", "textarea", "select", "file"],
      landing_page_type: [
        "job",
        "services",
        "course_request",
        "custom",
        "resource",
      ],
      link_category: ["header", "footer", "external"],
      query_status: ["new", "read", "resolved"],
      section_type: ["heading", "text", "image", "rich_text", "faq"],
    },
  },
} as const
