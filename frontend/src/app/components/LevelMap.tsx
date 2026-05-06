"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./LevelMap.module.css";

import Ampoule from "./Ampoule";
import ShipMovement from "./ShipMovement";
import LiquidLevel from "./LiquidLevel";
import Stars from "./Stars";
import StartShift from "./StartShift";
import NotesWidget from "./Notes";

export default function LevelMap() {
  const totalLevels = 8;

  // STATE
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const [stars, setStars] = useState<number[]>(Array(totalLevels).fill(0));

  const [offsetY, setOffsetY] = useState(0);
  const offsetRef = useRef(0);

  const mapRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const mapStart = useRef(0);

  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [dropping, setDropping] = useState(false);

  const [ampouleValue, setAmpouleValue] = useState(0);

  const calculateStars = (value: number) => {
    if (value >= 12) return 3;
    if (value >= 8) return 2;
    if (value >= 4) return 1;
    return 0;
  };

  const updateStars = (island: number, value: number) => {
    setStars((prev) => {
      const updated = [...prev];
      updated[island] = calculateStars(value);
      return updated;
    });
  };

  const getUnlockedLevels = () => {
    const now = new Date();
    const startHour = 7;
    const unlocked = now.getHours() - startHour + 1;
    return Math.max(0, Math.min(totalLevels, unlocked));
  };

  const loadProgress = async () => {
    try {
      const res = await fetch("/api/progress", {
        method: "GET",
      });

      const data = await res.json();
      const items = data?.d?.results ?? [];

      const newStars = Array(totalLevels).fill(0);

      items.forEach((item: any) => {
        const island = item.IslandIndex;
        const value = item.Value;

        if (island != null) {
          newStars[island] = calculateStars(value);
        }
      });

      setStars(newStars);
    } catch (err) {
      console.error("Load failed:", err);
    }
  };

  const saveProgress = async () => {
    if (selectedIsland === null) return;

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: `Island ${selectedIsland + 1}`,
          IslandIndex: selectedIsland,
          Value: ampouleValue,
        }),
      });

      const data = await res.json();

      updateStars(selectedIsland, ampouleValue);
      handleClose();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    setUnlockedCount(getUnlockedLevels());

    const interval = setInterval(() => {
      setUnlockedCount(getUnlockedLevels());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setOffsetY(0);
    offsetRef.current = 0;
  }, []);

  useEffect(() => {
    offsetRef.current = offsetY;
  }, [offsetY]);

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
    setSelectedIsland(index);
    setVisible(true);
    requestAnimationFrame(() => setDropping(true));
  };

  const handleClose = () => {
    setDropping(false);
    setTimeout(() => setVisible(false), 500);
    setTimeout(() => setSelectedIsland(null), 500);
  };

  const clamp = (value: number) => {
    if (!mapRef.current) return 0;

    const elHeight = mapRef.current.scrollHeight;
    const viewport = window.innerHeight;

    const min = Math.min(0, viewport - elHeight);
    const max = 0;

    return Math.min(max, Math.max(min, value));
  };

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

  const generatePath = () => {
    const width = 1000;
    const height = 1600;

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

    const last = points[points.length - 1];
    d += ` T ${last.x} ${last.y}`;

    return d;
  };

  return (
    <div
      className={`
        ${styles.mapWrapper}
        ${darkMode ? styles.dark : styles.light}
        ${darkMode ? "dark" : "light"}
      `}
    >
      <div style={{ position: "fixed", top: 20, left: 20, zIndex: 9999 }}>
        <StartShift />
      </div>

      <div
        className={`${styles.blurOverlay} ${visible ? styles.activeBlur : ""}`}
      />

      <button className={styles.toggle} onClick={toggleDarkMode}>
        {darkMode ? "Lava Mode" : "Tropical Mode"}
      </button>

      <div className={styles.waterLayer}></div>

      {/* ✅ ADDED NOTES WIDGET HERE */}
      <NotesWidget />

      <div
        ref={mapRef}
        className={styles.mapInner}
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        <svg
          className={styles.pathSvg}
          viewBox="0 0 1000 1600"
          preserveAspectRatio="none"
        >
          <path d={generatePath()} className={styles.pathLine} />
        </svg>

        <ShipMovement
          pathD={generatePath()}
          totalLevels={totalLevels}
          darkMode={darkMode}
        />

        {positions.map((pos, index) => {
          const unlocked = index + 1 <= unlockedCount;

          return (
            <div
              key={index}
              className={`${styles.island} ${
                unlocked ? styles.unlocked : styles.locked
              }`}
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

              {unlocked && <Stars value={stars[index]} darkMode={darkMode} />}
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", right: 20, top: 100 }}>
        <LiquidLevel value={0.7} darkMode={darkMode} />
      </div>

      {/* OVERLAY */}
      {visible && selectedIsland !== null && (
        <>
          <div className={`${styles.blurOverlay} ${styles.activeBlur}`} />

          <div
            className={`${styles.tableContainer} ${
              dropping ? styles.dropIn : styles.pullUp
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.tableSprite} ${
                darkMode ? styles.lavaTable : styles.tropicalTable
              }`}
            />

            <div className={styles.tableContent}>
              <div className={styles.part1}>
                <button className={styles.closeBtn} onClick={handleClose}>
                  ✕
                </button>
                <h2>Island {selectedIsland + 1}</h2>
                <p>Log your progress for this hour.</p>
              </div>

              <div className={styles.part2}>
                <div className={styles.singleAmpoule}>
                  <Ampoule
                    hour={selectedIsland}
                    unlocked={true}
                    maxValue={15}
                    islandId={selectedIsland}
                    onChange={(val) => setAmpouleValue(val)}
                  />
                </div>
              </div>

              <div className={styles.part3}>
                <p>
                  Track consistently to unlock more islands.
                  <span className={styles.pageNumber}>
                    {selectedIsland + 1}
                  </span>
                </p>

                <button className={styles.saveBtn} onClick={saveProgress}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
