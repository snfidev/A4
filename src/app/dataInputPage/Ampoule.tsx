"use client";

import React, { useState, useRef } from "react";
import "./Ampoule.css"; // make sure this is imported

interface AmpouleProps {
  hour: number;
  unlocked: boolean;
  maxValue: number; // e.g., 15000
}

const Ampoule: React.FC<AmpouleProps> = ({ hour, unlocked, maxValue }) => {
  const [value, setValue] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!unlocked) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const relativeY = rect.bottom - e.clientY;
    const newValue = Math.max(
      0,
      Math.min(maxValue, Math.round((relativeY / rect.height) * maxValue)),
    );
    setValue(newValue);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`ampoule ${unlocked ? "unlocked" : "locked"}`}
    >
      {/* Liquid fill */}
      <div
        className="liquid"
        style={{ height: `${(value / maxValue) * 100}%` }}
      ></div>

      {/* Display value */}
      <span className="value">{value.toLocaleString()}</span>
    </div>
  );
};

export default Ampoule;
