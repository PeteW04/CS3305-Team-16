import React from "react";
import Calendar from "../components/Calendar";

const CalendarPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 