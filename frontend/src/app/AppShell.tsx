"use client";

import "./mainPageComponents/page.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  path: string;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);

  // Initialize darkMode once on client
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setDarkMode(saved === "true");
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  // Save whenever darkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Menu items
  const menuItems: MenuItem[] = [
    { label: "Input 1", path: "/item1" },
    { label: "Item 2", path: "/item2" },
    { label: "Item 3", path: "/item3" },
    { label: "Item 4", path: "/item4" },
  ];

  return (
    <div className="app-shell">
      {/* Background layer */}
      <div className={`background ${darkMode ? "lava" : "water"}`} />

      {/* Foreground content */}
      <div className={`container ${darkMode ? "dark" : "light"}`}>
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo-wrapper">
            <Image
              src="/logo.png"
              alt="Company Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Menu Buttons */}
          <div className="menu-items">
            {menuItems.map((item) => (
              <Link href={item.path} key={item.path} passHref>
                <button className={pathname === item.path ? "active" : ""}>
                  <span>{item.label}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="navbar">
            <span className="navbar-title">Dashboard</span>
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
