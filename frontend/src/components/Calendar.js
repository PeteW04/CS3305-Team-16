import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../api/project';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projects, setProjects] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        async function fetchProjects() {
            if (!token) {
                setError("No token found. Please log in.");
                setLoading(false);
                return;
            }
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, [token]);

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getProjectsForDate = (date) => {
        return projects.filter(project => {
            const deadlineDate = project.deadline ? new Date(project.deadline) : null;
            return deadlineDate && deadlineDate.toDateString() === date.toDateString();
        });
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push({ isEmpty: true, number: '', projectCount: 0 });
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayProjects = getProjectsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            days.push({
                isEmpty: false,
                number: day,
                projectCount: dayProjects.length,
                isToday,
                hasProjects: dayProjects.length > 0
            });
        }

        return days;
    };

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-gray-600"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>
                <h2 className="text-lg font-semibold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button 
                    onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg flex items-center gap-1 text-gray-600"
                >
                    Next
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 p-1.5 text-sm bg-white">
                        {day}
                    </div>
                ))}
                {renderCalendar().map((day, index) => (
                    <div 
                        key={index} 
                        onClick={() => {
                            if (!day.isEmpty) {
                                const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.number);
                                setSelectedDate(clickedDate);
                            }
                        }}
                        className={`
                            min-h-[80px] p-2 bg-white relative cursor-pointer transition-colors
                            ${day.isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            ${day.hasProjects ? 'border-l-2 border-l-green-400' : ''}
                            ${day.isEmpty ? 'bg-gray-50' : ''}
                        `}
                    >
                        <span className="text-sm text-gray-600">{day.number}</span>
                        {day.projectCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                {day.projectCount}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {selectedDate && (
                <div className="mt-4 border-t pt-4">
                    <h3 className="text-md font-semibold mb-2">Projects due on {selectedDate.toDateString()}</h3>
                    <div className="space-y-1.5">
                        {getProjectsForDate(selectedDate).map(project => (
                            <div key={project._id} className="p-2 bg-gray-50 rounded-lg text-sm">
                                <h4 className="font-medium">{project.name}</h4>
                                <p className="text-xs text-gray-600">{project.description}</p>
                                <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-800 mt-1">
                                    Due: {new Date(project.deadline).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar; 