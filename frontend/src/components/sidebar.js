import React, { useEffect, useState } from "react";
import { Home, MessageSquare, ListChecks, Users, Settings, Layout, ChevronsLeft, ChevronsRight, Calendar } from "lucide-react";
import { Link } from 'react-router-dom';
import { getProjects } from '../api/project.js'

function Sidebar({ isMinimized, toggleSidebar }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projects = await getProjects();
        setProjects(projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []); 

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <nav className={`h-screen bg-white border-r border-gray-300 p-4 transition-all ${isMinimized ? "w-20" : "w-64"}`}>
      {/* Profile Section */}
      <Link to="/dashboard" className="flex items-center space-x-2 px-2 py-4">
        <Layout className="w-8 h-8 text-indigo-600" />
        {!isMinimized && <span className="text-xl font-bold text-gray-900">Clack</span>}
      </Link>

      {/* Menu Section */}
      <ul className="mt-6 space-y-2">
        <Link to="/dashboard"><SidebarItem isMinimized={isMinimized} icon={<Home size={20} />} text="Home" /></Link>
        <Link to="/message"><SidebarItem isMinimized={isMinimized} icon={<MessageSquare size={20} />} text="Messages" /></Link>
        <Link to="/projects"><SidebarItem isMinimized={isMinimized} icon={<ListChecks size={20} />} text="Projects" /></Link>
        <Link to="/calendar"><SidebarItem isMinimized={isMinimized} icon={<Calendar size={20} />} text="Calendar" /></Link>
        <Link to="/userprofile"><SidebarItem isMinimized={isMinimized} icon={<Settings size={20} />} text="Settings" /></Link>
      </ul>

      
      {/* Divider */}
      {!isMinimized && <div className="h-px bg-[#787486]/20 my-6" />}

      {/* Projects Section */}
      {!isMinimized && (
        <div className="mt-6 px-2">
          <h2 className="text-gray-500 text-sm uppercase font-semibold mb-2">My Projects</h2>
          <ul className="space-y-2">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectItem key={project._id} projectId={project._id} name={project.title} color="bg-blue-500" />
              ))
            ) : (
              <p className="text-gray-400">You're not working on any projects</p>
            )}
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

function ProjectItem({ projectId, name, color }) {
  return (
    <li className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer transition-all">
      <Link to={`/tasks/${projectId}`} className="flex items-center space-x-2 p-2 w-full">
        <span className={`w-3 h-3 ${color} rounded-full`}></span>
        <span>{name}</span>
      </Link>
    </li>
  );
}

export default Sidebar;

