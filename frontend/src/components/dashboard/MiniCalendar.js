import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getProjects } from '../../api/project';

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ isEmpty: true });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const projectsForDay = projects.filter(project => {
        const deadline = new Date(project.deadline);
        return deadline.toDateString() === date.toDateString();
      });

      days.push({
        number: day,
        date: date,
        isToday: date.toDateString() === new Date().toDateString(),
        hasProjects: projectsForDay.length > 0,
        projectCount: projectsForDay.length,
        isEmpty: false
      });
    }

    return days;
  };

  const handleDateClick = (day) => {
    if (!day.isEmpty) {
      setSelectedDate(day.date);
    }
  };

  const getProjectsForDate = (date) => {
    return projects.filter(project => {
      const deadline = project.deadline ? new Date(project.deadline) : null;
      return deadline && deadline.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Calendar</h2>
        <div className="flex space-x-1">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-600 mb-1">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-100 flex-1 rounded-lg overflow-hidden">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        {renderCalendar().map((day, index) => (
          <div 
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              p-1 relative text-center text-xs
              ${day.isToday ? 'bg-blue-50' : 'bg-white'}
              ${day.hasProjects ? 'border-l-2 border-l-green-400' : ''}
              ${day.isEmpty ? 'bg-gray-50' : 'cursor-pointer hover:bg-gray-100 transition-colors duration-200'}
            `}
          >
            <span className="text-gray-600">{day.number}</span>
            {day.projectCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Projects Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Projects due on {selectedDate.toLocaleDateString()}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4">Loading projects...</div>
              ) : (
                <>
                  {getProjectsForDate(selectedDate).length > 0 ? (
                    getProjectsForDate(selectedDate).map(project => (
                      <div key={project._id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{project.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'done' ? 'bg-green-100 text-green-800' :
                            project.status === 'progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No projects due on this date
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCalendar;
