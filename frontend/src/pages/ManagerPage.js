
import { useState } from "react"
import Sidebar from "../components/sidebar"
import UserList from "../components/UserList"
import "../CSS-files/ManagerPage.css"

export default function ManagerPage() {
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="dashboard">
      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Content */}
        <main className="dashboard-main">
          <h1 className="dashboard-title">Team Management</h1>
          <UserList />
        </main>
      </div>
    </div>
  )
}







