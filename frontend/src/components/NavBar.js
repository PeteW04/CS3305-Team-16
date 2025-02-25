import React, { useState } from "react"
import { Menu, Search, Calendar, Mail, Bell, User } from "lucide-react"
import "../CSS-files/NavBar.css"
import ProfileModal from './ProfileModal'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false)
  const { user, isLoading } = useAuth()
  
  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>
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
        <Link to="/calendar" className="icon-button">
          <Calendar />
        </Link>
        <Link to="/message" className="icon-button">
          <Mail />
        </Link>
        <div className="notification-button">
          <Bell />
          <span className="notification-dot"></span>
        </div>
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
    </header>
  )
}

export default NavBar
