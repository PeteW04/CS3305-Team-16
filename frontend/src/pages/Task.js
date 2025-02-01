import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import Taskboard from '../components/Taskboard';

function Task() {
  return (
    <div className="min-h-screen bg-gray-50 h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6 text-gray-600" />
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
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <User className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Manage and track your team's tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Taskboard />
        </div>
      </main>
    </div>
  );
}

export default Task;