'use client';

import './mainPageComponents/page.css';
import React, { useState } from 'react';
import Image from 'next/image';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`container ${darkMode ? 'dark' : 'light'}`}>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-wrapper">
          <Image
            src="/logo.png"
            alt="Company Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Menu Buttons */}
        <div className="menu-items">
          <button>Item 1</button>
          <button>Item 2</button>
          <button>Item 3</button>
          <button>Item 4</button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Navbar */}
        <div className="navbar">
          <span className="navbar-title">Dashboard</span>
          {/* Dark Mode Toggle now on the right side */}
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}