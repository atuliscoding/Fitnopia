import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Workout, Exercise, ProgressEntry } from '../types';
import { useAuth } from './AuthContext';
import { mongodb } from '../lib/mongodb';

// Define the shape of our context
interface WorkoutContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => Promise<void>;
  workouts: Workout[];
  completedWorkouts: number;
  experiencePoints: number;
  level: number;
  progress: ProgressEntry[];
  generateWorkouts: () => Promise<void>;
  completeWorkout: (id: string) => Promise<void>;
  updateProgress: (entry: ProgressEntry) => Promise<void>;
  exerciseDatabase: Omit<Exercise, 'id'>[]; // Expose exercise database to components
}

// Create the context
const WorkoutContext = createContext<WorkoutContextType | null>(null);

// Provider component
export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [experiencePoints, setExperiencePoints] = useState<number>(0);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [exerciseDatabase, setExerciseDatabase] = useState<Omit<Exercise, 'id'>[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(true);
  
  // Calculate level based on XP
  const level = Math.floor(Math.sqrt(experiencePoints / 100)) + 1;
  
  // Count completed workouts
  const completedWorkouts = workouts.filter(workout => workout.completed).length;
  
  // Load user profile and data from database
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadWorkouts();
      loadProgress();
      loadExerciseDatabase();
    } else {
      // Clear data when user logs out
      setUserProfileState(null);
      setWorkouts([]);
      setExperiencePoints(0);
      setProgress([]);
    }
  }, [user]);
  
  // Load exercise database from MongoDB
  const loadExerciseDatabase = async () => {
    setIsLoadingExercises(true);
    try {
      const exercises = await mongodb.exercises.findAll();
      
      if (exercises && exercises.length > 0) {
        const formattedExercises = exercises.map((ex: any) => ({
          name: ex.name,
          type: ex.type as 'strength' | 'cardio' | 'flexibility',
          duration: ex.duration,
          sets: ex.sets || undefined,
          reps: ex.reps || undefined,
          muscle: ex.muscle || undefined,
          equipment: ex.equipment,
          instructions: ex.instructions,
          imageUrl: ex.imageUrl || undefined,
          videoUrl: ex.videoUrl || undefined
        }));
        
        setExerciseDatabase(formattedExercises);
        console.log(`Loaded ${formattedExercises.length} exercises from MongoDB`);
      } else {
        console.log('No exercises found in MongoDB, using fallback data');
        // If no exercises in MongoDB, use fallback data
        setExerciseDatabase(fallbackExerciseDatabase);
      }
    } catch (error) {
      console.error('Error loading exercise database from MongoDB:', error);
      // Use fallback data if MongoDB fails
      setExerciseDatabase(fallbackExerciseDatabase);
    } finally {
      setIsLoadingExercises(false);
    }
  };
  
  // Load user profile from database
  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // Only log as error if it's not a "no rows found" error
        if (error.code !== 'PGRST116') {
          console.error('Error loading user profile:', error);
        } else {
          console.log('No user profile found, user needs to create one');
        }
        return;
      }
      
      if (data) {
        setUserProfileState({
          id: data.id,
          name: data.name,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          fitnessLevel: data.fitness_level as 'beginner' | 'intermediate' | 'advanced',
          fitnessGoals: data.fitness_goals,
          workoutFrequency: data.workout_frequency,
          healthConditions: data.health_conditions,
          equipmentAccess: data.equipment_access,
          workoutDuration: data.workout_duration,
          workoutTime: data.workout_time,
          restDays: data.rest_days,
          focusAreas: data.focus_areas,
          dietPreference: data.diet_preference
        });
      }
    } catch (error) {
      console.error('Exception loading user profile:', error);
    }
  };
  
  // Load workouts from database
  const loadWorkouts = async () => {
    if (!user) return;
    
    try {
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);
      
      if (workoutsError) {
        console.error('Error loading workouts:', workoutsError);
        return;
      }
      
      if (workoutsData && workoutsData.length > 0) {
        const workoutsWithExercises: Workout[] = [];
        
        for (const workoutData of workoutsData) {
          const { data: exercisesData, error: exercisesError } = await supabase
            .from('exercises')
            .select('*')
            .eq('workout_id', workoutData.id);
          
          if (exercisesError) {
            console.error('Error loading exercises:', exercisesError);
            continue;
          }
          
          const exercises: Exercise[] = exercisesData?.map(ex => ({
            id: ex.id,
            name: ex.name,
            type: ex.type as 'strength' | 'cardio' | 'flexibility',
            duration: ex.duration,
            sets: ex.sets || undefined,
            reps: ex.reps || undefined,
            muscle: ex.muscle || undefined,
            equipment: ex.equipment,
            instructions: ex.instructions,
            imageUrl: ex.image_url || undefined,
            videoUrl: ex.video_url || undefined
          })) || [];
          
          workoutsWithExercises.push({
            id: workoutData.id,
            name: workoutData.name,
            type: workoutData.type,
            duration: workoutData.duration,
            difficulty: workoutData.difficulty,
            completed: workoutData.completed,
            exercises: exercises
          });
        }
        
        setWorkouts(workoutsWithExercises);
        
        // Calculate XP based on completed workouts (100 XP per workout)
        const completedCount = workoutsWithExercises.filter(w => w.completed).length;
        setExperiencePoints(completedCount * 100);
      }
    } catch (error) {
      console.error('Exception loading workouts:', error);
    }
  };
  
  // Load progress from database
  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error loading progress:', error);
        return;
      }
      
      if (data) {
        const progressEntries: ProgressEntry[] = data.map(entry => ({
          id: entry.id,
          date: entry.date,
          workoutId: entry.workout_id,
          workoutName: entry.workout_name,
          completed: entry.completed,
          notes: entry.notes || undefined,
          rating: entry.rating || undefined,
          weight: entry.weight || undefined,
          exerciseTimeSpent: entry.exercise_time_spent as Record<string, number> || undefined
        }));
        
        setProgress(progressEntries);
      }
    } catch (error) {
      console.error('Exception loading progress:', error);
    }
  };
  
  // Save user profile to database
  const setUserProfile = async (profile: UserProfile) => {
    if (!user) return;
    
    try {
      // Check if profile already exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error checking user profile:', error);
        return;
      }
      
      if (data) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight,
            fitness_level: profile.fitnessLevel,
            fitness_goals: profile.fitnessGoals,
            workout_frequency: profile.workoutFrequency,
            health_conditions: profile.healthConditions,
            equipment_access: profile.equipmentAccess,
            workout_duration: profile.workoutDuration,
            workout_time: profile.workoutTime,
            rest_days: profile.restDays,
            focus_areas: profile.focusAreas,
            diet_preference: profile.dietPreference,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
        
        if (updateError) {
          console.error('Error updating user profile:', updateError);
          return;
        }
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight,
            fitness_level: profile.fitnessLevel,
            fitness_goals: profile.fitnessGoals,
            workout_frequency: profile.workoutFrequency,
            health_conditions: profile.healthConditions,
            equipment_access: profile.equipmentAccess,
            workout_duration: profile.workoutDuration,
            workout_time: profile.workoutTime,
            rest_days: profile.restDays,
            focus_areas: profile.focusAreas,
            diet_preference: profile.dietPreference,
            user_id: user.id
          });
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return;
        }
      }
      
      setUserProfileState(profile);
    } catch (error) {
      console.error('Exception setting user profile:', error);
    }
  };
  
  // Generate workouts based on user profile
  const generateWorkouts = async () => {
    if (!user || !userProfile) return;
    
    try {
      // Wait for exercise database to load if it's still loading
      if (isLoadingExercises) {
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (!isLoadingExercises) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 100);
        });
      }
      
      const newWorkouts: Workout[] = [];
      const workoutTypes = ['strength', 'cardio', 'flexibility', 'full-body'];
      
      // Generate 5 workouts
      for (let i = 0; i < 5; i++) {
        const workoutType = workoutTypes[i % workoutTypes.length];
        const workoutExercises: Exercise[] = [];
        
        // Select 5-8 exercises for each workout
        const exerciseCount = Math.floor(Math.random() * 4) + 5;
        
        // Filter exercises based on workout type and equipment
        const availableExercises = exerciseDatabase.filter(ex => {
          // For strength workouts, include strength exercises
          if (workoutType === 'strength' && ex.type === 'strength') return true;
          
          // For cardio workouts, include cardio exercises
          if (workoutType === 'cardio' && ex.type === 'cardio') return true;
          
          // For flexibility workouts, include flexibility exercises
          if (workoutType === 'flexibility' && ex.type === 'flexibility') return true;
          
          // For full-body workouts, include all types
          if (workoutType === 'full-body') return true;
          
          return false;
        });
        
        // Randomly select exercises
        for (let j = 0; j < exerciseCount; j++) {
          if (availableExercises.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableExercises.length);
            const exercise = { ...availableExercises[randomIndex] };
            
            // Generate a unique ID for this instance
            exercise.id = `ex-${Date.now()}-${j}`;
            
            workoutExercises.push(exercise as Exercise);
            
            // Remove the selected exercise to avoid duplicates
            availableExercises.splice(randomIndex, 1);
          }
        }
        
        // Calculate total duration
        const totalDuration = workoutExercises.reduce((total, ex) => {
          if (ex.type === 'strength') {
            // Estimate 45 seconds per set
            return total + (ex.sets || 1) * (ex.reps || 1) * 45;
          } else {
            return total + (ex.duration || 60);
          }
        }, 0);
        
        // Create the workout
        const workout: Workout = {
          id: `workout-${Date.now()}-${i}`,
          name: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout ${i + 1}`,
          type: workoutType,
          duration: totalDuration,
          exercises: workoutExercises,
          completed: false,
          difficulty: userProfile.fitnessLevel
        };
        
        newWorkouts.push(workout);
        
        try {
          // Save workout to database
          const { data: workoutData, error: workoutError } = await supabase
            .from('workouts')
            .insert({
              name: workout.name,
              type: workout.type,
              duration: workout.duration,
              difficulty: workout.difficulty,
              completed: workout.completed,
              user_id: user.id
            })
            .select('id')
            .single();
          
          if (workoutError) {
            console.error('Error creating workout:', workoutError);
            continue;
          }
          
          if (workoutData) {
            // Update workout ID with database ID
            workout.id = workoutData.id;
            
            // Save exercises to database
            for (const exercise of workout.exercises) {
              const { error: exerciseError } = await supabase
                .from('exercises')
                .insert({
                  workout_id: workout.id,
                  name: exercise.name,
                  type: exercise.type,
                  duration: exercise.duration,
                  sets: exercise.sets || null,
                  reps: exercise.reps || null,
                  muscle: exercise.muscle || null,
                  equipment: exercise.equipment,
                  instructions: exercise.instructions,
                  image_url: exercise.imageUrl || null,
                  video_url: exercise.videoUrl || null
                });
              
              if (exerciseError) {
                console.error('Error creating exercise:', exerciseError);
              }
            }
          }
        } catch (error) {
          console.error('Exception saving workout:', error);
        }
      }
      
      setWorkouts(newWorkouts);
    } catch (error) {
      console.error('Exception generating workouts:', error);
    }
  };
  
  // Mark a workout as completed
  const completeWorkout = async (id: string) => {
    if (!user) return;
    
    try {
      // Find the workout in our local state first to verify it exists
      const workoutToComplete = workouts.find(w => w.id === id);
      if (!workoutToComplete) {
        console.log('Workout not found in local state:', id);
        return;
      }
      
      // Update workout in database
      const { error } = await supabase
        .from('workouts')
        .update({ completed: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error completing workout:', error);
        return;
      }
      
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === id 
            ? { ...workout, completed: true } 
            : workout
        )
      );
      
      // Award XP for completing a workout
      setExperiencePoints(prev => prev + 100);
    } catch (error) {
      console.error('Exception completing workout:', error);
    }
  };
  
  // Add a progress entry
  const updateProgress = async (entry: ProgressEntry) => {
    if (!user) return;
    
    try {
      // Save progress to database
      const { data, error } = await supabase
        .from('progress')
        .insert({
          date: entry.date,
          workout_id: entry.workoutId,
          workout_name: entry.workoutName,
          completed: entry.completed,
          notes: entry.notes || null,
          rating: entry.rating || null,
          weight: entry.weight || null,
          exercise_time_spent: entry.exerciseTimeSpent || null,
          user_id: user.id
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating progress entry:', error);
        return;
      }
      
      if (data) {
        setProgress(prev => [{ ...entry, id: data.id }, ...prev]);
      }
    } catch (error) {
      console.error('Exception updating progress:', error);
    }
  };
  
  return (
    <WorkoutContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile, 
        workouts, 
        completedWorkouts,
        experiencePoints,
        level,
        progress,
        generateWorkouts,
        completeWorkout,
        updateProgress,
        exerciseDatabase
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

// Fallback exercise database in case MongoDB is not available
const fallbackExerciseDatabase: Omit<Exercise, 'id'>[] = [
  // Strength exercises
  {
    name: 'Push-ups',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: 'chest',
    equipment: 'none',
    instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
  },
  {
    name: 'Squats',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 12,
    muscle: 'legs',
    equipment: 'none',
    instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back as if sitting in a chair. Keep your chest up and back straight.',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ'
  },
  // Cardio exercises
  {
    name: 'Jumping Jacks',
    type: 'cardio',
    duration: 120,
    equipment: 'none',
    instructions: 'Start with feet together and arms at your sides. Jump to a position with legs spread and arms overhead, then jump back to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8'
  },
  // Flexibility exercises
  {
    name: 'Hamstring Stretch',
    type: 'flexibility',
    duration: 60,
    equipment: 'none',
    instructions: 'Sit on the floor with one leg extended and the other bent with the sole of the foot against the inner thigh. Reach toward the toes of the extended leg.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/FDwpEdxZ4H4'
  }
];