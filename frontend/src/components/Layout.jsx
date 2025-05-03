import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navBar/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ marginLeft: '240px', marginTop: '60px' }}> {/* Ajustar los estilos según sea necesario */}
        {children}
        
      </div>
    </div>
  );
};

export default Layout;
