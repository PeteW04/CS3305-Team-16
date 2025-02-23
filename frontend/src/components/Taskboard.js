import React, { useEffect, useState } from "react";
import TaskColumn from './TaskColumn';
import { initialTasks } from '../DummyData/tasks';
import '../CSS-files/App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Taskboard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchTasks() {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      try {
        console.log(`Fetching tasks for projectId: ${projectId}`);  // ✅ Log projectId
        const response = await fetch(`http://localhost:5000/project/${projectId}/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
  
        if (!response.ok) throw new Error('Failed to fetch tasks');
  
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid tasks response");
        }

        setTasks(data);  // ✅ Ensure the correct structure
  
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]); // ✅ Prevent undefined tasks
      }
    };
  
    if (projectId) fetchTasks();
  }, [token, projectId]); // ✅ Added projectId to dependencies

  const statusMap = {
    'To Do': 'todo',
    'On Progress': 'progress',
    'Done': 'done'
  };

  const getTasksByStatus = (status) => {
    if (!Array.isArray(tasks)) {
        console.error("Tasks is not an array", tasks);
        return []; // ✅ Return empty array to avoid crashes
    }
    return tasks.filter(task => task.status === statusMap[status]);
  };


  const handleTaskDrop = async (taskId, newStatus) => {
    // Update on Backend
    try {
      const response = await fetch(`http://localhost:5000/task/status/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusMap[newStatus] }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
  
      const updatedTask = await response.json();
      
      // Update on Frontend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(`http://localhost:5000/project/projectId/${projectId}/tasks/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...taskData, 
          status: 'New', 
        })
      });
  
      if (!response.ok) throw new Error('Failed to create task');
  
      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, newTask]); // Update UI
    } catch (error) {
      console.error('Error creating task:', error);
    }
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