import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Questionnaire from './pages/Questionnaire';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';
import { WorkoutProvider } from './context/WorkoutContext';

function App() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </WorkoutProvider>
  );
}

export default App;