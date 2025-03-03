import React from "react";

function ProjectSummary({ project }) {
  if (!project) return <div className="text-muted p-4">Select a project to view details</div>;


  if (project) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="grid-cols-3">
            <div className="text-muted">Name</div>
            <div className="text-muted">Project Manager</div>
            <div className="text-muted">Due Date</div>
          </div>
        </div>
        <div className="card-content">
          <div className="grid-cols-3">
            <div>{project.title}</div>
            <div>{project.manager?.firstName} {project.manager?.lastName}</div>
            <div>
              {project.deadline ?
                new Date(project.deadline).toLocaleDateString() :
                "No deadline set"}
            </div>
          </div>

          <div className="separator"></div>

          <div>
            <h3 className="font-medium mb-2">Project Description</h3>
            <p className="text-muted">{project.description || "No description provided"}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectSummary
