import React from "react";
import { Link } from "react-router-dom";
function PageNotFound() {
   return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Go Home
      </Link>
    </div>
  );
}

export default PageNotFound
