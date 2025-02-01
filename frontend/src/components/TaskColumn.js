import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

function TaskColumn({ title, tasks, count, accentColor }) {
  return (
    <div className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${accentColor}`}></div>
          <h2 className="font-semibold">{title}</h2>
          <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-sm">
            {count}
          </span>
        </div>
        {title === 'To Do' && (
          <button className="p-1 hover:bg-gray-200 rounded">
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className={`h-0.5 ${accentColor} mb-4 opacity-50`} />

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TaskColumn;