import UserList from "../components/UserList"
import "../CSS-files/ManagerPage.css"

export default function ManagerPage() {
  return (
    <div className="p-6">
      <main className="dashboard-main">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-grid">
          <div className="left-column">
          </div>
          <UserList />
        </div>
      </main>
    </div>
  )
}




