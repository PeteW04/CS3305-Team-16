import React from "react";
import { Home, MessageSquare, ListChecks, Users, Settings, Layout, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from 'react-router-dom';


function Sidebar({ isMinimized, toggleSidebar }) {
  return (
    <nav className={`h-screen bg-white border-r border-gray-300 p-4 transition-all ${isMinimized ? "w-20" : "w-64"}`}>
      {/* Profile Section */}
      <div className="flex items-center space-x-2 px-2 py-4">
        <Layout className="w-8 h-8 text-indigo-600" />
        {!isMinimized && <span className="text-xl font-bold text-gray-900">Clack</span>}
      </div>

      {/* Menu Section */}
      <ul className="mt-6 space-y-2">
        <Link to="/"><SidebarItem isMinimized={isMinimized} icon={<Home size={20} />} text="Home" /></Link>
        <Link to="#"><SidebarItem isMinimized={isMinimized} icon={<MessageSquare size={20} />} text="Messages" /></Link>
        <Link to="/tasks"><SidebarItem isMinimized={isMinimized} icon={<ListChecks size={20} />} text="Projects" /></Link>
        <Link to="#"><SidebarItem isMinimized={isMinimized} icon={<Users size={20} />} text="Members" /></Link>
        <Link to="#"><SidebarItem isMinimized={isMinimized} icon={<Settings size={20} />} text="Settings" /></Link>
      </ul>

      
      {/* Divider */}
      {!isMinimized && <div className="h-px bg-[#787486]/20 my-6" />}

      {/* Projects Section */}
      {!isMinimized && (
        <div className="mt-6 px-2">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-2">My Projects</h2>
          <ul className="space-y-2">
            <ProjectItem name="Mobile App" color="bg-green-500" />
            <ProjectItem name="Website Redesign" color="bg-yellow-500" />
            <ProjectItem name="Design System" color="bg-purple-400" />
            <ProjectItem name="Wireframes" color="bg-blue-500" />
            <ProjectItem name="Software App" color="bg-green-500" />
          </ul>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute bottom-4 left-4 p-2 bg-indigo-500 rounded-full text-white"
      >
        {!isMinimized ? <ChevronsLeft size={24}/> : <ChevronsRight size={24}/>}
      </button>
    </nav>
  );
}

function SidebarItem({ isMinimized, icon, text }) {
  return (
    <li className="flex items-center space-x-2 px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer transition-all">
      {icon}
      {!isMinimized && <span className="text-gray-800">{text}</span>}
    </li>
  );
}

function ProjectItem({ name, color }) {
  return (
    <li className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-all">
      <span className={`w-3 h-3 ${color} rounded-full`}></span>
      <span>{name}</span>
    </li>
  );
}

export default Sidebar;

