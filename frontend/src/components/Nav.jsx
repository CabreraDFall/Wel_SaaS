import React from 'react';
import logo from '../assets/logo.svg';
import { httpService } from '../services/api/httpService';
import { useNavigate } from 'react-router-dom';

const Nav = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await httpService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav>
      <img src={logo} alt="logo" />
  
    </nav>
  );
};

export default Nav;
