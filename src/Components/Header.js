import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { MdPlayArrow } from 'react-icons/md';

class Header extends React.Component {
  render() {
    return (
      <nav className="bottom-navbar">
        <NavLink 
          to="/search" 
          className="nav-item"
          activeClassName="nav-item active"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </NavLink>
        
        <NavLink 
          to="/player" 
          className="nav-item"
          activeClassName="nav-item active"
        >
          <MdPlayArrow className="nav-icon" />
        </NavLink>
        
        <NavLink 
          to="/favorites" 
          className="nav-item"
          activeClassName="nav-item active"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className="nav-item"
          activeClassName="nav-item active"
        >
          <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </NavLink>
      </nav>
    );
  }
}

export default Header;
