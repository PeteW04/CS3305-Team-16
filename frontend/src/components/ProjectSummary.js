"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "../CSS-files/ProjectSummary.css";

export default function ProjectSummary() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve authToken from localStorage
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchProjects() {
      if (!authToken) {
        setError("No authToken found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/project", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [authToken]);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ProjectSummary">
      <div className="container1">
        <div className="filter-container">
          <h1 className="ProjectBoxHeader">Project Summary</h1>
          <button className="filter-button">
            Project
            <ChevronDown className="icon" />
          </button>
          <button className="filter-button">
            Project Manager
            <ChevronDown className="icon" />
          </button>
          <button className="filter-button">
            Status
            <ChevronDown className="icon" />
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="project-column">Project</th>
                <th className="manager-column"></th>
                <th className="date-column">Due Date</th>
                <th className="status-column">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.title}</td>
                  <td className="manager-name">
                    {project.manager?.firstName} {project.manager?.lastName || "N/A"}
                  </td>
                  <td className="due-date">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                  </td>
                  <td>
                    <span className={`status ${project.status.toLowerCase().replace(" ", "-")}`}>
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

