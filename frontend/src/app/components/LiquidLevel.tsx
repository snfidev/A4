"use client";

import { useEffect, useState } from "react";
import styles from "./LiquidLevel.module.css";

interface Bubble {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

export default function LiquidLevel({
  value = 0.6,
  width = 60,
  darkMode = false,
}: {
  value?: number;
  width?: number;
  darkMode?: boolean;
}) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // continuously generate bubbles
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
    <div className={styles.wrapper} style={{ width }}>
      <div className={styles.glass}>
        {/* LIQUID */}
        <div
          className={styles.liquid}
          style={{
            height: `${value * 100}%`,
            background: darkMode
              ? "linear-gradient(180deg, #7f1d1d, #3b0a0a)" // deep lava red
              : "linear-gradient(180deg, #6ec6ff, #3fa9f5)", // water
          }}
        >
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
                background: darkMode
                  ? "rgba(255, 100, 100, 0.8)" // light red bubbles for lava
                  : "rgba(255, 255, 255, 0.7)", // normal water bubbles
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
