export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number
          created_at: string
          title: string
          description: string
          date: string
          location: string
          image: string | null
          price: string
          category: string
          creator_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          description: string
          date: string
          location: string
          image?: string | null
          price: string
          category: string
          creator_id: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          description?: string
          date?: string
          location?: string
          image?: string | null
          price?: string
          category?: string
          creator_id?: string
        }
      }
    }
  }
} 