import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import Taskboard from "../components/Taskboard";
import { useState } from "react";
import { getProject } from '../api/project.js'

function Task() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await getProject(projectId);
        setProjectName(project.title || "Project Not Found");
      } catch (error) {
        console.error("Error fetching project:", error);
        setProjectName("Error Loading Project");
      }
    };
    fetchProject();
  }, [projectId]);

  return (
    <div className="p-6">
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
    </div>
  );
}

export default Task;
