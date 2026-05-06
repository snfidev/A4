"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Ampoule.module.css";

interface AmpouleProps {
  hour: number;
  unlocked: boolean;
  maxValue: number;
  islandId?: number;
  onChange: (value: number) => void;
}

const Ampoule: React.FC<AmpouleProps> = ({
  hour,
  unlocked,
  maxValue,
  onChange,
}) => {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ---------------- LOAD SAVED VALUE ----------------
  useEffect(() => {
    const saved = localStorage.getItem(`ampoule-${hour}`);
    if (saved) {
      const parsed = Number(saved);
      setValue(parsed);
      onChange(parsed);
    }
  }, [hour]);

  // ---------------- SAVE + SYNC ----------------
  useEffect(() => {
    localStorage.setItem(`ampoule-${hour}`, value.toString());
    onChange(value);
  }, [value, hour, onChange]);

  // ---------------- DRAG LOGIC ----------------
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!unlocked || !isDragging) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    const relativeY = rect.bottom - e.clientY;

    const newValue = Math.max(
      0,
      Math.min(maxValue, Math.round((relativeY / rect.height) * maxValue)),
    );

    setValue(newValue);
  };

  const startDrag = () => {
    if (!unlocked) return;
    setIsDragging(true);
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  // ---------------- RENDER ----------------
  return (
    <div
      ref={containerRef}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={handleMouseMove}
      className={`${styles.ampoule} ${unlocked ? styles.unlocked : styles.locked}`}
    >
      {/* Liquid fill */}
      <div
        className={styles.liquid}
        style={{ height: `${(value / maxValue) * 100}%` }}
      />

      {/* Value display */}
      <span className={styles.value}>{value}</span>
    </div>
  );
};

export default Ampoule;
