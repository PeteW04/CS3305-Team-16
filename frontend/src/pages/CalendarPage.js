import React from "react";
import Calendar from "../components/Calendar";
import Sidebar from "../components/sidebar";
import NavBar from '../components/NavBar';

const CalendarPage = () => {
    const [isMinimized, setIsMinimized] = React.useState(false);

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="min-h-screen bg-gray-50 h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 pt-16">
                <NavBar />
            </header>
            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
                <main className="p-6 flex-1 h-full overflow-y-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                        <p className="text-gray-600 mt-1">View and manage your tasks and deadlines</p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <Calendar />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CalendarPage; 