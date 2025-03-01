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
      user_profiles: {
        Row: {
          id: string
          name: string
          age: number
          gender: string
          height: number
          weight: number
          fitness_level: string
          fitness_goals: string[]
          workout_frequency: number
          health_conditions: string[]
          equipment_access: string[]
          workout_duration: number
          workout_time: string
          rest_days: string[]
          focus_areas: string[]
          diet_preference: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          gender: string
          height: number
          weight: number
          fitness_level: string
          fitness_goals: string[]
          workout_frequency: number
          health_conditions: string[]
          equipment_access: string[]
          workout_duration: number
          workout_time: string
          rest_days: string[]
          focus_areas: string[]
          diet_preference: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          gender?: string
          height?: number
          weight?: number
          fitness_level?: string
          fitness_goals?: string[]
          workout_frequency?: number
          health_conditions?: string[]
          equipment_access?: string[]
          workout_duration?: number
          workout_time?: string
          rest_days?: string[]
          focus_areas?: string[]
          diet_preference?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      workouts: {
        Row: {
          id: string
          name: string
          type: string
          duration: number
          difficulty: string
          completed: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          duration: number
          difficulty: string
          completed: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          duration?: number
          difficulty?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          type: string
          duration: number
          sets: number | null
          reps: number | null
          muscle: string | null
          equipment: string
          instructions: string
          image_url: string | null
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          type: string
          duration: number
          sets?: number | null
          reps?: number | null
          muscle?: string | null
          equipment: string
          instructions: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          type?: string
          duration?: number
          sets?: number | null
          reps?: number | null
          muscle?: string | null
          equipment?: string
          instructions?: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          date: string
          workout_id: string
          workout_name: string
          completed: boolean
          notes: string | null
          rating: number | null
          weight: number | null
          exercise_time_spent: Json | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          date: string
          workout_id: string
          workout_name: string
          completed: boolean
          notes?: string | null
          rating?: number | null
          weight?: number | null
          exercise_time_spent?: Json | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          date?: string
          workout_id?: string
          workout_name?: string
          completed?: boolean
          notes?: string | null
          rating?: number | null
          weight?: number | null
          exercise_time_spent?: Json | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}