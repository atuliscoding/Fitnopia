import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Award, LineChart } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Home: React.FC = () => {
  const { userProfile } = useWorkout();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to FitAI</h1>
        <p className="text-xl text-gray-600">
          Your AI-powered personal trainer for customized workouts and fitness tracking
        </p>
      </div>
      
      {!userProfile ? (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Complete our quick questionnaire to help us understand your fitness goals and create personalized workout plans just for you.
          </p>
          <Link 
            to="/questionnaire" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Take the Questionnaire
          </Link>
        </div>
      ) : (
        <Link 
          to="/dashboard" 
          className="block bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition duration-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Continue to Your Dashboard</h2>
          <p className="text-gray-600">
            View your personalized workouts and track your progress.
          </p>
        </Link>
      )}
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <Dumbbell className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Workouts</h3>
          <p className="text-gray-600">
            Get personalized workout plans based on your fitness level, goals, and available equipment.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <LineChart className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Track Your Progress</h3>
          <p className="text-gray-600">
            Monitor your fitness journey with detailed progress tracking and analytics.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex justify-center mb-4">
            <Award className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Earn Achievements</h3>
          <p className="text-gray-600">
            Stay motivated with gamification elements like levels, experience points, and achievements.
          </p>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Why Choose FitAI?</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white mr-3">✓</span>
            <span>Personalized workouts tailored to your specific needs and goals</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white mr-3">✓</span>
            <span>Adaptive difficulty that grows with your fitness level</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white mr-3">✓</span>
            <span>Gamification features to keep you motivated and engaged</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white mr-3">✓</span>
            <span>Comprehensive progress tracking to visualize your improvements</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;