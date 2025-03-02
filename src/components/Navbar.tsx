import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Home, LineChart, Award, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';

// Admin roles - in a real app, this would come from a database
const ADMIN_EMAILS = ['admin@example.com'];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, level } = useWorkout();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <span className="text-xl font-bold">FitAI</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-white hover:bg-indigo-700 rounded-full"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            {user && userProfile && (
              <>
                <span className="hidden md:inline">Welcome, {userProfile.name}</span>
                <div className="bg-indigo-800 rounded-full px-2 py-1 text-xs font-bold">
                  Level {level}
                </div>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="ml-2 p-2 text-white hover:bg-indigo-700 rounded-full"
                    title="Admin Panel"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="ml-2 p-2 text-white hover:bg-indigo-700 rounded-full"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
            
            {user && !userProfile && (
              <div className="flex items-center">
                <span className="hidden md:inline mr-2">Welcome!</span>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="ml-2 p-2 text-white hover:bg-indigo-700 rounded-full"
                    title="Admin Panel"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="ml-2 p-2 text-white hover:bg-indigo-700 rounded-full"
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
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-4 py-2">
          {user ? (
            <>
              {userProfile && (
                <div className="py-2 border-b border-indigo-600">
                  <p className="text-sm">Welcome, {userProfile.name}</p>
                  <p className="text-xs">Level {level}</p>
                </div>
              )}
              <div className="py-2 space-y-2">
                <Link 
                  to="/dashboard" 
                  className="block py-2 hover:bg-indigo-600 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/workouts" 
                  className="block py-2 hover:bg-indigo-600 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Workouts
                </Link>
                <Link 
                  to="/progress" 
                  className="block py-2 hover:bg-indigo-600 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Progress
                </Link>
                <Link 
                  to="/questionnaire" 
                  className="block py-2 hover:bg-indigo-600 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="block py-2 hover:bg-indigo-600 rounded px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 hover:bg-indigo-600 rounded px-2"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="py-2">
              <Link 
                to="/auth" 
                className="block py-2 hover:bg-indigo-600 rounded px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
      
      {user && userProfile && (
        <div className="hidden md:block bg-indigo-700">
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
              
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className={`py-3 px-4 ${location.pathname.startsWith('/admin') ? 'border-b-2 border-white' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs mt-1">Admin</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;