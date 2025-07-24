
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Errorpage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-140 h-100">
        <DotLottieReact
          src="https://lottie.host/f38b94d5-1dd7-4acf-a95c-bea2c3fb7dd9/pqXFzjmgtU.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md transition"
      >
        <FaHome size={20} />
        Go to Home
      </button>
    </div>
  );
};

export default Errorpage;
