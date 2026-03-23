"use client";

import React, { useState, useRef } from "react";

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
    const relativeY = rect.bottom - e.clientY; // distance from bottom
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
      style={{
        width: 60,
        height: 200,
        border: "2px solid gray",
        borderRadius: 30,
        position: "relative",
        overflow: "hidden",
        backgroundColor: unlocked ? "#eee" : "#ccc",
        cursor: unlocked ? "pointer" : "not-allowed",
        margin: 10,
      }}
    >
      {/* Liquid fill */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: `${(value / maxValue) * 100}%`,
          background: "linear-gradient(to top, #ff4b1f, #ff9068)", // lava-like
          borderRadius: "50% 50% 0 0",
          transition: "height 0.1s ease-out",
        }}
      ></div>

      {/* Display value */}
      <span
        style={{
          position: "absolute",
          bottom: 5,
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        {value.toLocaleString()}
      </span>
    </div>
  );
};

export default Ampoule;
