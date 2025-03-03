"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import "../CSS-files/ProjectSummary.css"

export default function ProjectSummary() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Retrieve authToken from localStorage
  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    async function fetchProjects() {
      if (!authToken) {
        setError("No authToken found. Please log in.")
        setLoading(false)
        return
      }
      try {
        const response = await fetch("http://localhost:5000/project", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [authToken])

  if (loading) return <div className="loading">Loading projects...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="project-summary">
      <div className="summary-container">
        <div className="summary-header">
          <h2>Project Summary</h2>
          <div className="filter-buttons">
            <button className="filter-button">
              Project <ChevronDown size={16} />
            </button>
            <button className="filter-button">
              Project Manager <ChevronDown size={16} />
            </button>
            <button className="filter-button">
              Status <ChevronDown size={16} />
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Project Manager</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.manager || "N/A"}</td>
                  <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}</td>
                  <td>
                    <span className={`status-label ${project.status.toLowerCase().replace(" ", "-")}`}>
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

