import React from "react"
import { Menu, Search, Calendar, Mail, Bell, ChevronDown } from "lucide-react"
import "../CSS-files/NavBar.css"

const NavBar = () => {
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
        <button className="icon-button">
          <Calendar />
        </button>
        <button className="icon-button">
          <Mail />
        </button>
        <div className="notification-button">
          <Bell />
          <span className="notification-dot"></span>
        </div>
        <div className="profile-section">
          <div className="location">
            <span>Victor Zedomi</span>
            <ChevronDown />
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
