import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Dumbbell } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Workouts: React.FC = () => {
  const { workouts, generateWorkouts } = useWorkout();
  
  const completedWorkoutsCount = workouts.filter(workout => workout.completed).length;
  const totalWorkouts = workouts.length;
  const completionPercentage = totalWorkouts > 0 
    ? Math.floor((completedWorkoutsCount / totalWorkouts) * 100) 
    : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Workouts</h1>
        <button
          onClick={generateWorkouts}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Generate New Workouts
        </button>
      </div>
      
      {workouts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Progress</h2>
          <div className="flex items-center mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{completionPercentage}%</span>
          </div>
          <p className="text-gray-600 text-sm">
            {completedWorkoutsCount} of {totalWorkouts} workouts completed
          </p>
        </div>
      )}
      
      {workouts.length > 0 ? (
        <div className="grid gap-6">
          {workouts.map(workout => (
            <Link 
              key={workout.id}
              to={`/workouts/${workout.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                  <div className="flex items-center">
                    {workout.completed ? (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                        {workout.type}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{Math.ceil(workout.duration / 60)} minutes</span>
                  <span className="mx-2">•</span>
                  <Dumbbell className="h-4 w-4 mr-1" />
                  <span className="text-sm">{workout.exercises.length} exercises</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {workout.exercises.slice(0, 3).map(exercise => (
                    <span 
                      key={exercise.id}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {exercise.name}
                    </span>
                  ))}
                  {workout.exercises.length > 3 && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      +{workout.exercises.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Dumbbell className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Workouts Yet</h2>
          <p className="text-gray-600 mb-6">
            Generate your first set of personalized workouts to get started.
          </p>
          <button
            onClick={generateWorkouts}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Generate Workouts
          </button>
        </div>
      )}
    </div>
  );
};

export default Workouts;