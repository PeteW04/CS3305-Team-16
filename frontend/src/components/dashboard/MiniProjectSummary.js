import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/project';

function MiniProjectSummary({ maxItems = 4 }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.slice(0, maxItems));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [maxItems]);

  if (loading) return <div className="h-full flex items-center justify-center">Loading projects...</div>;
  if (error) return <div className="h-full flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Project Summary</h2>
        <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-xs">
            <tr>
              <th className="text-left pb-2">Name</th>
              <th className="text-left pb-2">Due</th>
              <th className="text-left pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {projects.map((project, index) => (
              <tr key={project._id || index}>
                <td className="py-1.5">{project.title}</td>
                <td className="py-1.5">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                </td>
                <td className="py-1.5">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    project.status === 'done' ? 'bg-green-100 text-green-800' :
                    project.status === 'progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MiniProjectSummary; 