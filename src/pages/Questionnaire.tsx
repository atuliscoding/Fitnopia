import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, generateWorkouts } = useWorkout();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    id: `user-${Date.now()}`,
    name: '',
    age: 30,
    gender: '',
    height: 170,
    weight: 70,
    fitnessLevel: 'beginner',
    fitnessGoals: [],
    workoutFrequency: 3,
    healthConditions: [],
    equipmentAccess: [],
    workoutDuration: 45,
    workoutTime: 'morning',
    restDays: [],
    focusAreas: [],
    dietPreference: 'balanced'
  });
  
  // Pre-fill form if user profile exists
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
    }
  }, [userProfile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'fitnessGoals' | 'healthConditions' | 'equipmentAccess' | 'restDays' | 'focusAreas') => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const currentArray = prev[category] || [];
      
      if (checked) {
        return { ...prev, [category]: [...currentArray, value] };
      } else {
        return { ...prev, [category]: currentArray.filter(item => item !== value) };
      }
    });
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    await setUserProfile(formData as UserProfile);
    await generateWorkouts();
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">
        {userProfile ? 'Update Your Profile' : 'Fitness Questionnaire'}
      </h1>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div 
              key={step}
              className={`w-1/6 h-2 rounded-full mx-1 ${currentStep >= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-center text-gray-600">Step {currentStep} of 6</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-gray-700 mb-1">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="16"
                max="100"
                value={formData.age}
                onChange={handleNumberChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-gray-700 mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="height" className="block text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="100"
                  max="250"
                  value={formData.height}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  min="30"
                  max="250"
                  value={formData.weight}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fitness Level & Goals</h2>
            
            <div>
              <label htmlFor="fitnessLevel" className="block text-gray-700 mb-1">Current Fitness Level</label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="beginner">Beginner - New to exercise</option>
                <option value="intermediate">Intermediate - Exercise regularly</option>
                <option value="advanced">Advanced - Very active</option>
              </select>
            </div>
            
            <div>
              <p className="block text-gray-700 mb-2">Fitness Goals (select all that apply)</p>
              <div className="space-y-2">
                {['strength', 'cardio', 'flexibility', 'weight-loss', 'muscle-gain', 'endurance', 'toning', 'athletic-performance', 'stress-reduction'].map(goal => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      name={goal}
                      value={goal}
                      checked={formData.fitnessGoals?.includes(goal) || false}
                      onChange={e => handleCheckboxChange(e, 'fitnessGoals')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{goal.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="workoutFrequency" className="block text-gray-700 mb-1">
                How many days per week can you workout?
              </label>
              <input
                type="range"
                id="workoutFrequency"
                name="workoutFrequency"
                min="1"
                max="7"
                value={formData.workoutFrequency}
                onChange={handleNumberChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
              </div>
              <p className="text-center mt-2 text-indigo-600 font-medium">
                {formData.workoutFrequency} {formData.workoutFrequency === 1 ? 'day' : 'days'} per week
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Workout Preferences</h2>
            
            <div>
              <label htmlFor="workoutDuration" className="block text-gray-700 mb-1">
                Preferred workout duration (minutes)
              </label>
              <select
                id="workoutDuration"
                name="workoutDuration"
                value={formData.workoutDuration}
                onChange={handleNumberChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="15">15 minutes (Quick)</option>
                <option value="30">30 minutes (Short)</option>
                <option value="45">45 minutes (Medium)</option>
                <option value="60">60 minutes (Standard)</option>
                <option value="90">90 minutes (Extended)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="workoutTime" className="block text-gray-700 mb-1">
                Preferred time of day for workouts
              </label>
              <select
                id="workoutTime"
                name="workoutTime"
                value={formData.workoutTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            
            <div>
              <p className="block text-gray-700 mb-2">Preferred rest days (select all that apply)</p>
              <div className="grid grid-cols-4 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      name={day}
                      value={day}
                      checked={formData.restDays?.includes(day) || false}
                      onChange={e => handleCheckboxChange(e, 'restDays')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Focus Areas</h2>
            
            <div>
              <p className="block text-gray-700 mb-2">Which body areas would you like to focus on? (select all that apply)</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'chest', 'back', 'shoulders', 'arms', 'abs', 'core', 
                  'glutes', 'legs', 'calves', 'full-body', 'upper-body', 'lower-body'
                ].map(area => (
                  <label key={area} className="flex items-center">
                    <input
                      type="checkbox"
                      name={area}
                      value={area}
                      checked={formData.focusAreas?.includes(area) || false}
                      onChange={e => handleCheckboxChange(e, 'focusAreas')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{area.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="dietPreference" className="block text-gray-700 mb-1">
                Diet Preference
              </label>
              <select
                id="dietPreference"
                name="dietPreference"
                value={formData.dietPreference}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="balanced">Balanced</option>
                <option value="high-protein">High Protein</option>
                <option value="low-carb">Low Carb</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="intermittent-fasting">Intermittent Fasting</option>
              </select>
            </div>
          </div>
        )}
        
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Considerations</h2>
            
            <div>
              <p className="block text-gray-700 mb-2">Do you have any health conditions? (select all that apply)</p>
              <div className="space-y-2">
                {[
                  'none', 
                  'back-pain', 
                  'knee-issues', 
                  'shoulder-pain', 
                  'high-blood-pressure', 
                  'heart-condition',
                  'asthma',
                  'diabetes',
                  'pregnancy',
                  'arthritis',
                  'osteoporosis',
                  'limited-mobility',
                  'recent-injury',
                  'chronic-fatigue'
                ].map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      name={condition}
                      value={condition}
                      checked={formData.healthConditions?.includes(condition) || false}
                      onChange={e => handleCheckboxChange(e, 'healthConditions')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{condition.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                <strong>Note:</strong> This app provides general fitness guidance. Always consult with a healthcare professional before starting any new exercise program, especially if you have pre-existing health conditions.
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Equipment Access</h2>
            
            <div>
              <p className="block text-gray-700 mb-2">What equipment do you have access to? (select all that apply)</p>
              <div className="space-y-2">
                {[
                  'none',
                  'dumbbells',
                  'barbell',
                  'resistance-bands',
                  'pull-up-bar',
                  'bench',
                  'treadmill',
                  'exercise-bike',
                  'yoga-mat',
                  'kettlebells',
                  'medicine-ball',
                  'foam-roller',
                  'stability-ball',
                  'jump-rope',
                  'step-platform',
                  'rowing-machine',
                  'elliptical',
                  'gym-membership'
                ].map(equipment => (
                  <label key={equipment} className="flex items-center">
                    <input
                      type="checkbox"
                      name={equipment}
                      value={equipment}
                      checked={formData.equipmentAccess?.includes(equipment) || false}
                      onChange={e => handleCheckboxChange(e, 'equipmentAccess')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700 capitalize">{equipment.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition duration-200"
            >
              Back
            </button>
          )}
          
          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition duration-200"
            >
              {userProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;