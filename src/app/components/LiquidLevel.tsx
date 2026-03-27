"use client";

import { useEffect, useState } from "react";
import styles from "./LiquidLevel.module.css";

interface Bubble {
  id: number;
  left: number;
  top: number; // ADD THIS
  size: number;
  duration: number;
  delay: number;
}

export default function LiquidLevel({
  value = 0.6,
  width = 60,
  height = 600,
}: {
  value?: number;
  width?: number;
  height?: number;
}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // continuously regenerate bubbles (so they feel random, not static)
  useEffect(() => {
    const generate = () => {
      return Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 6,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 5,
      }));
    };

    setBubbles(generate());
  }, []);

  return (
    <div className={styles.wrapper} style={{ width, height }}>
      <div className={styles.glass}>
        {/* LIQUID */}
        <div className={styles.liquid} style={{ height: `${value * 100}%` }}>
          {/* WAVES */}
          <div className={styles.waveBack} />
          <div className={styles.wave} />

          {/* BUBBLES */}
          {bubbles.map((b) => (
            <span
              key={b.id}
              className={styles.bubble}
              style={{
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: b.size,
                height: b.size,
                animationDuration: `${b.duration}s`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
