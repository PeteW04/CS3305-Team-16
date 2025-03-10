import React from 'react';
import { X, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfilePictureUrl } from "../api/users";

function ProfileModal({ onClose }) {
  const { user, isLoading, logout } = useAuth();
  const name = `${user.firstName} ${user.lastName}`;
  const email = user.email;

  if (isLoading) {
    return <div>Loading...</div>; // Or your LoadingSpinner component
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="absolute right-4 top-20 w-72 bg-white rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="bg-indigo-100 p-0.5 rounded-full flex items-center justify-center overflow-hidden hover:bg-[#4f46e5] transition-colors duration-200">
                {user.profilePicture ? (
                  <img
                    src={getProfilePictureUrl(user.profilePicture)}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Link
            to="/userprofile"
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
            onClick={onClose}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal; 