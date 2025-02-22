import React from 'react';
import { X, Edit, Trash2 } from 'lucide-react';

function TaskOptionsModal({ task, onClose, onEdit, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl shadow-lg w-64">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Task Options</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              onEdit(task);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Task</span>
          </button>
          
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskOptionsModal; 