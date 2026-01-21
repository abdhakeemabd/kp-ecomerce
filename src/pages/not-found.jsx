import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
