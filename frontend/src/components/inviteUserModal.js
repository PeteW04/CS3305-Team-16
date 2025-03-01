import { useState } from "react";
import { Search, X } from "lucide-react";
import { users } from "../DummyData/users";

function AssignUsersDialog({ project, onClose, onAssign }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(selectedUsers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Dialog Header */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Assign Users to Project</h2>
          <p className="text-sm text-gray-500 mt-1">Add team members to "{project?.name}".</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dialog Content */}
          <div className="p-6">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedUsers.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  if (!user) return null;

                  return (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{user.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* User List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleUser(user.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        selectedUsers.includes(user.id)
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedUsers.includes(user.id) && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No users found</div>
              )}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="p-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#4f46e5] rounded-lg hover:bg-[#4338ca]">
              Assign Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignUsersDialog;
