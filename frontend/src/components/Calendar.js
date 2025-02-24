"use client"

import { useState } from "react"
import "../CSS-files/Calendar.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstday = new Date(year, month, 1).getDay()
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevMonthDates = Array.from({ length: firstday }, (_, i) => 
    prevMonthLastDay - firstday + 1 + i
  )
//const currentMonthDates = Array({ length: daysInCurrentMonth }, (_, i) => i + 1)
  const currentMonthDates = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)
  const totalDaysDisplayed = prevMonthDates.length + currentMonthDates.length
  const nextMonthDates = Array.from({ length: 42 - totalDaysDisplayed }, (_, i) => i + 1)

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const prevmonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const dateclick = (date, iscurrentMonth) => {
    if (iscurrentMonth) {
      setSelectedDate(new Date(year, month, date))
    }
  }

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar-header">
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })} {year}
          </h2>
          <div className="nav-buttons">
            <button className="nav-buttonl" onClick={prevmonth}>
              {/* Previous month arrow */}

            </button>
            <button className="nav-buttonr" onClick={handleNextMonth}>
              
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="day-name">{day}</div>
          ))}

          {[...prevMonthDates, ...currentMonthDates, ...nextMonthDates].map((date, index) => {
            const isPrevMonth = index < prevMonthDates.length
            const isnextmonth = index >= prevMonthDates.length + currentMonthDates.length
            const iscurrentMonth = !isPrevMonth && !isnextmonth
            
            const isSelected = selectedDate && 
              selectedDate.getDate() === date &&
              selectedDate.getMonth() === month &&
              selectedDate.getFullYear() === year



            const isCurrentDate = 
              date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear() &&
              iscurrentMonth
  
            return (
              <button
                key={`${date}-${index}`}
                className={`date-button 
                  ${isPrevMonth ? "prev-month" : ""} 
                  ${isnextmonth ? "nextmonth" : ""} 
                  ${isSelected ? "selected" : ""}
                  ${isCurrentDate ? "current-date" : ""}`}
                onClick={() => dateclick(date, iscurrentMonth)}
              >
                {date}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar

