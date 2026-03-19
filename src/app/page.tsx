'use client';

import React, { useState } from 'react';
import './page.css';
import Image from 'next/image';
import logo from './logo.png';

const Page: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar">
        <Image src={logo} alt="Company Logo" className="logo" />
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
          <div className="box">Last shift pie chart</div>
          <div className="box">Last hour pie chart</div>
        </div>
        <div className="bottom">Last shift line graph</div>
      </div>
    </div>
  );
};

export default Page;
