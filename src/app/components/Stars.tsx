"use client";

import styles from "./Stars.module.css";

type Props = {
  value: number; // 0–3
};

export default function Stars({ value }: Props) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3].map((star) => (
        <span
          key={star}
          className={star <= value ? styles.filled : styles.empty}
        >
          ★
        </span>
      ))}
    </div>
  );
}
