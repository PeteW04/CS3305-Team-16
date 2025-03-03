import React from "react";
import "../CSS-files/Dashboard.css";
import MiniCalendar from "../components/dashboard/MiniCalendar";
import MiniProjectSummary from "../components/dashboard/MiniProjectSummary";
import MiniProgressGauge from "../components/dashboard/MiniProgressGauge";
import MiniTaskManager from "../components/dashboard/MiniTaskManager";

function Dashboard() {
  return (
    <div className="p-6">
      <div className="outer-container" style={{
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div className="dashboard-grid" style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem"
        }}>
          <div><MiniProjectSummary /></div>
          <div><MiniCalendar /></div>
          <div><MiniTaskManager /></div>
          <div><MiniProgressGauge /></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
