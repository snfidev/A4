"use client";

import React, { useState, useRef } from "react";
import "./Ampoule.css";

interface AmpouleProps {
  hour: number;
  unlocked: boolean;
  maxValue: number;
  islandId?: number;
}

const Ampoule: React.FC<AmpouleProps> = ({ hour, unlocked, maxValue }) => {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!unlocked || !isDragging) return;

    const rect = containerRef.current!.getBoundingClientRect();
    const relativeY = rect.bottom - e.clientY;

    const newValue = Math.max(
      0,
      Math.min(maxValue, Math.round((relativeY / rect.height) * maxValue)),
    );

    setValue(newValue);
  };

  // persist values in localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(`ampoule-${hour}`);
    if (saved) setValue(Number(saved));
  }, [hour]);

  React.useEffect(() => {
    localStorage.setItem(`ampoule-${hour}`, value.toString());
  }, [value, hour]);

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
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
