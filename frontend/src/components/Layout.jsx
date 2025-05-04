import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navBar/Navbar';
import '../components/sidebar/sidebar.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div style={{ marginLeft: isSidebarOpen ? '240px' : '0px', marginTop: '60px' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
