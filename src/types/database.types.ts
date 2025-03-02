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
        }
      }
    }
  }
}