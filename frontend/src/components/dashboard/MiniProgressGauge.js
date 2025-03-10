import { useEffect, useState } from 'react';
import { getTasksByUserID } from '../../api/task';
import { useAuth } from '../../context/AuthContext';

const MiniProgressGauge = () => {
  const [tasks, setTasks] = useState({
    completedTasks: 0,
    inProgressTasks: 0,
    incompleteTasks: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        if (user && user._id) {
          const userTasks = await getTasksByUserID(user._id);
          
          setTasks({
            completedTasks: userTasks.filter(task => task.status === 'done').length,
            inProgressTasks: userTasks.filter(task => task.status === 'progress').length,
            incompleteTasks: userTasks.filter(task => task.status === 'todo').length,
            total: userTasks.length
          });
        } else {
          setTasks({
            completedTasks: 0,
            inProgressTasks: 0,
            incompleteTasks: 0,
            total: 0
          });
        }
      } catch (err) {
        console.error("Error fetching tasks:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserTasks();
  }, [user]);

  const completedPercent = tasks.total > 0
    ? Math.round((tasks.completedTasks / tasks.total) * 100)
    : 0;

  // Reduced radius to ensure circle fits within container
  const radius = 48; // Reduced from 58
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference}`;
  const strokeDashoffset = circumference - (completedPercent / 100) * circumference;

  if (loading) return <div className="h-full flex items-center justify-center">Loading progress...</div>;
  if (error) return <div className="h-full flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full border border-2 flex flex-col border-indigo-400 bg-white rounded-lg p-4">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Overall Progress</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg
            className="transform -rotate-90 w-full h-full"
            viewBox="0 0 120 120" // Keeping viewBox the same for proper scaling
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="10" // Slightly increased stroke width
              fill="none"
            />
            
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#10b981" 
              strokeWidth="10" 
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transition: 'stroke-dashoffset 0.5s ease'
              }}
            />
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold">{completedPercent}%</span>
            <span className="text-sm text-gray-500">Complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mt-4">
        <div className="bg-green-50 rounded p-2">
          <div className="text-sm font-medium text-green-700">{tasks.completedTasks}</div>
          <div className="text-xs text-gray-500">Done</div>
        </div>
        <div className="bg-orange-50 rounded p-2">
          <div className="text-sm font-medium text-orange-700">{tasks.inProgressTasks}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-sm font-medium text-gray-700">{tasks.incompleteTasks}</div>
          <div className="text-xs text-gray-500">Todo</div>
        </div>
      </div>
    </div>
  );
};

export default MiniProgressGauge;
