import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Questionnaire from './pages/Questionnaire';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminExerciseLibrary from './pages/AdminExerciseLibrary';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/questionnaire" element={
                <ProtectedRoute>
                  <Questionnaire />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/workouts" element={
                <ProtectedRoute>
                  <Workouts />
                </ProtectedRoute>
              } />
              <Route path="/workouts/:id" element={
                <ProtectedRoute>
                  <WorkoutDetail />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/library" element={
                <ProtectedRoute>
                  <AdminExerciseLibrary />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;