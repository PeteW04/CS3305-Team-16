import React from "react";
import { Menu, Bell, Search, User } from "lucide-react";
import Taskboard from "../components/Taskboard";
import Sidebar from "../components/sidebar";
import { useState } from "react";
import ProfileModal from '../components/ProfileModal';

function Task() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const toggleSidebar = () => {
      setIsMinimized(!isMinimized);
    };
  

  return (
    <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-16">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6 text-gray-600" onClick={toggleSidebar} />
            </button>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-full"
              onClick={() => setShowProfileModal(true)}
            >
              <User className="w-6 h-6 text-gray-600" />
            </button>
            {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMinimized={isMinimized} toggleSidebar={() => setIsMinimized(!isMinimized)} />
        <main className="p-6 flex-1 h-full overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Task Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track your team's tasks
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Taskboard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Task;
