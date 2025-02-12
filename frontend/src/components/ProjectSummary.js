"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import "../CSS-files/ProjectSummary.css"

export default function ProjectSummary() {
  const generateProjects = () => {
    const projectList = [];
    for (let i = 1; i <= 8; i++) {
      projectList.push({
        name: `Project ${i}`,
        manager: `Name ${i}`,
        dueDate: "September 11, 2001",
        status: "in-progress", // "At risk" status should automatically be set when due date is less than 7 days away
      });
    }
    return projectList;
  };
  
  const [projects] = useState(generateProjects());

  return (
    <div className="container">
      
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
              <th>Project Summary</th>
              <th>Project Manager</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.name}</td>
                <td className="manager-name">{project.manager}</td>
                <td className="due-date">{project.dueDate}</td>
                <td>
                  <span className={`status ${project.status}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

