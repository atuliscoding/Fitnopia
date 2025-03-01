import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface ExerciseVideoProps {
  videoUrl: string;
  title: string;
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({ videoUrl, title }) => {
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => {
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <>
      <button
        onClick={openVideo}
        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-200"
      >
        <Play className="h-4 w-4 mr-2" />
        Watch Demo
      </button>

      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">{title} Demo</h3>
              <button
                onClick={closeVideo}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={videoUrl}
                title={`${title} demonstration`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseVideo;