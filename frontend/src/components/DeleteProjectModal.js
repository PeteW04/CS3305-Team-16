import { AlertTriangle } from "lucide-react"

function DeleteProjectDialog({ project, onClose, onDelete }) {
  const handleDelete = () => {
    onDelete()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={24} />
            Delete Project
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete "{project?.name}"? This action cannot be undone.
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600">
            All project data, tasks, and assignments will be permanently removed. Team members will no longer have
            access to this project.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProjectDialog
