import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { useDrop } from 'react-dnd';
import NewTaskModal from './NewTaskModal';

function TaskColumn({ title, tasks, count, accentColor, onTaskDrop, onAddTask, onEditTask, onDeleteTask }) {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const statusMap = {
    "To Do": "todo",
    "In Progress": "progress",
    "Done": "done"
  }
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onTaskDrop(item._id, statusMap[title]),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  console.log(tasks);

  const handleAddTask = (taskData) => {
    onAddTask(taskData);
    setShowNewTaskModal(false);
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 h-screen overflow-y-auto ${isOver ? 'bg-gray-100' : ''
        }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${accentColor}`}></div>
          <h2 className="font-semibold">{title}</h2>
          <span className="bg-gray-200 px-2.5 py-0.5 rounded-full text-sm">
            {count}
          </span>
        </div>
        {title === 'To Do' && (
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={() => setShowNewTaskModal(true)}
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={`h-0.5 ${accentColor} mb-4 opacity-50`} />

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onSubmit={handleAddTask}
        />
      )}
    </div>
  );
}

export default TaskColumn;