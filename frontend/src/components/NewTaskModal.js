import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getUsersInOrganization } from '../api/users';
import { addEmployeeToTask } from '../api/task';

function NewTaskModal({ onClose, onSubmit, projectId }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'todo'
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsersInOrganization();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // First create the task
    const newTask = await onSubmit(taskData);
    
    // If we have a selected user and the task creation was successful, assign the user
    if (selectedUser && newTask && newTask._id) {
      try {
        await addEmployeeToTask(newTask._id, selectedUser._id);
      } catch (error) {
        console.error('Error assigning user to task:', error);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
            </div>
            
            {/* User Assignment Section */}
            <div>
              <label className="block text-sm font-medium mb-1">Assign To</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              {/* Selected User */}
              {selectedUser && (
                <div className="mt-2 p-2 bg-gray-50 rounded-md flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs text-indigo-600 font-medium">
                        {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {/* User Search Results */}
              {searchTerm && !selectedUser && (
                <div className="mt-1 max-h-40 overflow-y-auto border border-gray-200 rounded-md shadow-sm">
                  {loading ? (
                    <div className="p-2 text-center">Loading...</div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user._id} 
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center"
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchTerm('');
                        }}
                      >
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-xs text-indigo-600 font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">No users found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal; 