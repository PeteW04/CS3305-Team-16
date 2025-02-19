import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import { initialTasks } from '../DummyData/tasks';
import '../CSS-files/App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Taskboard() {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    const statusMap = {
      'To Do': 'todo',
      'On Progress': 'progress',
      'Done': 'done'
    };
    return tasks.filter(task => task.status === statusMap[status] || task.status === status.toLowerCase());
  };

  const handleTaskDrop = (taskId, newStatus) => {
    const statusMap = {
      'To Do': 'todo',
      'On Progress': 'progress',
      'Done': 'done'
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: statusMap[newStatus] || newStatus.toLowerCase() }
          : task
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-6 overflow-y-auto">
        <TaskColumn 
          title="To Do" 
          tasks={getTasksByStatus('todo')} 
          count={getTasksByStatus('todo').length}
          accentColor="bg-indigo-500"
          onTaskDrop={handleTaskDrop}
        />
        <TaskColumn 
          title="On Progress" 
          tasks={getTasksByStatus('progress')} 
          count={getTasksByStatus('progress').length}
          accentColor="bg-orange-500"
          onTaskDrop={handleTaskDrop}
        />
        <TaskColumn 
          title="Done" 
          tasks={getTasksByStatus('done')} 
          count={getTasksByStatus('done').length}
          accentColor="bg-green-500"
          onTaskDrop={handleTaskDrop}
        />
      </div>
    </DndProvider>
  );
}

export default Taskboard;