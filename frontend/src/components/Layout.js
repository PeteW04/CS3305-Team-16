import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './sidebar';

function Layout() {
  const [isMinimized, setIsMinimized] = React.useState(true);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
        <main className="flex-1 h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
