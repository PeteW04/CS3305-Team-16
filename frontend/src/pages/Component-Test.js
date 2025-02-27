import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import ChatBubble from "../components/chatBubble";
import TaskManager from "../components/TaskManager";
import ProjectSummary from "../components/ProjectSummary";
import ProgressGauge from "../components/ProgressGauge";
import Calendar from "../components/Calendar";
import MessageList from "../components/MessageList";

function TestPage() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="flex h-screen pt-16">
      {/* Sidebar */}
      <Sidebar isMinimized={!isMinimized} toggleSidebar={toggleSidebar} />
      <div className="dashboard" style={{display:"inline-flex"}}>

      {/* Dashboard */}
      <div className="dashboardother" style={{flexDirection: "row",display:"flex", flexWrap: "wrap"}}>
        
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
