import React from "react";
import "../CSS-files/Dashboard.css";
import MiniCalendar from "../components/dashboard/MiniCalendar";
import MiniProjectSummary from "../components/dashboard/MiniProjectSummary";
import MiniProgressGauge from "../components/dashboard/MiniProgressGauge";
import MiniTaskManager from "../components/dashboard/MiniTaskManager";

function Dashboard() {
  return (
    <div className="p-6">
      <div className="outer-container p-4 bg-white rounded-lg shadow-lg" >
        <div className="dashboard-grid" style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem"
        }}>
          <div className="h-full"><MiniProjectSummary /></div>
          <div className="h-full"><MiniCalendar /></div>
          <div className="h-full"><MiniTaskManager /></div>
          <div className="h-full"><MiniProgressGauge /></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
