import React, { useState } from 'react';
import { LineChart, Calendar, Award, TrendingUp, Clock } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Progress: React.FC = () => {
  const { progress, completedWorkouts, experiencePoints, level, workouts } = useWorkout();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'performance'>('overview');
  
  // Group progress entries by date
  const progressByDate = progress.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof progress>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(progressByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate performance metrics
  const calculateAverageTimeByExerciseType = () => {
    const timeByType: Record<string, { total: number, count: number }> = {
      'strength': { total: 0, count: 0 },
      'cardio': { total: 0, count: 0 },
      'flexibility': { total: 0, count: 0 }
    };
    
    progress.forEach(entry => {
      if (entry.exerciseTimeSpent) {
        Object.entries(entry.exerciseTimeSpent).forEach(([exerciseId, time]) => {
          // Find the workout to get exercise details
          const workout = workouts.find(w => w.id === entry.workoutId);
          const exercise = workout?.exercises.find(e => e.id === exerciseId);
          
          if (exercise && exercise.type) {
            timeByType[exercise.type].total += time;
            timeByType[exercise.type].count += 1;
          }
        });
      }
    });
    
    return Object.entries(timeByType).map(([type, data]) => ({
      type,
      average: data.count > 0 ? data.total / data.count : 0
    }));
  };
  
  const averageTimeByType = calculateAverageTimeByExerciseType();
  
  // Mock achievements
  const achievements = [
    {
      id: 'first-workout',
      name: 'First Step',
      description: 'Complete your first workout',
      icon: '🏆',
      unlocked: completedWorkouts >= 1,
    },
    {
      id: 'five-workouts',
      name: 'Getting in the Groove',
      description: 'Complete 5 workouts',
      icon: '🔥',
      unlocked: completedWorkouts >= 5,
      progress: completedWorkouts,
      target: 5
    },
    {
      id: 'ten-workouts',
      name: 'Dedicated',
      description: 'Complete 10 workouts',
      icon: '💪',
      unlocked: completedWorkouts >= 10,
      progress: completedWorkouts,
      target: 10
    },
    {
      id: 'level-5',
      name: 'Rising Star',
      description: 'Reach level 5',
      icon: '⭐',
      unlocked: level >= 5,
      progress: level,
      target: 5
    },
    {
      id: 'level-10',
      name: 'Fitness Enthusiast',
      description: 'Reach level 10',
      icon: '🌟',
      unlocked: level >= 10,
      progress: level,
      target: 10
    },
    {
      id: '1000-xp',
      name: 'XP Hunter',
      description: 'Earn 1000 XP',
      icon: '📈',
      unlocked: experiencePoints >= 1000,
      progress: experiencePoints,
      target: 1000
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'overview' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'history' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'performance' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'achievements' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <Award className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Level</h2>
                  </div>
                  <p className="text-3xl font-bold text-indigo-700 mb-1">{level}</p>
                  <p className="text-gray-600">Current level</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">XP</h2>
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-1">{experiencePoints}</p>
                  <p className="text-gray-600">Total experience</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Workouts</h2>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-1">{completedWorkouts}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                
                {progress.length > 0 ? (
                  <div className="space-y-4">
                    {progress.slice(0, 5).map(entry => (
                      <div key={entry.id} className="flex items-start">
                        <div className="bg-indigo-100 text-indigo-800 rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium mr-3">
                          {new Date(entry.date).getDate()}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{entry.workoutName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          {entry.rating && (
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`text-sm ${i < entry.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No activity recorded yet</p>
                    <p className="text-gray-500 text-sm">Complete workouts to track your progress</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Workout History</h2>
              
              {progress.length > 0 ? (
                <div className="space-y-6">
                  {sortedDates.map(date => (
                    <div key={date}>
                      <h3 className="font-medium text-gray-800 mb-3">
                        {new Date(date).toLocaleDateString(undefined, { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      
                      <div className="space-y-4">
                        {progressByDate[date].map(entry => (
                          <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-800">{entry.workoutName}</h4>
                              {entry.rating && (
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span 
                                      key={i} 
                                      className={`text-sm ${i < entry.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {entry.exerciseTimeSpent && Object.keys(entry.exerciseTimeSpent).length > 0 && (
                              <div className="mt-2 mb-3">
                                <p className="text-sm text-gray-600 mb-1">Exercise times:</p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(entry.exerciseTimeSpent).map(([exerciseId, time], index) => {
                                    // Find the workout to get exercise details
                                    const workout = workouts.find(w => w.id === entry.workoutId);
                                    const exercise = workout?.exercises.find(e => e.id === exerciseId);
                                    
                                    return exercise ? (
                                      <span 
                                        key={exerciseId} 
                                        className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded"
                                      >
                                        <Clock className="h-3 w-3 mr-1" />
                                        {exercise.name}: {formatTime(time)}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {entry.notes && (
                              <p className="text-gray-600 text-sm mt-2">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No workout history yet</p>
                  <p className="text-gray-500 text-sm">Complete workouts to see your history</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'performance' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h2>
              
              {progress.length > 0 ? (
                <div className="space-y-8">
                  {/* Workout Completion Times */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Workout Completion Times</h3>
                    <div className="h-64 relative">
                      {progress.slice(0, 10).reverse().map((entry, index) => {
                        const totalTime = entry.exerciseTimeSpent 
                          ? Object.values(entry.exerciseTimeSpent).reduce((sum, time) => sum + time, 0) 
                          : 0;
                        
                        const maxHeight = 200; // max bar height in pixels
                        const maxTime = Math.max(
                          ...progress.slice(0, 10).map(e => 
                            e.exerciseTimeSpent 
                              ? Object.values(e.exerciseTimeSpent).reduce((sum, time) => sum + time, 0) 
                              : 0
                          ),
                          60 // minimum 1 minute for scale
                        );
                        
                        const height = totalTime > 0 ? (totalTime / maxTime) * maxHeight : 0;
                        
                        return (
                          <div 
                            key={entry.id} 
                            className="absolute bottom-0 bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-all duration-200"
                            style={{
                              height: `${height}px`,
                              width: '8%',
                              left: `${index * 10}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                              {formatTime(totalTime)}
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                              {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                      {/* X-axis */}
                      <div className="absolute bottom-0 w-full h-px bg-gray-300"></div>
                    </div>
                  </div>
                  
                  {/* Average Time by Exercise Type */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Average Time by Exercise Type</h3>
                    <div className="space-y-4">
                      {averageTimeByType.map(item => (
                        <div key={item.type} className="relative">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 capitalize">{item.type}</span>
                            <span className="text-sm text-gray-600">{formatTime(Math.round(item.average))}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                item.type === 'strength' ? 'bg-blue-600' : 
                                item.type === 'cardio' ? 'bg-green-600' : 'bg-purple-600'
                              }`}
                              style={{ width: `${Math.min(100, (item.average / 300) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Workout Ratings Over Time */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-4">Workout Ratings</h3>
                    <div className="h-64 relative">
                      {progress.filter(entry => entry.rating).slice(0, 10).reverse().map((entry, index) => {
                        const rating = entry.rating || 0;
                        const height = (rating / 5) * 200; // max height 200px for rating 5
                        
                        return (
                          <div 
                            key={entry.id} 
                            className="absolute bottom-0 bg-yellow-400 rounded-t-sm hover:bg-yellow-500 transition-all duration-200"
                            style={{
                              height: `${height}px`,
                              width: '8%',
                              left: `${index * 10}%`,
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                              {rating}/5
                            </div>
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                              {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                      {/* X-axis */}
                      <div className="absolute bottom-0 w-full h-px bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No performance data yet</p>
                  <p className="text-gray-500 text-sm">Complete workouts to see your performance metrics</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Achievements</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`border rounded-lg p-4 ${
                      achievement.unlocked 
                        ? 'bg-white border-indigo-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`text-2xl mr-3 ${!achievement.unlocked && 'opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        
                        {achievement.progress !== undefined && achievement.target !== undefined && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>{achievement.progress} / {achievement.target}</span>
                              <span>{Math.floor((achievement.progress / achievement.target) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-indigo-600 h-1.5 rounded-full" 
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;