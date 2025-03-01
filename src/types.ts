export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals: string[];
  workoutFrequency: number;
  healthConditions: string[];
  equipmentAccess: string[];
  workoutDuration: number; // Preferred workout duration in minutes
  workoutTime: string; // Preferred time of day
  restDays: string[]; // Preferred rest days
  focusAreas: string[]; // Body areas to focus on
  dietPreference: string; // Diet preference
}

export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  duration: number;
  sets?: number;
  reps?: number;
  muscle?: string;
  equipment: string;
  instructions: string;
  imageUrl?: string; // URL to exercise demonstration image
  videoUrl?: string; // URL to exercise demonstration video
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  exercises: Exercise[];
  completed: boolean;
  difficulty: string;
}

export interface ProgressEntry {
  id: string;
  date: string;
  workoutId: string;
  workoutName: string;
  completed: boolean;
  notes?: string;
  rating?: number;
  weight?: number;
  exerciseTimeSpent?: Record<string, number>; // Track time spent on each exercise
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}