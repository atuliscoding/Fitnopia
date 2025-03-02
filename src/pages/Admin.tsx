import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { Edit, Trash2, Plus, Save, X, Search, RefreshCw, Copy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { mongodb } from '../lib/mongodb';
import { useWorkout } from '../context/WorkoutContext';

// Admin roles - in a real app, this would come from a database
const ADMIN_EMAILS = ['admin@example.com'];

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { exerciseDatabase } = useWorkout(); // Get exercise database from context
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Form state for editing
  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: '',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: '',
    equipment: 'none',
    instructions: '',
    imageUrl: '',
    videoUrl: ''
  });

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  // Load exercises
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mongodb.exercises.findAll();
      
      if (data) {
        const formattedExercises: Exercise[] = data.map((ex: any) => ({
          id: ex._id,
          name: ex.name,
          type: ex.type as 'strength' | 'cardio' | 'flexibility',
          duration: ex.duration,
          sets: ex.sets || undefined,
          reps: ex.reps || undefined,
          muscle: ex.muscle || undefined,
          equipment: ex.equipment,
          instructions: ex.instructions,
          imageUrl: ex.imageUrl || undefined,
          videoUrl: ex.videoUrl || undefined
        }));
        
        setExercises(formattedExercises);
      }
    } catch (err: any) {
      console.error('Error fetching exercises:', err);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const startEditing = (exercise: Exercise) => {
    setEditingId(exercise.id);
    setFormData({
      name: exercise.name,
      type: exercise.type,
      duration: exercise.duration,
      sets: exercise.sets,
      reps: exercise.reps,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      instructions: exercise.instructions,
      imageUrl: exercise.imageUrl,
      videoUrl: exercise.videoUrl
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      type: 'strength',
      duration: 60,
      sets: 3,
      reps: 10,
      muscle: '',
      equipment: 'none',
      instructions: '',
      imageUrl: '',
      videoUrl: ''
    });
  };

  const saveExercise = async () => {
    if (!formData.name || !formData.type || !formData.duration) {
      setError('Name, type, and duration are required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        // Update existing exercise
        const updatedExercise = await mongodb.exercises.update(editingId, {
          name: formData.name,
          type: formData.type,
          duration: formData.duration,
          sets: formData.sets || null,
          reps: formData.reps || null,
          muscle: formData.muscle || null,
          equipment: formData.equipment,
          instructions: formData.instructions,
          imageUrl: formData.imageUrl || null,
          videoUrl: formData.videoUrl || null
        });
        
        if (!updatedExercise) throw new Error('Failed to update exercise');
        
        // Update local state
        setExercises(prev => 
          prev.map(ex => 
            ex.id === editingId 
              ? { 
                  ...ex, 
                  name: formData.name || ex.name,
                  type: formData.type as 'strength' | 'cardio' | 'flexibility' || ex.type,
                  duration: formData.duration || ex.duration,
                  sets: formData.sets,
                  reps: formData.reps,
                  muscle: formData.muscle,
                  equipment: formData.equipment || ex.equipment,
                  instructions: formData.instructions || ex.instructions,
                  imageUrl: formData.imageUrl,
                  videoUrl: formData.videoUrl
                } 
              : ex
          )
        );
      } else {
        // Create new exercise
        const newExercise = await mongodb.exercises.create({
          name: formData.name,
          type: formData.type,
          duration: formData.duration,
          sets: formData.sets || null,
          reps: formData.reps || null,
          muscle: formData.muscle || null,
          equipment: formData.equipment,
          instructions: formData.instructions,
          imageUrl: formData.imageUrl || null,
          videoUrl: formData.videoUrl || null
        });
        
        if (!newExercise) throw new Error('Failed to create exercise');
        
        // Add to local state
        const formattedExercise: Exercise = {
          id: newExercise._id,
          name: newExercise.name,
          type: newExercise.type as 'strength' | 'cardio' | 'flexibility',
          duration: newExercise.duration,
          sets: newExercise.sets,
          reps: newExercise.reps,
          muscle: newExercise.muscle,
          equipment: newExercise.equipment,
          instructions: newExercise.instructions,
          imageUrl: newExercise.imageUrl,
          videoUrl: newExercise.videoUrl
        };
        
        setExercises(prev => [...prev, formattedExercise]);
      }
      
      // Reset form
      cancelEditing();
    } catch (err: any) {
      console.error('Error saving exercise:', err);
      setError('Failed to save exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exercise?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await mongodb.exercises.delete(id);
      
      if (!success) throw new Error('Failed to delete exercise');
      
      // Update local state
      setExercises(prev => prev.filter(ex => ex.id !== id));
    } catch (err: any) {
      console.error('Error deleting exercise:', err);
      setError('Failed to delete exercise. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter exercises based on search term and type
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ex.instructions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ex.type === filterType;
    return matchesSearch && matchesType;
  });

  // If user is not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Exercise Management (MongoDB)</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded flex items-center"
              disabled={loading || editingId !== null}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </button>
            
            <button
              onClick={fetchExercises}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded flex items-center"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>
        </div>
        
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Add New Exercise</h2>
              <button
                onClick={cancelEditing}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1">Name *</label>
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
                <label htmlFor="type" className="block text-gray-700 mb-1">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-gray-700 mb-1">Duration (seconds) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="equipment" className="block text-gray-700 mb-1">Equipment *</label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              {formData.type === 'strength' && (
                <>
                  <div>
                    <label htmlFor="sets" className="block text-gray-700 mb-1">Sets</label>
                    <input
                      type="number"
                      id="sets"
                      name="sets"
                      min="1"
                      value={formData.sets}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="reps" className="block text-gray-700 mb-1">Reps</label>
                    <input
                      type="number"
                      id="reps"
                      name="reps"
                      min="1"
                      value={formData.reps}
                      onChange={handleNumberChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="muscle" className="block text-gray-700 mb-1">Muscle Group</label>
                    <input
                      type="text"
                      id="muscle"
                      name="muscle"
                      value={formData.muscle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="imageUrl" className="block text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label htmlFor="videoUrl" className="block text-gray-700 mb-1">Video URL</label>
                <input
                  type="text"
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/embed/example"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="instructions" className="block text-gray-700 mb-1">Instructions *</label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={cancelEditing}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={saveExercise}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Exercise
              </button>
            </div>
          </div>
        )}
        
        {loading && !editingId && !showAddForm ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Media
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExercises.map(exercise => (
                  <tr key={exercise.id} className={editingId === exercise.id ? 'bg-indigo-50' : ''}>
                    {editingId === exercise.id ? (
                      // Edit mode
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="strength">Strength</option>
                            <option value="cardio">Cardio</option>
                            <option value="flexibility">Flexibility</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            name="duration"
                            min="1"
                            value={formData.duration}
                            onChange={handleNumberChange}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            className="w-full px-3 py-1 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={3}
                          />
                          {formData.type === 'strength' && (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500">Sets</label>
                                <input
                                  type="number"
                                  name="sets"
                                  min="1"
                                  value={formData.sets}
                                  onChange={handleNumberChange}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Reps</label>
                                <input
                                  type="number"
                                  name="reps"
                                  min="1"
                                  value={formData.reps}
                                  onChange={handleNumberChange}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500">Muscle</label>
                                <input
                                  type="text"
                                  name="muscle"
                                  value={formData.muscle}
                                  onChange={handleInputChange}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            <label className="block text-xs text-gray-500">Equipment</label>
                            <input
                              type="text"
                              name="equipment"
                              value={formData.equipment}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <label className="block text-xs text-gray-500">Image URL</label>
                            <input
                              type="text"
                              name="imageUrl"
                              value={formData.imageUrl}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                          <div className="mt-2">
                            <label className="block text-xs text-gray-500">Video URL</label>
                            <input
                              type="text"
                              name="videoUrl"
                              value={formData.videoUrl}
                              onChange={handleInputChange}
                              className="w-full px-2 py-1 border rounded text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={saveExercise}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            disabled={loading}
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{exercise.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${exercise.type === 'strength' ? 'bg-blue-100 text-blue-800' : 
                              exercise.type === 'cardio' ? 'bg-green-100 text-green-800' : 
                              'bg-purple-100 text-purple-800'}`}>
                            {exercise.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {Math.floor(exercise.duration / 60) > 0 ? 
                              `${Math.floor(exercise.duration / 60)}m ${exercise.duration % 60}s` : 
                              `${exercise.duration}s`}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 line-clamp-2 mb-1">{exercise.instructions}</div>
                          {exercise.type === 'strength' && (
                            <div className="flex space-x-2 text-xs text-gray-500">
                              {exercise.sets && <span>{exercise.sets} sets</span>}
                              {exercise.reps && <span>{exercise.reps} reps</span>}
                              {exercise.muscle && <span>Muscle: {exercise.muscle}</span>}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">Equipment: {exercise.equipment}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            {exercise.imageUrl && (
                              <a 
                                href={exercise.imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-900"
                              >
                                View Image
                              </a>
                            )}
                            {exercise.videoUrl && (
                              <a 
                                href={exercise.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-900"
                              >
                                View Video
                              </a>
                            )}
                            {!exercise.imageUrl && !exercise.videoUrl && (
                              <span className="text-xs text-gray-500">No media</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => startEditing(exercise)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            disabled={editingId !== null}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteExercise(exercise.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={editingId !== null}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No exercises found.</p>
            {searchTerm && (
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search or filter criteria.
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Exercise Database Status</h2>
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <p className="text-gray-700">MongoDB Exercise Database: {exercises.length} exercises available</p>
        </div>
        <p className="text-gray-600 mb-4">
          All exercises are stored in MongoDB and shared between the admin interface and user workouts.
          Any changes made here will be reflected in the workout generation process.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Important Note</h3>
          <p className="text-yellow-700 text-sm">
            The exercise database is currently running in mock mode for development purposes.
            In a production environment, this would connect to a real MongoDB database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;