import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import ChatBubble from "../components/ChatMessage";

function TestPage() {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <main className="flex h-screen pt-16">
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 py-10 px-6">
        <h1 className="text-xl font-bold">Test Page for Components</h1>
        <ChatBubble sender={"Feilim"} message={"Hello blah blah blah blah"} time={Date} isSent={true}/>
      </div>
      
    </main>
  );
}

export default TestPage;
