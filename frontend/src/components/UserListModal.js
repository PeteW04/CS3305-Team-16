import React, { useEffect, useState } from 'react';
import { X, Settings, User as UserIcon, Plus, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserById } from '../api/users';
import { getTasksByUserID } from '../api/task';

function UserListModal({ onClose, userId }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([])
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    console.log("Fetching USER")
    const fetchUserInfo = async () => {
      try {
        const user = await getUserById(userId);
        setUser(user);
        const userTasks = await getTasksByUserID(userId);
        console.log(userTasks);
        setTasks(userTasks);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const numberOfTasks = tasks?.length || 0;
  if (isLoading) {
    return <div>Loading...</div>; // Or your LoadingSpinner component
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="absolute right-4 top-20 w-80 bg-white rounded-xl shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <UserIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Profile Information</h4>
            {/* <Link
              to="/edit-profile"
              className="text-sm text-indigo-600 hover:underline"
              onClick={onClose}
            >
              Edit
            </Link> */}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Projects:</span>
              <span className="text-sm font-medium">{user.projects || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tasks Assigned:</span>
              <span className="text-sm font-medium">{numberOfTasks}</span>
            </div>
          </div>
        </div>

        {/* Task Actions */}
        <div className="p-4 border-b">
          <h4 className="font-semibold mb-3">Task Actions</h4>
          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => {
                // Add logic to assign a task
                console.log('Assign Task');
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Assign Task</span>
            </button>
            {/* <Link
              to="/tasks"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
              onClick={onClose}
            >
              <List className="w-4 h-4" />
              <span>View All Tasks</span>
            </Link> */}
          </div>
        </div>

        {/* Project Actions */}
        <div className="p-4 border-b">
          <h4 className="font-semibold mb-3">Project Actions</h4>
          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg"
              onClick={() => {
                // Add logic to assign a project
                console.log('Assign Project');
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Assign Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListModal;