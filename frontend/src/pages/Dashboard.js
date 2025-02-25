import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import TaskManager from "../components/TaskManager";
import ProjectSummary from "../components/ProjectSummary";
import ProgressGauge from "../components/ProgressGauge";
import Calendar from "../components/Calendar";
import MessageList from "../components/MessageList";
//import "../CSS-files/dashboard.css";

function Dashboard() {
    const [isMinimized, setIsMinimized] = useState(false);
  
    const toggleSidebar = () => {
      setIsMinimized(!isMinimized);
    };
  
    return (
        <main className="flex h-screen pt-16">
        {/* Sidebar */}
        <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
        <div className="dashboard" style={{display:"inline-flex"}}>
  
        {/* Dashboard */}
        <div 
  className="dashboardother" 
  style={{ 
    flexDirection: "row",
    display: "flex",
    flexWrap: "wrap",
    scrollbarWidth: 'thin',
    scrollbarColor: '#2b5ce6 #e9e9e9',
    borderRadius:"10px",
    overflowY: 'auto',
    // Webkit scrollbar properties
    '&::-webkit-scrollbar': { width: '6px' },
    '&::-webkit-scrollbar-track': { 
      background: '#f1f1f1',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#2b5ce6',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#1f49b2'
    }
  }}
>
          
          {/* Project summary */}
          <div><ProjectSummary /></div>
          {/* Calendar */}
          <div><Calendar /></div>
          {/* tasklist */}
          <div><TaskManager /></div>
          {/* Progress Gauge */}
          <div><ProgressGauge /></div>
  
  
        </div>
        <div className="chat">
          {/* Chat */}
          <div><MessageList /></div>
        </div>
        </div>
      </main>
    );
  }
  
  export default Dashboard;