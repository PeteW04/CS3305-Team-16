import { useState } from "react";
import { Calendar } from "lucide-react";

function CreateProjectModal({ onClose, onCreateProject }) {
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateProject({
      name,
      manager,
      dueDate,
      description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Create New Project</h2>
          <p className="text-sm text-gray-500 mt-1">Add a new project to your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                onClick={() => {
                  const date = prompt("Enter due date (MM/DD/YYYY):");
                  if (date) setDueDate(date);
                }}
              >
                <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                {dueDate || "Select a date"}
              </button>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Project Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                placeholder="Enter project description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;

