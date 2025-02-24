import React, { useEffect, useState } from "react";
import TaskColumn from './TaskColumn';
import { initialTasks } from '../DummyData/tasks';
import '../CSS-files/App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getProjectTasks } from '../api/project.js'
import { changeTaskStatus } from '../api/task.js'

function Taskboard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const tasks = await getProjectTasks(projectId);

      setTasks(tasks);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const statusMap = {
    'To Do': 'todo',
    'On Progress': 'progress',
    'Done': 'done'
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === statusMap[status]);
  };


  const handleTaskDrop = async (taskId, newStatus) => {
    console.log("Handle Task Drop taskID: ", taskId);
    console.log("Handle Task Drop newStatus: ", newStatus);
    console.log("Handle Task Drop transmitted status: ", statusMap[newStatus]);

    try {
      // Update on Backend
      const updatedTask = await changeTaskStatus(taskId, statusMap[newStatus]);
      
      // Update on Frontend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      // Update on Backend
      const response = await fetch(`http://localhost:5000/project/projectId/${projectId}/tasks/add`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          ...taskData, 
          status: 'New', 
        })
      });
  
      if (!response.ok) throw new Error('Failed to create task');
  
      // Update on Frontend
      const newTask = await response.json();


      setTasks(prevTasks => [...prevTasks, newTask]);
      console.log(newTask);

      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (taskData) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskData.id
          ? { ...task, ...taskData }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn 
          title="On Progress" 
          tasks={getTasksByStatus('On Progress')} 
          count={getTasksByStatus('On Progress').length}
          accentColor="bg-orange-500"
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn 
          title="Done" 
          tasks={getTasksByStatus('Done')} 
          count={getTasksByStatus('Done').length}
          accentColor="bg-green-500"
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    </DndProvider>
  );
}

export default Taskboard;