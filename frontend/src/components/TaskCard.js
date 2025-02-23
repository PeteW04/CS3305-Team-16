import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { useDrag } from 'react-dnd';

function TaskCard({ task }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { _id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-sm ${
        isDragging ? 'opacity-50' : ''
      } cursor-move`}
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} status={task.status} />
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
    </div>
  );
}

export default TaskCard;