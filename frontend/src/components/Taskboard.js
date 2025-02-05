import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import { initialTasks } from '../DummyData/tasks';
import '../CSS-files/App.css';

function Taskboard() {
  const [tasks, setTasks] = useState(initialTasks);

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex gap-6 overflow-y-auto">
      <TaskColumn 
        title="To Do" 
        tasks={getTasksByStatus('todo')} 
        count={getTasksByStatus('todo').length}
        accentColor="bg-indigo-500"
      />
      <TaskColumn 
        title="On Progress" 
        tasks={getTasksByStatus('progress')} 
        count={getTasksByStatus('progress').length}
        accentColor="bg-orange-500"
      />
      <TaskColumn 
        title="Done" 
        tasks={getTasksByStatus('done')} 
        count={getTasksByStatus('done').length}
        accentColor="bg-green-500"
      />
    </div>
  );
}

export default Taskboard;