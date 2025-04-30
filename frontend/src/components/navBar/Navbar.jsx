import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import setting_icon from '../../assets/setting_icon.svg';
import small_search_icon from '../../assets/small_search.svg';

const Navbar = () => {
  const navigate = useNavigate();

 const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn'); // Eliminar o establecer isLoggedIn en false
    navigate('/login');
  };

  return (
    <div className='navbar flex justify-end items-center'>
      <img src={small_search_icon} alt="search" />
      <img
        src={setting_icon}
        alt="Settings"
        onClick={handleLogout}
        style={{ cursor: 'pointer' }}
      />
      <div className="profile">
      </div>
    </div>
  );
};

export default Navbar;
