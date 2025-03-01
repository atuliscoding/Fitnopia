import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onSkip?: () => void;
  onTimeSpent?: (timeSpent: number) => void;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ 
  duration, 
  onComplete, 
  onSkip,
  onTimeSpent 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Calculate percentage for progress circle
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const strokeDashoffset = circumference * (1 - timeLeft / duration);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start the timer
  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsPaused(true);
    // Update time spent when pausing
    if (startTimeRef.current !== null) {
      const additionalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(prev => prev + additionalTime);
      startTimeRef.current = null;
    }
  };

  // Resume the timer
  const resumeTimer = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  // Reset the timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration);
    setTimeSpent(0);
    startTimeRef.current = null;
  };

  // Finish the exercise
  const finishExercise = () => {
    // Calculate final time spent
    if (startTimeRef.current !== null) {
      const additionalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const finalTimeSpent = timeSpent + additionalTime;
      setTimeSpent(finalTimeSpent);
      
      // Report time spent
      if (onTimeSpent) {
        onTimeSpent(finalTimeSpent);
      }
    } else if (onTimeSpent) {
      onTimeSpent(timeSpent);
    }
    
    // Complete the exercise
    if (onComplete) {
      onComplete();
    }
  };

  // Skip the exercise
  const skipExercise = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            
            // Calculate final time spent
            if (startTimeRef.current !== null) {
              const additionalTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
              const finalTimeSpent = timeSpent + additionalTime;
              setTimeSpent(finalTimeSpent);
              
              // Report time spent
              if (onTimeSpent) {
                onTimeSpent(finalTimeSpent);
              }
            }
            
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, onComplete, onTimeSpent, timeSpent]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
          />
          {/* Time text */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#1f2937"
          >
            {formatTime(timeLeft)}
          </text>
        </svg>
      </div>

      <div className="flex space-x-3">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition duration-200"
            aria-label="Start timer"
          >
            <Play className="h-6 w-6" />
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeTimer}
            className="flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition duration-200"
            aria-label="Resume timer"
          >
            <Play className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center justify-center w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition duration-200"
            aria-label="Pause timer"
          >
            <Pause className="h-6 w-6" />
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition duration-200"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        
        <button
          onClick={finishExercise}
          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full transition duration-200"
          aria-label="Finish exercise"
          disabled={!isActive && timeSpent === 0}
        >
          <CheckCircle className="h-6 w-6" />
        </button>
      </div>
      
      <div className="mt-3 flex justify-center">
        <button
          onClick={skipExercise}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Skip Exercise
        </button>
      </div>
    </div>
  );
};

export default ExerciseTimer;