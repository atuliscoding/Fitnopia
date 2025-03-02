import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, AlertCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdminHint, setShowAdminHint] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If admin, redirect to admin dashboard
      if (user.email === 'admin@example.com') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);
  
  // Handle redirect after successful login
  useEffect(() => {
    if (loginSuccess && redirectPath) {
      const timer = setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, redirectPath, navigate]);
  
  // Set signup mode based on query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }
  }, [location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message || 'Failed to sign up');
          setLoading(false);
          return;
        }
        setLoginSuccess(true);
        setRedirectPath('/questionnaire');
      } else {
        console.log('Attempting to sign in with:', email);
        const { error: signInError, isAdmin } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message || 'Failed to sign in');
          setLoading(false);
          return;
        }
        
        setLoginSuccess(true);
        
        // Set redirect path based on user type
        if (isAdmin) {
          console.log('Admin login successful, redirecting to admin dashboard');
          setRedirectPath('/admin/dashboard');
        } else {
          setRedirectPath('/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };
  
  // For admin login demo
  const handleAdminLogin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Dumbbell className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp 
            ? 'Already have an account? ' 
            : 'Don\'t have an account? '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            type="button"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {loginSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Login successful! Redirecting to {redirectPath === '/admin/dashboard' ? 'admin dashboard' : 'dashboard'}...
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || loginSuccess}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (loading || loginSuccess) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : loginSuccess ? 'Redirecting...' : isSignUp ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isSignUp ? 'Sign up to get started' : 'Welcome back'}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-center text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
              
              <button 
                onClick={() => setShowAdminHint(!showAdminHint)}
                className="mt-4 flex items-center justify-center w-full text-xs text-indigo-600 hover:text-indigo-800"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Need admin access?
              </button>
              
              {showAdminHint && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-blue-700">
                  <p>For admin access, use:</p>
                  <p className="mt-1 font-medium">Email: admin@example.com</p>
                  <p className="font-medium">Password: admin123</p>
                  <button
                    onClick={handleAdminLogin}
                    className="mt-2 w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded text-xs font-medium"
                  >
                    Fill Admin Credentials
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;