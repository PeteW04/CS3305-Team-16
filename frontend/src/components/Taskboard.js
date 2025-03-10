import React, { useEffect, useState } from "react";
import TaskColumn from './TaskColumn';
import '../CSS-files/App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getProjectTasks, addTaskToProject, deleteTaskFromProject } from '../api/project.js'
import { changeTaskStatus, editTask } from '../api/task.js'

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

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };


  const handleTaskDrop = async (taskId, newStatus) => {
    console.log("Handle Task Drop taskID: ", taskId);
    console.log("Handle Task Drop newStatus: ", newStatus);
    console.log("Handle Task Drop transmitted status: ", newStatus);

    try {
      // Update on Backend
      const updatedTask = await changeTaskStatus(taskId, newStatus);

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

  const handleAddTask = async (taskData, userId) => {
    try {
      // Update on Backend
      console.log("handleAddTask taskData: ", taskData);
      const newTask = await addTaskToProject(projectId, taskData);

      // Update on Frontend
      setTasks(prevTasks => [...prevTasks, newTask]);
      console.log(newTask);

      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async (taskData) => {
    console.log('handleEditTask taskData: ', taskData);
    try {
      // Update on Backend
      const updatedTask = await editTask(taskData);

      // Update on Frontend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === updatedTask._id
            ? { ...task, ...taskData }
            : task
        )
      );
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log('handleDeleteTask projectId: ', projectId);
    console.log('handleDeleteTask taskId: ', taskId);
    try {
      // Update on Backend
      const deletedTask = await deleteTaskFromProject(projectId, taskId);
      console.log(deletedTask);

      // Update on Frontend
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={getTasksByStatus('progress')}
          count={getTasksByStatus('progress').length}
          accentColor="bg-orange-500"
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        <TaskColumn
          title="Done"
          tasks={getTasksByStatus('done')}
          count={getTasksByStatus('done').length}
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