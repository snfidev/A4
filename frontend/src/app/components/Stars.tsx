"use client";

import Image from "next/image";
import styles from "./Stars.module.css";

type Props = {
  value: number;
  darkMode: boolean;
};

export default function Stars({ value, darkMode }: Props) {
  const src = darkMode
    ? "/sprites/lava-star.png"
    : "/sprites/tropical-star.png";

  return (
    <div className={styles.stars}>
      {[1, 2, 3].map((star) => (
        <Image
          key={star}
          src={src}
          alt="star"
          width={40}
          height={40}
          className={star <= value ? styles.filled : styles.empty}
        />
      ))}
    </div>
  );
}
