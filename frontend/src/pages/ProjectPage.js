import React, { useEffect, useState } from "react";
import { Calendar, User } from "lucide-react";
import AssignUsersDialog from "../components/inviteUserModal";
import EditProjectDialog from "../components/EditProjectModal";
import DeleteProjectDialog from "../components/DeleteProjectModal";
import DropdownMenu from "../components/DropdownMenu";
import ProjectSummary from "../components/ProjectOverview";
import "../CSS-files/ProjectPage.css";
import { getUsersInOrganization, getProfilePictureUrl } from "../api/users";
import { getProjects, gettingProjectByUser } from '../api/project.js'
import { useAuth } from '../context/AuthContext';

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const { user } = useAuth();

  const isManager = user && user.role === 'manager';

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projects = await gettingProjectByUser(user._id);  
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

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const orgUsers = await getUsersInOrganization();
        setEmployees(orgUsers);
      } catch (error) {
        console.error("Error fetching organisation users:", error);
      }
    }
    fetchEmployees();
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
              {isManager && <button
                className="invite-button"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <User size={16} />
                <span>Invite</span>
              </button>}
              
              {isManager &&
              <div className="avatar-group">
                {employees.slice(0, 4).map((employee) => (
                  <div key={employee._id} className="avatar">
                    {employee.profilePicture ? (
                      <img
                        src={getProfilePictureUrl(employee.profilePicture)}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                ))}
                {employees.length > 4 && (
                  <div className="avatar-more">+{employees.length - 4}</div>
                )}
              </div>}
              
              {isManager &&
              <DropdownMenu
                onEdit={() => setIsEditDialogOpen(true)}
                onDelete={() => setIsDeleteDialogOpen(true)}
              />}
              
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