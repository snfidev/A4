"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./LevelMap.module.css";

export default function LevelMap() {
  const totalLevels = 8;
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const [offsetY, setOffsetY] = useState(0);
  const offsetRef = useRef(0);

  const dragStart = useRef(0);
  const mapStart = useRef(0);

  // --- Time-based unlocking ---
  const getUnlockedLevels = () => {
    const now = new Date();
    const startHour = 6;
    const unlocked = now.getHours() - startHour + 1;
    return Math.max(0, Math.min(totalLevels, unlocked));
  };

  useEffect(() => {
    setUnlockedCount(getUnlockedLevels());
    const interval = setInterval(
      () => setUnlockedCount(getUnlockedLevels()),
      60000,
    );
    return () => clearInterval(interval);
  }, []);

  // --- Start at top ---
  useEffect(() => {
    setOffsetY(0);
    offsetRef.current = 0;
  }, []);

  // --- Sync ref ---
  useEffect(() => {
    offsetRef.current = offsetY;
  }, [offsetY]);

  // --- Dark mode ---
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(saved === "true");
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const positions = [
    { x: 50, y: 11 },
    { x: 30, y: 20 },
    { x: 70, y: 30 },
    { x: 40, y: 42 },
    { x: 60, y: 55 },
    { x: 35, y: 68 },
    { x: 65, y: 82 },
    { x: 50, y: 95 },
  ];

  const getIslandSrc = (index: number) => {
    const theme = darkMode ? "lava" : "tropical";
    return `/islands/${theme}/island${index + 1}.png`;
  };

  const handleClick = (index: number, unlocked: boolean) => {
    if (!unlocked) return;
    console.log("Clicked island:", index + 1);
  };

  // FIXED clamp
  const clamp = (value: number) => {
    if (!mapRef.current) return 0;

    const elHeight = mapRef.current.scrollHeight;
    const viewport = window.innerHeight;

    const min = Math.min(0, viewport - elHeight);
    const max = 0;

    return Math.min(max, Math.max(min, value));
  };

  // --- Drag logic ---
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let dragging = false;

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      dragStart.current = e.clientY;
      mapStart.current = offsetRef.current;
      el.classList.add(styles.dragging);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dy = e.clientY - dragStart.current;
      const next = clamp(mapStart.current + dy);
      offsetRef.current = next;
      setOffsetY(next);
    };

    const onMouseUp = () => {
      dragging = false;
      el.classList.remove(styles.dragging);
    };

    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      dragStart.current = e.touches[0].clientY;
      mapStart.current = offsetRef.current;
      el.classList.add(styles.dragging);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const dy = e.touches[0].clientY - dragStart.current;
      const next = clamp(mapStart.current + dy);
      offsetRef.current = next;
      setOffsetY(next);
    };

    const onTouchEnd = () => {
      dragging = false;
      el.classList.remove(styles.dragging);
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    el.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // ✅ Curved dotted path (SSR safe)
  const generatePath = () => {
    const width = 1000; // virtual SVG width
    const height = 1600; // must match map height

    const points = positions.map((p) => ({
      x: (p.x / 100) * width,
      y: (p.y / 100) * height,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

      d += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }

    return d;
  };

  return (
    <div
      className={`${styles.mapWrapper} ${darkMode ? styles.dark : styles.light}`}
    >
      <button className={styles.toggle} onClick={toggleDarkMode}>
        {darkMode ? "Lava Mode" : "Tropical Mode"}
      </button>

      <div className={styles.waterLayer}></div>

      <div
        ref={mapRef}
        className={styles.mapInner}
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        {/* ✅ PATH behind islands */}
        <svg
          className={styles.pathSvg}
          viewBox="0 0 1000 1600"
          preserveAspectRatio="none"
        >
          <path d={generatePath()} className={styles.pathLine} />
        </svg>

        {positions.map((pos, index) => {
          const unlocked = index + 1 <= unlockedCount;
          return (
            <div
              key={index}
              className={`${styles.island} ${unlocked ? styles.unlocked : styles.locked}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                animationDelay: `${index * 0.3}s`,
              }}
              onClick={() => handleClick(index, unlocked)}
            >
              <Image
                src={getIslandSrc(index)}
                alt="Island"
                width={350}
                height={350}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
