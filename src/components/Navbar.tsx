import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Home, LineChart, Award, User } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { userProfile, level } = useWorkout();
  
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <span className="text-xl font-bold">FitAI</span>
          </Link>
          
          {userProfile && (
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline">Welcome, {userProfile.name}</span>
              <div className="bg-indigo-800 rounded-full px-2 py-1 text-xs font-bold">
                Level {level}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {userProfile && (
        <div className="bg-indigo-700">
          <div className="container mx-auto px-4">
            <div className="flex justify-between">
              <Link 
                to="/dashboard" 
                className={`py-3 px-4 ${location.pathname === '/dashboard' ? 'border-b-2 border-white' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">Dashboard</span>
                </div>
              </Link>
              
              <Link 
                to="/workouts" 
                className={`py-3 px-4 ${location.pathname === '/workouts' || location.pathname.startsWith('/workouts/') ? 'border-b-2 border-white' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <Dumbbell className="h-5 w-5" />
                  <span className="text-xs mt-1">Workouts</span>
                </div>
              </Link>
              
              <Link 
                to="/progress" 
                className={`py-3 px-4 ${location.pathname === '/progress' ? 'border-b-2 border-white' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <LineChart className="h-5 w-5" />
                  <span className="text-xs mt-1">Progress</span>
                </div>
              </Link>
              
              <Link 
                to="/questionnaire" 
                className={`py-3 px-4 ${location.pathname === '/questionnaire' ? 'border-b-2 border-white' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1">Profile</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;