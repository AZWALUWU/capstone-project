export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: number
          title: string
          content: string
          excerpt: string
          category: string
          image_url: string | null
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          excerpt: string
          category: string
          image_url?: string | null
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          excerpt?: string
          category?: string
          image_url?: string | null
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      diagnosis_history: {
        Row: {
          id: number
          user_id: string
          condition: string
          symptoms: string
          severity: string
          duration: string
          confidence: number
          recommendations: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          condition: string
          symptoms: string
          severity: string
          duration: string
          confidence: number
          recommendations?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          condition?: string
          symptoms?: string
          severity?: string
          duration?: string
          confidence?: number
          recommendations?: string | null
          created_at?: string
        }
      }
      guides: {
        Row: {
          id: number
          title: string
          description: string
          content: Json
          category: string
          difficulty: string
          time: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          content: Json
          category: string
          difficulty: string
          time?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          content?: Json
          category?: string
          difficulty?: string
          time?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_guides: {
        Row: {
          id: number
          user_id: string
          guide_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          guide_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          guide_id?: number
          created_at?: string
        }
      }
    }
  }
}

