import React, { useState} from "react";
import { House } from 'lucide-react'
import Sidebar from "../components/sidebar";

function TestPage() {
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    }
    
    
  return (
    <main className="flex h-screen pt-16">
        
      {/* Sidebar */}
      <div className={`w-64 bg-white-100 text-white border border-gray-400 border-1 ${isMinimized ? "w-20" : "w-64"} transition-all`}>
        <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 py-10 px-6">
            <h1 className="text-x1 font-bold">Test Page for Components</h1>
        </div>

    </main>
  );
}

export default TestPage;
