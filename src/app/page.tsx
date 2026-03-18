'use client';

import React, { useState } from 'react';
import './page.css';
import logo from './logo.png'; // Place your logo in the same folder

const Page: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar">
        <img src="./Logo monochrome RGB white PNG.png" alt="Company Logo" className="logo" />
        <button className="menu-toggle" onClick={toggleMenu}>&#9776;</button>
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          <button>Item 1</button>
          <button>Item 2</button>
          <button>Item 3</button>
          <button>Item 4</button>
        </div>
      </div>
      <div className="main">
        <div className="navbar">
          <span className="navbar-title">Dashboard</span>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="top">
          <div className="box">Top Left</div>
          <div className="box">Top Right</div>
        </div>
        <div className="bottom">Bottom (Large)</div>
      </div>
    </div>
  );
};

export default Page;
