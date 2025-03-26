import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Header.css';

const Header = ({ toggleMenu, menuOpen }) => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <header className="header">
      <button 
        className={`menu-btn ${menuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <button className="theme-toggle" onClick={toggleTheme}>
        🌓 Toggle Theme
      </button>
    </header>
  );
};

export default Header; 