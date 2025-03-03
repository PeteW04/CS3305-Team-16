import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../api/project';
import '../CSS-files/Calendar.css'; // Import the CSS file

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
        <div className="calendar-container">
            <div className="calendar">
                <div className="calendar-header">
                    <h2>
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </h2>
                    <div className="nav-buttons">
                        <button
                            className="nav-buttonl"
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                        >
                            {/* Previous month arrow */}
                        </button>
                        <button
                            className="nav-buttonr"
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                        >
                            {/* Next month arrow */}
                        </button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="day-name">
                            {day}
                        </div>
                    ))}
                    {renderCalendar().map((day, index) => (
                        <button
                            key={index}
                            className={`date-button 
                                ${day.isEmpty ? 'prev-month' : ''} 
                                ${day.isToday ? 'current-date' : ''} 
                                ${selectedDate && selectedDate.getDate() === day.number ? 'selected' : ''}`}
                            onClick={() => {
                                if (!day.isEmpty) {
                                    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.number);
                                    setSelectedDate(clickedDate);
                                }
                            }}
                        >
                            {day.number}
                            {day.projectCount > 0 && (
                                <span className="project-count">
                                    {day.projectCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {selectedDate && (
                    <div className="selected-date-projects">
                        <h3>Projects due on {selectedDate.toDateString()}</h3>
                        <div className="projects-list">
                            {getProjectsForDate(selectedDate).map(project => (
                                <div key={project._id} className="project-item">
                                    <h4>{project.name}</h4>
                                    <p>{project.description}</p>
                                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;