import React, { useState } from "react";
import { Bell, User, Layout } from "lucide-react";
import "../CSS-files/NavBar.css";
import ProfileModal from "./ProfileModal";
import { Link } from 'react-router-dom';
import NotificationModal from "./NotificationModal"; 
import { useAuth } from "../context/AuthContext";
import { getProfilePictureUrl } from "../api/users";



const NavBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); 
  const { user, isLoading } = useAuth();

  console.log("User profile picture URL:", user?.profilePicture);




  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="header">
      {/* Left section */}
      <div className="header-left">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Layout className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">Clack</span>
        </Link>
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
      {user?.profilePicture ? (
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
    </div>
  );
};

export default NavBar;