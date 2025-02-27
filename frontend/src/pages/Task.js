import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import Taskboard from "../components/Taskboard";
import Sidebar from "../components/sidebar";
import { useState } from "react";
import NavBar from '../components/NavBar';
import { getProject } from '../api/project.js'

function Task() {
    const [isMinimized, setIsMinimized] = useState(false);
    const { projectId } = useParams();
    const [projectName, setProjectName] = useState(null);

    useEffect(() => {
      const fetchProject = async () => {
          try {
              const project = await getProject(projectId);
              setProjectName(project.title || "Project Not Found");  // Assuming `data.name` contains project name
          } catch (error) {
              console.error("Error fetching project:", error);
              setProjectName("Error Loading Project");
          }
      };

      fetchProject();
    }, [projectId]);

    const toggleSidebar = () => {
      setIsMinimized(!isMinimized);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <NavBar />
        </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMinimized={!isMinimized} toggleSidebar={() => setIsMinimized(!isMinimized)} />
        <main className="p-6 flex-1 h-full overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {projectName}
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Task Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and track your team's tasks
            </p>
          </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <Taskboard projectId={projectId} />
            </div>
          </main>
        </div>
      </div>
    );
}

export default Task;
