import React, { useState } from 'react';
import { LineChart, Calendar, Award, TrendingUp } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';

const Progress: React.FC = () => {
  const { progress, completedWorkouts, experiencePoints, level } = useWorkout();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');
  
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