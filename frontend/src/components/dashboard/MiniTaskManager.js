import React, { useState, useEffect } from 'react';
import { getTasksByUserID } from '../../api/task';
import { useAuth } from '../../context/AuthContext';
import PriorityBadge from '../PriorityBadge';

const MiniTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        if (user && user._id) {
          const userTasks = await getTasksByUserID(user._id);
          
          // Sort by due date and take first 4
          const sortedTasks = userTasks
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 4);
          
          setTasks(sortedTasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
        setError(err.message);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserTasks();
  }, [user]);

  if (loading) return <div className="h-full flex items-center justify-center">Loading tasks...</div>;
  if (error) return <div className="h-full flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Today's Tasks</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No tasks for today</div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="mb-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{task.title}</span>
                <PriorityBadge priority={task.priority} status={task.status} />
              </div>
              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MiniTaskManager;
