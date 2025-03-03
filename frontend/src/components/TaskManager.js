import React, { useState } from "react"
import "../CSS-files/TaskManager.css"

const TaskManager = () => {
  const [activeTab, setActiveTab] = useState("all");

const generateTasks = () => {
  const taskList = [];
  for (let i = 1; i <= 8; i++) { //generates 8 sample tasks
    taskList.push({
      _id: i,
      title: `Task ${i}`,
      status: "incomplete",  // status must be imported from db
      //tags to be added: "important", "notes", "links"
    });
  }
  return taskList;
};
const [tasks, setTasks] = useState(generateTasks());

  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id
          ? { ...task, status: task.status === "completed" ? "incomplete" : "completed" }
          : task
      )
    )
  }

  return (
    <div className="taskmanagercontainer">
    <div className="task-manager">
      <h2 className="TaskBoxHeader">Today's Tasks</h2>

      

      <div className="task-list">
        {tasks
          .slice()
          .sort((a, b) => (a.status === "incomplete" ? -1 : 1)) // Sort incomplete first
          .map((task) => (
            <div key={task._id} className="task-item">
              <div className="task-info">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => toggleTaskStatus(task._id)}
                />
                <span className="task-title">{task.title}</span>
              </div>
              <span className={`status ${task.status}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
          ))}
      </div>
    </div>
    </div>
  )
}

export default TaskManager