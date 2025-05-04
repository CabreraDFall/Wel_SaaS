import React from 'react'   
import './sidebar.css'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../../assets/Logo';
import Nav from '../Nav';
import LeftIcon from '../icons/LeftIcon';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar gap-12 flex flex-col ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} id="sidebar">
      <div className='top flex items-center gap-8'>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo color='black' />
        </Link>
        <LeftIcon onClick={toggleSidebar} className="web-hidden" />
      </div>

      <div className='sidebarItems center flex flex-col'>
        <ul className='flex flex-col'>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <p className='title'>Inicio</p>
          </NavLink>
          <NavLink to="/reception" className={({ isActive }) => isActive ? 'active' : ''}>
            <p className='title'>Recepcion</p>
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
            <p className='title'>Productos</p>
          </NavLink>
          <NavLink to="/labels" className={({ isActive }) => isActive ? 'active' : ''}>
            <p className='title'>Etiquetas</p>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
            <p className='title'>Usuarios</p>
          </NavLink>
        </ul>
      </div>
      <div className='bottom'>
        <div className='colorOption'></div>
        <div className='colorOption'></div>
        <div className='colorOption'></div>
      </div>
    </div>
  );
};

export default Sidebar;
