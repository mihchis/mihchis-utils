import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import '../styles/Header.css';

const Header = ({ toggleMenu, menuOpen, goHome }) => {
  const { toggleTheme } = useContext(ThemeContext);
  const { toggleLanguage, t } = useContext(LanguageContext);

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
      
      <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); goHome(); }}>
        <h1 className="logo">Michis-Utils</h1>
      </a>
      
      <div className="header-controls">
        <button className="language-toggle" onClick={toggleLanguage}>
          <span>{t('toggleLanguage')}</span>
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          🌓 {t('toggleTheme')}
        </button>
      </div>
    </header>
  );
};

export default Header; 