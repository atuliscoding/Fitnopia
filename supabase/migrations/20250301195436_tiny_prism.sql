/*
  # Create initial schema for FitAI app

  1. New Tables
    - `user_profiles` - Stores user profile information
    - `workouts` - Stores workout information
    - `exercises` - Stores exercise information
    - `progress` - Stores workout progress information
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  height NUMERIC NOT NULL,
  weight NUMERIC NOT NULL,
  fitness_level TEXT NOT NULL,
  fitness_goals TEXT[] NOT NULL,
  workout_frequency INTEGER NOT NULL,
  health_conditions TEXT[] NOT NULL,
  equipment_access TEXT[] NOT NULL,
  workout_duration INTEGER NOT NULL,
  workout_time TEXT NOT NULL,
  rest_days TEXT[] NOT NULL,
  focus_areas TEXT[] NOT NULL,
  diet_preference TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  sets INTEGER,
  reps INTEGER,
  muscle TEXT,
  equipment TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  rating INTEGER,
  weight NUMERIC,
  exercise_time_spent JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for workouts
CREATE POLICY "Users can view their own workouts"
  ON workouts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workouts"
  ON workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workouts"
  ON workouts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workouts"
  ON workouts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for exercises
CREATE POLICY "Users can view exercises for their workouts"
  ON exercises
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert exercises for their workouts"
  ON exercises
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update exercises for their workouts"
  ON exercises
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  ));

-- Create policies for progress
CREATE POLICY "Users can view their own progress"
  ON progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_workout_id ON progress(workout_id);