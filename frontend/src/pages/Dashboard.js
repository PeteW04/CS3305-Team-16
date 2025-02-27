import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import TaskManager from "../components/TaskManager";
import ProjectSummary from "../components/ProjectSummary";
import ProgressGauge from "../components/ProgressGauge";
import EamonCalendar from "../components/eamonCalendar";
import MessageList from "../components/MessageList";
import NavBar from "../components/NavBar";
import "../CSS-files/Dashboard.css"; 

function Dashboard() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="flex h-screen pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      <div className="dashboard" style={{ display: "flex", flex: 1, height: "100%",paddingBottom: "1%" }}>
        {/* Dashboard */}
        <div
          className="dashboardother"
          style={{
            flexDirection: "row",
            display: "flex",
            flexWrap: "wrap",
            overflowY: "auto",
            paddingBottom: "5%",
            height: "100%",
          }}
        >
          {/* Project summary */}
          <div>
            <ProjectSummary />
          </div>
          {/* Calendar */}
          <div>
            <EamonCalendar />
          </div>
          {/* Tasklist */}
          <div>
            <TaskManager />
          </div>
          {/* Progress Gauge */}
          <div>
            <ProgressGauge />
          </div>
        </div>
        <div className="chat">
          {/* Chat */}
          <div>
            <MessageList />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
