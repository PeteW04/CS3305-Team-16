import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { updatingProject } from '../api/project.js'

function EditProjectDialog({ project, onClose, onSave }) {
  const [title, setTitle] = useState("")
  const [manager, setManager] = useState("")
  const [deadline, setDeadline] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (project) {
      setTitle(project.title || "")
      setManager(`${project.manager.firstName} ${project.manager.lastName}` || "")
      setDeadline(new Date(project.deadline).toLocaleDateString() || "")
      setDescription("Create a user flow of social application design")
    }
  }, [project])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        title,
        manager,
        deadline,
        description,
      }
      // Call the updatingProject function
      console.log('Handle Submit');
      console.log(project._id, data);
      const updatedProject = await updatingProject(project._id, data);

      onSave(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Edit Project</h2>
          <p className="text-sm text-gray-500 mt-1">Update the project details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                Project Manager
              </label>
              <input
                id="manager"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  // In a real app, this would open a date picker
                  const date = prompt("Enter due date (MM/DD/YYYY):", deadline)
                  if (date) setDeadline(date)
                }}
              >
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                {deadline || "Select a date"}
              </button>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProjectDialog