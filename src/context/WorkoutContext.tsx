import React, { createContext, useContext, useState } from "react";
const WorkoutContext = createContext(null);

export const WorkoutProvider = ({ children }) => {
  const [workout, setWorkout] = useState(null);

  return (
    <WorkoutContext.Provider value={{ workout, setWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Correct way to define the hook
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};