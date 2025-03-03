import React, { useEffect, useState } from "react";
import { Calendar, User } from "lucide-react";
import AssignUsersDialog from "../components/inviteUserModal";
import EditProjectDialog from "../components/EditProjectModal";
import DeleteProjectDialog from "../components/DeleteProjectModal";
import DropdownMenu from "../components/DropdownMenu";
import ProjectSummary from "../components/ProjectOverview";
import "../CSS-files/ProjectPage.css";
import { getProjects } from '../api/project.js'

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedProjectName, setSelectedProjectName] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projects = await getProjects();
        setProjects(projects);
        if (projects.length > 0) {
          setSelectedProjectName(projects[0].title);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  const currentProject =
    projects.find((p) => p.title === selectedProjectName) || projects[0];

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="project-content">
          <div className="project-header">
            <div>
              <h1 className="project-title">Projects Overview</h1>
              <div className="project-meta">
                <Calendar size={16} />
                <span>5 Projects</span>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="invite-button"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <User size={16} />
                <span>Invite</span>
              </button>

              <div className="avatar-group">
                <div className="avatar">
                  <img src="/placeholder-user1.jpg" alt="User 1" />
                </div>
                <div className="avatar">
                  <img src="/placeholder-user2.jpg" alt="User 2" />
                </div>
                <div className="avatar">
                  <img src="/placeholder-user3.jpg" alt="User 3" />
                </div>
                <div className="avatar">
                  <img src="/placeholder-user4.jpg" alt="User 4" />
                </div>
                <div className="avatar-more">+2</div>
              </div>

              <DropdownMenu
                onEdit={() => setIsEditDialogOpen(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
              />
            </div>
          </div>

          {/* Project Name Filter */}
          <div className="project-filter">
            <label htmlFor="projectName"></label>
            <select
              id="projectName"
              value={selectedProjectName}
              onChange={(e) => setSelectedProjectName(e.target.value)}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project.title}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          { /* Display Project Summary for the Selected Project */}
          <ProjectSummary project={currentProject} />


        </div>
      </div>

      {/* Modals */}
      {isEditDialogOpen && (
        <EditProjectDialog
          project={currentProject}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={(updatedProject) => {
            setProjects((prevProjects) =>
              prevProjects.map((p) =>
                p._id === updatedProject._id ? updatedProject : p
              )
            );
            setIsEditDialogOpen(false);
          }}
        />
      )}

      {isAssignDialogOpen && (
        <AssignUsersDialog
          project={currentProject}
          onClose={() => setIsAssignDialogOpen(false)}
          onAssign={(userIds) => {
            console.log("Assigning users:", userIds);
            setIsAssignDialogOpen(false);
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteProjectDialog
          project={currentProject}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={(deletedProject) => {
            console.log("Deleting project:", currentProject._id);
            setProjects((prevProjects) => prevProjects.filter((p) => p._id !== deletedProject._id));
            setIsDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default ProjectPage;