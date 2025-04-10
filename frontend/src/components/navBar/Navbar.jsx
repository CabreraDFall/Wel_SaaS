import React from 'react'
import './navbar.css'
import setting_icon from '../../assets/setting_icon.svg'
import small_search_icon from '../../assets/small_search.svg'
const Navbar = () => {
  return (
    <div className='navbar flex justify-end items-center'>
       
       <img src={small_search_icon} alt="search" />
       <img src={setting_icon} alt="Settings" />   
       <div className="profile">
       
       </div>
    </div>
  )
}

export default Navbar;
