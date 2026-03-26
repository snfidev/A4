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
    angle: 0,
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

      const angle =
        (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) /
        Math.PI;

      setShip({
        x: point.x,
        y: point.y,
        angle,
      });
    };

    updateShip();
    const interval = setInterval(updateShip, 30000); // smoother updates

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
            transform: `translate(-50%, -50%) rotate(${ship.angle}deg)`,
          }}
        >
          <img src="/sprites/ship.png" alt="ship" />
        </div>
      </div>
    </>
  );
}
