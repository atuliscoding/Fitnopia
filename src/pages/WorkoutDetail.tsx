import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Award, Info, Play } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { ProgressEntry } from '../types';
import ExerciseTimer from '../components/ExerciseTimer';
import ExerciseVideo from '../components/ExerciseVideo';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, completeWorkout, updateProgress } = useWorkout();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [exerciseTimeSpent, setExerciseTimeSpent] = useState<Record<string, number>>({});
  const [canProceed, setCanProceed] = useState(false);
  const [isRestPeriod, setIsRestPeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const workout = workouts.find(w => w.id === id);
  
  useEffect(() => {
    // Set loading to false once workouts are loaded
    if (workouts.length > 0) {
      setLoading(false);
    }
    
    // Check if the workout exists
    if (!loading && !workout && id) {
      setError(`Workout with ID ${id} not found`);
    }
  }, [workouts, workout, id, loading]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (error || !workout) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Workout Not Found</h1>
        <p className="text-gray-600 mb-6">
          {error || "We couldn't find the workout you're looking for."}
        </p>
        <button
          onClick={() => navigate('/workouts')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Back to Workouts
        </button>
      </div>
    );
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
  
  const startWorkout = () => {
    setWorkoutStarted(true);
    setShowTimer(true);
  };
  
  const nextExercise = () => {
    if (isRestPeriod) {
      setIsRestPeriod(false);
      setCanProceed(false);
      return;
    }
    
    if (isLastExercise) {
      setWorkoutCompleted(true);
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowInstructions(false);
      setShowTimer(true);
      setCanProceed(false);
      
      // Add rest period between exercises
      if (!isLastExercise) {
        setIsRestPeriod(true);
      }
    }
  };
  
  const prevExercise = () => {
    if (isRestPeriod) {
      setIsRestPeriod(false);
      return;
    }
    
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setShowInstructions(false);
      setShowTimer(true);
      setCanProceed(false);
    }
  };
  
  const handleCompleteWorkout = async () => {
    try {
      await completeWorkout(workout.id);
      
      const progressEntry: ProgressEntry = {
        id: `progress-${Date.now()}`,
        date: new Date().toISOString(),
        workoutId: workout.id,
        workoutName: workout.name,
        completed: true,
        notes: notes,
        rating: rating,
        exerciseTimeSpent: exerciseTimeSpent
      };
      
      await updateProgress(progressEntry);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing workout:', error);
      // Show error message to user
      alert('There was an error completing your workout. Please try again.');
    }
  };
  
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  
  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };
  
  const handleTimerComplete = () => {
    setCanProceed(true);
  };
  
  const handleSkipExercise = () => {
    if (isRestPeriod) {
      setIsRestPeriod(false);
      setCanProceed(false);
    } else {
      setCanProceed(true);
    }
  };
  
  const handleTimeSpent = (time: number) => {
    if (!isRestPeriod) {
      setExerciseTimeSpent(prev => ({
        ...prev,
        [currentExercise.id]: time
      }));
    }
    setCanProceed(true);
  };
  
  if (workoutCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Workout Completed!</h1>
          <p className="text-gray-600">
            Great job! You've completed the {workout.name.toLowerCase()}.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Award className="h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">
            You've earned XP!
          </p>
          <p className="text-gray-600">
            Keep completing workouts to level up.
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">How was your workout?</h2>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  rating >= star ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700 mb-1 text-left">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="How did you feel? Any challenges?"
            />
          </div>
        </div>
        
        <button
          onClick={handleCompleteWorkout}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Save & Continue
        </button>
      </div>
    );
  }
  
  if (!workoutStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/workouts')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Workouts
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{workout.name}</h1>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                {workout.type}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-6">
              <Clock className="h-5 w-5 mr-2" />
              <span>{Math.ceil(workout.duration / 60)} minutes</span>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Exercises</h2>
            <div className="space-y-4 mb-8">
              {workout.exercises.map((exercise, index) => (
                <div key={exercise.id} className="flex items-start">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                    <p className="text-sm text-gray-600">
                      {exercise.type === 'strength' 
                        ? `${exercise.sets} sets × ${exercise.reps} reps` 
                        : `${Math.floor(exercise.duration / 60)} minutes`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">Workout Tips</h3>
              <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                <li>Make sure to read the instructions for each exercise</li>
                <li>Take the rest periods between exercises to recover</li>
                <li>Stay hydrated throughout your workout</li>
                <li>Focus on proper form rather than speed</li>
                <li>If an exercise is too difficult, modify it to your ability</li>
              </ul>
            </div>
            
            <button
              onClick={startWorkout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              Start Workout
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`${isRestPeriod ? 'bg-green-600' : 'bg-indigo-600'} text-white p-6`}>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{workout.name}</h1>
            <div className="text-sm">
              {isRestPeriod 
                ? `Rest before exercise ${currentExerciseIndex + 1}` 
                : `Exercise ${currentExerciseIndex + 1} of ${workout.exercises.length}`}
            </div>
          </div>
          <div className="w-full bg-opacity-30 bg-white rounded-full h-1.5 mt-3">
            <div 
              className="bg-white h-1.5 rounded-full" 
              style={{ width: `${((currentExerciseIndex + (isRestPeriod ? 0.5 : 1)) / workout.exercises.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="p-6">
          {isRestPeriod ? (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-2">Rest Period</h2>
              <p className="text-gray-600 mb-4">
                Take a moment to recover before the next exercise: <span className="font-semibold">{currentExercise.name}</span>
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-green-800 mb-2">During Rest</h3>
                <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                  <li>Take deep breaths to regulate your breathing</li>
                  <li>Hydrate with small sips of water</li>
                  <li>Gently shake out your muscles to prevent stiffness</li>
                  <li>Mentally prepare for the next exercise</li>
                </ul>
              </div>
              
              <div className="flex justify-center my-6">
                <ExerciseTimer 
                  duration={30} // 30 seconds rest
                  onComplete={handleTimerComplete}
                  onSkip={handleSkipExercise}
                  onTimeSpent={handleTimeSpent}
                  isRest={true}
                  exerciseName="Rest Period"
                  instructions="Take deep breaths and recover before the next exercise. Use this time to hydrate and mentally prepare."
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentExercise.name}</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  {currentExercise.type}
                </span>
                {currentExercise.muscle && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                    {currentExercise.muscle}
                  </span>
                )}
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                  {currentExercise.equipment}
                </span>
              </div>
              
              {currentExercise.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img 
                    src={currentExercise.imageUrl} 
                    alt={currentExercise.name} 
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              <div className="mb-6">
                {currentExercise.type === 'strength' && (
                  <div className="text-lg text-gray-800 mb-2">
                    <span className="font-bold">{currentExercise.sets} sets</span> × <span className="font-bold">{currentExercise.reps} reps</span>
                  </div>
                )}
                {(currentExercise.type === 'cardio' || currentExercise.type === 'flexibility') && (
                  <div className="text-lg text-gray-800 mb-2">
                    <span className="font-bold">{Math.floor(currentExercise.duration / 60)} minutes</span>
                  </div>
                )}
                
                <div className="flex space-x-3 mb-4">
                  <button
                    onClick={toggleInstructions}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
                  </button>
                  
                  {currentExercise.videoUrl && (
                    <ExerciseVideo 
                      videoUrl={currentExercise.videoUrl} 
                      title={currentExercise.name} 
                    />
                  )}
                </div>
                
                {showInstructions && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-700">{currentExercise.instructions}</p>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-800 mb-1">Tips:</h4>
                      <ul className="list-disc list-inside text-gray-700 text-sm">
                        {currentExercise.type === 'strength' && (
                          <>
                            <li>Maintain proper form throughout the exercise</li>
                            <li>Breathe out during the exertion phase</li>
                            <li>Control the movement, avoid using momentum</li>
                            <li>Rest 60-90 seconds between sets</li>
                          </>
                        )}
                        {currentExercise.type === 'cardio' && (
                          <>
                            <li>Start at a comfortable pace and gradually increase intensity</li>
                            <li>Focus on maintaining consistent breathing</li>
                            <li>Stay hydrated throughout the exercise</li>
                            <li>Modify intensity based on your fitness level</li>
                          </>
                        )}
                        {currentExercise.type === 'flexibility' && (
                          <>
                            <li>Stretch to the point of tension, not pain</li>
                            <li>Hold each stretch without bouncing</li>
                            <li>Breathe deeply and relax into the stretch</li>
                            <li>Focus on the muscle being stretched</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
                
                {showTimer && (
                  <div className="flex justify-center my-6">
                    <ExerciseTimer 
                      duration={currentExercise.duration} 
                      onComplete={handleTimerComplete}
                      onSkip={handleSkipExercise}
                      onTimeSpent={handleTimeSpent}
                      exerciseName={currentExercise.name}
                      instructions={currentExercise.instructions}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-between mt-8">
            <button
              onClick={prevExercise}
              disabled={currentExerciseIndex === 0 && !isRestPeriod}
              className={`flex items-center px-4 py-2 rounded ${
                currentExerciseIndex === 0 && !isRestPeriod
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            <button
              onClick={nextExercise}
              disabled={!canProceed && !isRestPeriod && (currentExercise.type === 'cardio' || currentExercise.type === 'flexibility')}
              className={`flex items-center px-4 py-2 ${
                !canProceed && !isRestPeriod && (currentExercise.type === 'cardio' || currentExercise.type === 'flexibility')
                  ? 'bg-gray-300 cursor-not-allowed'
                  : isRestPeriod 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } rounded`}
            >
              {isRestPeriod 
                ? 'Start Next Exercise' 
                : isLastExercise 
                  ? 'Complete Workout' 
                  : 'Next Exercise'}
              {!isLastExercise && !isRestPeriod && <ChevronRight className="h-5 w-5 ml-1" />}
            </button>
          </div>
          
          {(currentExercise.type === 'cardio' || currentExercise.type === 'flexibility') && !canProceed && !showTimer && !isRestPeriod && (
            <div className="text-center mt-4 text-yellow-600">
              <p>Please start and complete the exercise timer to proceed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;