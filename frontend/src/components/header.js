import React from 'react';
import { Layout } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user } = useAuth();
  const location = useLocation();

  // List of protected routes where header should not appear
  const protectedRoutes = [
    '/tasks',
    '/projects',
    '/message',
    '/calendar',
    '/settings',
    '/userprofile',
    '/test',
    '/dashboard',
    '/managerpage'
  ];

  // List of auth routes where header should appear
  const authRoutes = [
    '/login',
    '/signup',
    '/usersignup',
    '/forgotpassword',
    '/resetpassword'
  ];

  // Check if current path is in protected routes
  const isProtectedRoute = protectedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Don't render header on protected routes
  if (isProtectedRoute) return null;

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - always visible */}
          <Link to="/" className="flex items-center space-x-2">
            <Layout className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">Clack</span>
          </Link>

          {/* Conditional rendering of buttons based on auth state */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
