import React, { useEffect, useState } from 'react';
import { MoreHorizontal, User } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { useDrag } from 'react-dnd';
import TaskOptionsModal from './TaskOptionsModal';
import EditTaskModal from './EditTaskModal';
import { getUserById } from '../api/users';

function TaskCard({ task, onEdit, onDelete }) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { _id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    console.log(task);
    
    // If task has a user ID but not a populated user object, fetch the user
    if (task.user && typeof task.user !== 'object') {
      setLoadingUser(true);
      getUserById(task.user)
        .then(userData => {
          setUserName(`${userData.firstName} ${userData.lastName}`);
        })
        .catch(err => {
          console.error("Error fetching user:", err);
          setUserName("Unknown User");
        })
        .finally(() => {
          setLoadingUser(false);
        });
    }
  }, [task]);
  
  const handleEdit = (taskData) => {
    onEdit(taskData);
    setShowEditModal(false);
  };

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-sm ${isDragging ? 'opacity-50' : ''
        } cursor-move`}
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} status={task.status} />
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={(e) => {
            e.stopPropagation();
            setShowOptionsModal(true);
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      
      {/* User assignment section */}
      <div className="flex items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
        <User className="w-3 h-3 mr-1" />
        {task.user ? (
          <span>
            {typeof task.user === 'object' && task.user.firstName 
              ? `${task.user.firstName} ${task.user.lastName}`
              : loadingUser 
                ? "Loading user..." 
                : userName || "Unknown User"}
          </span>
        ) : (
          <span className="italic">No user assigned to task</span>
        )}
      </div>

      {showOptionsModal && (
        <TaskOptionsModal
          task={task}
          onClose={() => setShowOptionsModal(false)}
          onEdit={() => {
            setShowOptionsModal(false);
            setShowEditModal(true);
          }}
          onDelete={onDelete}
        />
      )}

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}

export default TaskCard;