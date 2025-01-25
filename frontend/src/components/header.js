import React from 'react';
import { Layout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isAuthPage = ['/login'].includes(location.pathname);

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Layout className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Clack</span>
          </Link>
          {!isAuthPage && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
