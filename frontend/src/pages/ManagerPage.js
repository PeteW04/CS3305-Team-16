
import { useState } from "react"
import Sidebar from "../components/sidebar"
import UserList from "../components/UserList"
import ProjectSummary from "../components/ProjectSummary"
import "../CSS-files/ManagerPage.css"

export default function ManagerPage() {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="dashboard">
      {/* Left Sidebar */}
      <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Content */}
        <main className="dashboard-main">
          <h1 className="dashboard-title">Dashboard</h1>

          <div className="dashboard-grid">
            <div className="left-column">
            </div>
            {/* User List Bubble */}
            <UserList />
          </div>
        </main>
      </div>
    </div>
  )
}




