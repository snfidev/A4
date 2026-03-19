'use client';

import React, { useState } from 'react';
import './page.css';
import Image from 'next/image';
import logo from './logo.png';
import BallBox from './BallBox'; // <-- import the component

export default function Page() {
  // Dashboard state
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Ball counters
  const [goodCount, setGoodCount] = useState(0);
  const [badCount, setBadCount] = useState(0);

  const [items, setItems] = useState(0);
  const [drops, setDrops] = useState(0);

  const addItem = () => {
    setItems(prev => {
      const next = prev + 1;
      if (next % 100 === 0) setDrops(d => d + 1);
      return next;
    });
  };

  const addGood = () => {
    addItem();
    setGoodCount(prev => prev + 1);
  };

  const addBad = () => {
    addItem();
    setBadCount(prev => prev + 1);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>
      <div className="sidebar">
        <Image src={logo} alt="Company Logo" className="logo" />
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          <button>Item 1</button>
          <button>Item 2</button>
          <button>Item 3</button>
          <button>Item 4</button>
        </div>

        <button onClick={addGood}>+ Good</button>
        <button onClick={addBad}>+ Bad</button>
      </div>

      <div className="main">
        <div className="navbar">
          <span className="navbar-title">Dashboard</span>
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="top">
          <div className="box">
            <BallBox trigger={goodCount} color="green" />
          </div>
          <div className="box">
            <BallBox trigger={badCount} color="red" />
          </div>
        </div>

        <div className="bottom">Last shift line graph</div>
      </div>
    </div>
  );
}