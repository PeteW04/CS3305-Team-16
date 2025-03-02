import React from "react";
import TaskManager from "../components/TaskManager";
import ProjectSummary from "../components/ProjectSummary";
import ProgressGauge from "../components/ProgressGauge";
import Calendar from "../components/Calendar";
import MessageList from "../components/MessageList";
import "../CSS-files/Dashboard.css";

function Dashboard() {
  return (
    <div className="p-6">
      <div className="dashboard" style={{display:"flex", flexDirection: "row"}}>
        <div className="dashboardother" style={{flexDirection: "row", display:"flex", flexWrap: "wrap"}}>
          <div><ProjectSummary /></div>
          <div><Calendar /></div>
          <div><TaskManager /></div>
          <div><ProgressGauge /></div>
        </div>
        <div className="chat" style={{position:"sticky", right:"0", top:"0", width:"fit-content", height:"100vh"}}>
          <div><MessageList /></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
