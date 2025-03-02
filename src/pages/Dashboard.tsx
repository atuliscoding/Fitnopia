import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Award, TrendingUp, Calendar } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    userProfile, 
    workouts, 
    completedWorkouts, 
    experiencePoints, 
    level,
    generateWorkouts 
  } = useWorkout();
  
  // Redirect to questionnaire if no user profile
  useEffect(() => {
    if (!userProfile) {
      navigate('/questionnaire');
    }
  }, [userProfile, navigate]);
  
  // Generate workouts if none exist
  useEffect(() => {
    if (userProfile && workouts.length === 0) {
      generateWorkouts();
    }
  }, [userProfile, workouts, generateWorkouts]);
  
  // Calculate next level XP
  const currentLevelXP = (level - 1) * (level - 1) * 100;
  const nextLevelXP = level * level * 100;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const currentLevelProgress = experiencePoints - currentLevelXP;
  const progressPercentage = Math.floor((currentLevelProgress / xpForNextLevel) * 100);
  
  // Get next workout
  const nextWorkout = workouts.find(workout => !workout.completed);
  
  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {userProfile.name}!</h1>
            <p className="text-gray-600">Let's continue your fitness journey</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Level</p>
              <p className="text-xl font-bold text-indigo-700">Level {level}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>XP: {experiencePoints}</span>
            <span>{xpForNextLevel - currentLevelProgress} XP to Level {level + 1}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Dumbbell className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Workouts</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{completedWorkouts}</p>
          <p className="text-gray-600">Completed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">{experiencePoints}</p>
          <p className="text-gray-600">Total XP</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Streak</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800 mb-1">0</p>
          <p className="text-gray-600">Current streak</p>
        </div>
      </div>
      
      {nextWorkout ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Next Workout</h2>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-indigo-700">{nextWorkout.name}</h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded capitalize">
                {nextWorkout.type}
              </span>
            </div>
            <p className="text-gray-600 mb-3">
              Duration: {Math.ceil(nextWorkout.duration / 60)} minutes • {nextWorkout.exercises.length} exercises
            </p>
            <Link 
              to={`/workouts/${nextWorkout.id}`}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
            >
              Start Workout
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Workouts Completed!</h2>
          <p className="text-gray-600 mb-4">
            Great job! You've completed all your workouts. Generate new workouts to continue your fitness journey.
          </p>
          <button 
            onClick={generateWorkouts}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Generate New Workouts
          </button>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          to="/workouts"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center mb-3">
            <Dumbbell className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">All Workouts</h2>
          </div>
          <p className="text-gray-600">
            View all your personalized workouts
          </p>
        </Link>
        
        <Link 
          to="/progress"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center mb-3">
            <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Progress Tracking</h2>
          </div>
          <p className="text-gray-600">
            Monitor your fitness journey
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;