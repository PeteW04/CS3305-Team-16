import React, { useState } from "react";
import { Menu, Search, Calendar, Mail, Bell, User } from "lucide-react";
import "../CSS-files/NavBar.css";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal"; 
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false); 
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="header">
      {/* Left section */}
      <div className="header-left">
        <button className="menu-button">
          <Menu />
        </button>
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

        {/* Profile Section */}
        <div className="profile-section" onClick={() => setShowProfileModal(true)}>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
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
    </header>
  );
};

export default NavBar;