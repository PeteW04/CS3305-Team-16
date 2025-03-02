import React, { useEffect, useState } from "react";

function ProjectSummary({ project }) {
  

  if (project){
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
            <div>{project.manager}</div>
            <div>{project.deadline}</div>
          </div>
  
          <div className="separator"></div>
  
          <div>
            <h3 className="font-medium mb-2">Project Description</h3>
            <p className="text-muted">{project.description}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectSummary
