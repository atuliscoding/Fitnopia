import mongoose from 'mongoose';

// MongoDB connection string - in production, this would be an environment variable
const MONGODB_URI = 'mongodb+srv://admin:admin123@cluster0.mongodb.net/fitai?retryWrites=true&w=majority';

// For development, we'll use a mock MongoDB implementation
const isMockMode = true;

// Mock data store
let mockExercises: any[] = [
  {
    _id: 'ex1',
    name: 'Push-ups',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: 'chest',
    equipment: 'none',
    instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex2',
    name: 'Squats',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 12,
    muscle: 'legs',
    equipment: 'none',
    instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back as if sitting in a chair. Keep your chest up and back straight.',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex3',
    name: 'Jumping Jacks',
    type: 'cardio',
    duration: 120,
    equipment: 'none',
    instructions: 'Start with feet together and arms at your sides. Jump to a position with legs spread and arms overhead, then jump back to the starting position.',
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex4',
    name: 'Hamstring Stretch',
    type: 'flexibility',
    duration: 60,
    equipment: 'none',
    instructions: 'Sit on the floor with one leg extended and the other bent with the sole of the foot against the inner thigh. Reach toward the toes of the extended leg.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/FDwpEdxZ4H4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex5',
    name: 'Plank',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 1,
    muscle: 'core',
    equipment: 'none',
    instructions: 'Start in a push-up position with your forearms on the ground. Keep your body in a straight line from head to heels, engaging your core muscles.',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex6',
    name: 'Lunges',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: 'legs',
    equipment: 'none',
    instructions: 'Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push back to the starting position and repeat with the other leg.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex7',
    name: 'Mountain Climbers',
    type: 'cardio',
    duration: 60,
    equipment: 'none',
    instructions: 'Start in a plank position. Bring one knee toward your chest, then quickly switch legs, as if you are running in place in a plank position.',
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex8',
    name: 'Bicycle Crunches',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 15,
    muscle: 'abs',
    equipment: 'none',
    instructions: 'Lie on your back with hands behind your head. Lift shoulders off the ground and bring one knee to your chest while rotating to touch it with the opposite elbow. Alternate sides in a pedaling motion.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/9FGilxCbdz8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex9',
    name: 'Burpees',
    type: 'cardio',
    duration: 60,
    equipment: 'none',
    instructions: 'Start standing, then squat down and place hands on the floor. Jump feet back into a plank position, perform a push-up, jump feet forward to hands, then explosively jump up with arms overhead.',
    imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex10',
    name: 'Shoulder Stretch',
    type: 'flexibility',
    duration: 45,
    equipment: 'none',
    instructions: 'Bring one arm across your chest and use the opposite hand to gently pull the arm closer to your body. Hold for 15-30 seconds and repeat on the other side.',
    imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    videoUrl: 'https://www.youtube.com/embed/bP3h_Hx7zFs',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex11',
    name: 'Dumbbell Rows',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 12,
    muscle: 'back',
    equipment: 'dumbbells',
    instructions: 'Bend at the waist with one knee and hand on a bench, holding a dumbbell in the other hand. Pull the dumbbell up to your side, keeping your elbow close to your body. Lower and repeat.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'ex12',
    name: 'Dumbbell Bench Press',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: 'chest',
    equipment: 'dumbbells, bench',
    instructions: 'Lie on a bench holding dumbbells at chest level. Press the weights up until your arms are fully extended, then lower them back to chest level.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockTemplates: any[] = [
  {
    _id: 'tmpl1',
    name: 'Push-ups Template',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 10,
    muscle: 'chest',
    equipment: 'none',
    instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'tmpl2',
    name: 'Squats Template',
    type: 'strength',
    duration: 60,
    sets: 3,
    reps: 12,
    muscle: 'legs',
    equipment: 'none',
    instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back as if sitting in a chair. Keep your chest up and back straight.',
    imageUrl: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock MongoDB client for development
const mockMongoDB = {
  connect: async () => {
    console.log('Mock MongoDB connected');
    return;
  },
  disconnect: async () => {
    console.log('Mock MongoDB disconnected');
    return;
  },
  isConnected: () => true,
  
  // Exercise operations
  exercises: {
    findAll: async () => {
      return [...mockExercises];
    },
    findById: async (id: string) => {
      return mockExercises.find(ex => ex._id === id) || null;
    },
    create: async (data: any) => {
      const newExercise = {
        _id: `ex${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockExercises.push(newExercise);
      return newExercise;
    },
    update: async (id: string, data: any) => {
      const index = mockExercises.findIndex(ex => ex._id === id);
      if (index === -1) return null;
      
      mockExercises[index] = {
        ...mockExercises[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return mockExercises[index];
    },
    delete: async (id: string) => {
      const index = mockExercises.findIndex(ex => ex._id === id);
      if (index === -1) return false;
      
      mockExercises.splice(index, 1);
      return true;
    }
  },
  
  // Template operations
  templates: {
    findAll: async () => {
      return [...mockTemplates];
    },
    findById: async (id: string) => {
      return mockTemplates.find(tmpl => tmpl._id === id) || null;
    },
    create: async (data: any) => {
      const newTemplate = {
        _id: `tmpl${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockTemplates.push(newTemplate);
      return newTemplate;
    },
    update: async (id: string, data: any) => {
      const index = mockTemplates.findIndex(tmpl => tmpl._id === id);
      if (index === -1) return null;
      
      mockTemplates[index] = {
        ...mockTemplates[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return mockTemplates[index];
    },
    delete: async (id: string) => {
      const index = mockTemplates.findIndex(tmpl => tmpl._id === id);
      if (index === -1) return false;
      
      mockTemplates.splice(index, 1);
      return true;
    }
  }
};

// Real MongoDB connection and models
let connection: typeof mongoose | null = null;

// Connect to MongoDB
const connectToMongoDB = async () => {
  if (isMockMode) {
    return mockMongoDB;
  }
  
  if (connection) {
    return connection;
  }
  
  try {
    connection = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Define MongoDB models
const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['strength', 'cardio', 'flexibility'] },
  duration: { type: Number, required: true },
  sets: { type: Number },
  reps: { type: Number },
  muscle: { type: String },
  equipment: { type: String, required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
}, { timestamps: true });

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['strength', 'cardio', 'flexibility'] },
  duration: { type: Number, required: true },
  sets: { type: Number },
  reps: { type: Number },
  muscle: { type: String },
  equipment: { type: String, required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String },
  videoUrl: { type: String },
}, { timestamps: true });

// Export MongoDB client
export const mongodb = isMockMode ? mockMongoDB : {
  connect: connectToMongoDB,
  disconnect: async () => {
    if (connection) {
      await mongoose.disconnect();
      connection = null;
      console.log('MongoDB disconnected');
    }
  },
  isConnected: () => connection !== null && connection.connection.readyState === 1,
  
  // Exercise operations with real MongoDB
  exercises: {
    findAll: async () => {
      await connectToMongoDB();
      const Exercise = mongoose.model('Exercise', ExerciseSchema);
      return await Exercise.find().sort({ name: 1 });
    },
    findById: async (id: string) => {
      await connectToMongoDB();
      const Exercise = mongoose.model('Exercise', ExerciseSchema);
      return await Exercise.findById(id);
    },
    create: async (data: any) => {
      await connectToMongoDB();
      const Exercise = mongoose.model('Exercise', ExerciseSchema);
      const exercise = new Exercise(data);
      return await exercise.save();
    },
    update: async (id: string, data: any) => {
      await connectToMongoDB();
      const Exercise = mongoose.model('Exercise', ExerciseSchema);
      return await Exercise.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id: string) => {
      await connectToMongoDB();
      const Exercise = mongoose.model('Exercise', ExerciseSchema);
      const result = await Exercise.findByIdAndDelete(id);
      return !!result;
    }
  },
  
  // Template operations with real MongoDB
  templates: {
    findAll: async () => {
      await connectToMongoDB();
      const Template = mongoose.model('Template', TemplateSchema);
      return await Template.find().sort({ name: 1 });
    },
    findById: async (id: string) => {
      await connectToMongoDB();
      const Template = mongoose.model('Template', TemplateSchema);
      return await Template.findById(id);
    },
    create: async (data: any) => {
      await connectToMongoDB();
      const Template = mongoose.model('Template', TemplateSchema);
      const template = new Template(data);
      return await template.save();
    },
    update: async (id: string, data: any) => {
      await connectToMongoDB();
      const Template = mongoose.model('Template', TemplateSchema);
      return await Template.findByIdAndUpdate(id, data, { new: true });
    },
    delete: async (id: string) => {
      await connectToMongoDB();
      const Template = mongoose.model('Template', TemplateSchema);
      const result = await Template.findByIdAndDelete(id);
      return !!result;
    }
  }
};

// Initialize MongoDB connection
mongodb.connect().catch(console.error);

console.log('MongoDB module initialized in', isMockMode ? 'mock mode' : 'real mode');