import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Home, LineChart, Award, User, LogOut } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, level } = useWorkout();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <span className="text-xl font-bold">FitAI</span>
          </Link>
          
          {user && userProfile && (
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline">Welcome, {userProfile.name}</span>
              <div className="bg-indigo-800 rounded-full px-2 py-1 text-xs font-bold">
                Level {level}
              </div>
              <button 
                onClick={handleSignOut}
                className="ml-4 p-2 text-white hover:bg-indigo-700 rounded-full"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {user && !userProfile && (
            <div className="flex items-center">
              <span className="hidden md:inline mr-2">Welcome!</span>
              <button 
                onClick={handleSignOut}
                className="ml-4 p-2 text-white hover:bg-indigo-700 rounded-full"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {!user && (
            <Link 
              to="/auth" 
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium transition duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      
      {user && userProfile && (
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