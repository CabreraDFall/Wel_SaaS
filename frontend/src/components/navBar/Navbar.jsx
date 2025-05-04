import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';
import setting_icon from '../../assets/setting_icon.svg';
import small_search_icon from '../../assets/small_search.svg';
import MenuIcon from '../icons/MenuIcon'; // Importa el icono MenuIcon

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn'); // Eliminar o establecer isLoggedIn en false
    navigate('/login');
  };

  return (
    <div className='navbar flex justify-between items-center'>
      
      <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}>
        <MenuIcon /> {/* Usa el componente MenuIcon */}
      </button>
      <div className='flex gap-4 items-center'>
      <img src={small_search_icon} alt="search" />
      <Link to="/settings">
        <img src={setting_icon} alt="Settings" style={{ cursor: 'pointer' }} />
      </Link>
      <div className="profile" onClick={handleLogout} style={{ cursor: 'pointer' }}>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
