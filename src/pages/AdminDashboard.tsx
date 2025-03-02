import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Dumbbell, Users, Settings, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { mongodb } from '../lib/mongodb';

// Admin roles - in a real app, this would come from a database
const ADMIN_EMAILS = ['admin@example.com'];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');
  
  // If user is not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  const adminModules = [
    {
      title: 'Exercise Management',
      description: 'Manage workout exercises, edit details, and update content',
      icon: <Dumbbell className="h-8 w-8 text-indigo-600" />,
      link: '/admin',
      color: 'bg-indigo-50'
    },
    {
      title: 'Exercise Library',
      description: 'Manage exercise templates for reuse across workouts',
      icon: <Database className="h-8 w-8 text-green-600" />,
      link: '/admin/library',
      color: 'bg-green-50'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts and profiles',
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: '/admin/users',
      color: 'bg-blue-50'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings and preferences',
      icon: <Settings className="h-8 w-8 text-purple-600" />,
      link: '/admin/settings',
      color: 'bg-purple-50'
    },
    {
      title: 'Analytics',
      description: 'View usage statistics and performance metrics',
      icon: <BarChart className="h-8 w-8 text-orange-600" />,
      link: '/admin/analytics',
      color: 'bg-orange-50'
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 rounded-full p-3 mr-4">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Welcome to the Admin Panel</h2>
            <p className="text-gray-600">Manage your application content and settings with MongoDB</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <Link 
              key={index} 
              to={module.link}
              className={`${module.color} rounded-lg p-6 hover:shadow-md transition duration-200`}
            >
              <div className="flex items-center mb-4">
                {module.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
              <p className="text-gray-600 text-sm">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">MongoDB Database Status</h2>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <p className="text-gray-700">Connected to MongoDB database</p>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          All exercise data is now stored in MongoDB. You can manage exercises and templates through the admin interface.
        </p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Admin Access Note</h3>
        <p className="text-yellow-700 text-sm">
          You're currently logged in as an administrator. This gives you access to sensitive system controls.
          Remember that changes made here will affect all users of the application.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;