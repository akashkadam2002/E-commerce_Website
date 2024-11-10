import React from 'react';
import './Navbar.css';
import nav_logo from '../../assets/nav-logo.svg'
import nav_profile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={nav_logo} alt="" className='navlogo'  />
      <img  src={nav_profile} alt="" className='navprofile'/>
    </div>
  );
}

export default Navbar;
