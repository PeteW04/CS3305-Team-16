import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import { initialTasks } from '../DummyData/tasks';
import '../CSS-files/App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Taskboard() {
  const [tasks, setTasks] = useState(initialTasks);

  const statusMap = {
    'To Do': 'todo',
    'On Progress': 'progress',
    'Done': 'done'
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === statusMap[status]);
  };

  const handleTaskDrop = (taskId, newStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: statusMap[newStatus] }
          : task
      )
    );
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      status: 'todo' // New tasks always go to 'todo'
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-6 overflow-y-auto">
        <TaskColumn 
          title="To Do" 
          tasks={getTasksByStatus('To Do')} 
          count={getTasksByStatus('To Do').length}
          accentColor="bg-indigo-500"
          onTaskDrop={handleTaskDrop}
          onAddTask={handleAddTask}
        />
        <TaskColumn 
          title="On Progress" 
          tasks={getTasksByStatus('On Progress')} 
          count={getTasksByStatus('On Progress').length}
          accentColor="bg-orange-500"
          onTaskDrop={handleTaskDrop}
        />
        <TaskColumn 
          title="Done" 
          tasks={getTasksByStatus('Done')} 
          count={getTasksByStatus('Done').length}
          accentColor="bg-green-500"
          onTaskDrop={handleTaskDrop}
        />
      </div>
    </DndProvider>
  );
}

export default Taskboard;