import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <Link to="/settings">
        <img
          src={setting_icon}
          alt="Settings"
          style={{ cursor: 'pointer' }}
        />
      </Link>
      <div className="profile"  onClick={handleLogout} style={{ cursor: 'pointer' }}>
      </div>
    </div>
  );
};

export default Navbar;
