import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import ChatBubble from "../components/chatBubble";
import TaskManager from "../components/TaskManager";
import ProjectSummary from "../components/ProjectSummary";
import ProgressGauge from "../components/ProgressGauge";
import Calendar from "../components/Calendar";

function TestPage() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="flex h-screen pt-16">
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />

      <div className="dashboard" style={{flexDirection: "row",display:"flex", flexWrap: "wrap"}}>
        
        {/* tasklist */}
        <div><TaskManager /></div>
        {/* Progress Gauge */}
        <div><ProgressGauge /></div>
        {/* Calendar */}
        <div><Calendar /></div>
        {/* Project summary */}
        <div><ProjectSummary /></div>
      </div>

      {/* Main Content 
      <div className="flex-1 bg-gray-100 py-10 px-6">
        <h1 className="text-xl font-bold">Test Page for Components</h1>
        <ChatBubble
          sender={"Feilim"}
          message={"Hello blah blah blah blah"}
          time={Date}
          isSent={true}
        />
      </div>*/}
    </main>
  );
}

export default TestPage;
