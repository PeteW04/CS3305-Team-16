import React, { useState } from "react";
import { Menu, Search, Calendar, Mail, Bell, User, Layout } from "lucide-react";
import "../CSS-files/NavBar.css";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";
import { useAuth } from "../context/AuthContext";
import { getProfilePictureUrl } from "../api/users";
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { user, isLoading } = useAuth();

  console.log(user)
  // console.log("User profile picture URL:", user.profilePicture);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="header">
      {/* Left section */}
      <div className="header-left">
        {/* Profile Section */}
        <Link to="/dashboard" className="flex items-center space-x-2 px-2 py-4">
          <Layout className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">Clack</span>
        </Link>
      </div>

      {/* Center section - Search */}
      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input type="text" placeholder="Search for anything..." className="search-input" />
        </div>
      </div>

      {/* Right section */}
      <div className="header-right">
        {/* Notification Button */}
        <div
          className="notification-button"
          onClick={() => setShowNotificationModal(true)}
        >
          <Bell />
          <span className="notification-dot"></span>
        </div>

        <div className="profile-section" onClick={() => setShowProfileModal(true)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-indigo-100 p-2 rounded-full">
              {user.profilePicture ? (
                <img
                  src={getProfilePictureUrl(user.profilePicture)}
                  alt="User Profile"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-indigo-600" />
              )}
            </div>
          </div>
        </div>



        {/* Profile Modal */}
        {showProfileModal && user && (
          <ProfileModal onClose={() => setShowProfileModal(false)} />
        )}

        {/* Notification Modal */}
        {showNotificationModal && (
          <NotificationModal onClose={() => setShowNotificationModal(false)} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;