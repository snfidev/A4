"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ShipMovement.module.css";

type Props = {
  pathD: string;
  totalLevels: number;
};

export default function ShipMovement({ pathD, totalLevels }: Props) {
  const pathRef = useRef<SVGPathElement>(null);

  const [ship, setShip] = useState({
    x: 0,
    y: 0,
    direction: 1, // 1 = right, -1 = left
  });

  // --- Time → progress (7 AM start) ---
  const getProgress = () => {
    const now = new Date();

    const startHour = 7;
    const endHour = startHour + totalLevels;

    const current =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

    const progress = (current - startHour) / (endHour - startHour);

    return Math.max(0, Math.min(1, progress));
  };

  useEffect(() => {
    const updateShip = () => {
      if (!pathRef.current) return;

      const path = pathRef.current;
      const length = path.getTotalLength();

      const progress = getProgress();

      const point = path.getPointAtLength(progress * length);
      const nextPoint = path.getPointAtLength(
        Math.min(progress * length + 2, length),
      );

      const dx = nextPoint.x - point.x;

      // determine direction
      const direction = Math.abs(dx) < 0.1 ? ship.direction : dx >= 0 ? 1 : -1;

      setShip({
        x: point.x,
        y: point.y,
        direction,
      });
    };

    // run once immediately
    updateShip();

    // then update over time
    const interval = setInterval(updateShip, 30000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* Invisible path (used for calculations) */}
      <svg viewBox="0 0 1000 1600" style={{ display: "none" }}>
        <path ref={pathRef} d={pathD} />
      </svg>

      {/* Ship */}
      <div
        className={styles.ship}
        style={{
          left: `${(ship.x / 1000) * 100}%`,
          top: `${(ship.y / 1600) * 100}%`,
        }}
      >
        <div
          className={styles.shipInner}
          style={{
            transform: `translate(-50%, -50%) scaleX(${ship.direction})`,
          }}
        >
          <img src="/sprites/ship.png" alt="ship" />
        </div>
      </div>
    </>
  );
}
